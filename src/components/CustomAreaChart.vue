<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { min, max } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { stack, area, curveBundle } from 'd3-shape';
import { createDateArray, findWeekEnd, createStackedAreaArray } from "../utils/arrays";
import { filterXTicks } from "../utils/tickFilters";
import { selectAccessibleColorPalette } from "../utils/colorSchemes";
import CustomTooltipWithBarChart from "./CustomTooltipWithBarChart.vue";
import CustomCategoricalLegend from "./CustomCategoricalLegend.vue";

const props = defineProps({
  aggregatedData: { type: Array, required: true },
  firstWeek: { type: Number, required: true },
  lastWeek: { type: Number, required: true },
  areaChartRange: { type: Number, required: true },
  weekStartKey: { type: String, default: "week_start" },
  weekEndKey: { type: String, default: "week_end" },
  valueKey: { type: String, default: "mean_lineage_prevalence" },
  labelKey: { type: String, default: "name" },
  weekKey: { type: String, default: "epiweek" },
  regionKey: { type: String, default: "geo_loc_region" },
  xAxisLabel: { type: String, default: "last epiweek day" },
  yAxisLabel: { type: String, default: "prevalence (%)" },
  height: { type: Number, default: 330 },
  barChartTitle: { type: String, default: "Average prevalence" },

  // Margins
  marginTop: { type: Number, default: 50 },
  marginRight: { type: Number, default: 130 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 70 },

  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 10 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 10 },
});

const width = ref(500);
const hoveredDate = ref(null);
const hoveredPoint = ref(null);
const tooltipData = ref([]);

const containerMargins = computed(() => ({
  marginTop: props.containerMarginTop + "px",
  marginRight: props.containerMarginRight + "px",
  marginBottom: props.containerMarginBottom + "px",
  marginLeft: props.containerMarginLeft + "px",
}));

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.innerWidth >= 1000) {
    width.value = 1000;
  } else {
    width.value = window.innerWidth;
  }
};

const weekStartAccessor = (d) => d[props.weekStartKey];
const weekEndAccessor = (d) => d[props.weekEndKey];
const yAccessor = (d) => d[props.valueKey];
const weekAccessor = (d) => d[props.weekKey];
const labelAccessor = (d) => d[props.labelKey];
const regionAccessor = (d) => d[props.regionKey];

const formatValueKey = format(".2s");
const parseTime = timeParse("%Y-%m-%d");
const formatTime = timeFormat("%b %e");

const uniqueLabels = computed(() =>
  [...new Set(props.aggregatedData.map(labelAccessor))]
    .sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    }),
);

const numOfUniqueWeeks = computed(() => [...new Set(props.aggregatedData.map(weekAccessor))].length);

const firstWeekEnd = computed(() => findWeekEnd(props.firstWeek, props.aggregatedData, weekAccessor, weekEndAccessor ));

const lastWeekEnd = computed(() => findWeekEnd(props.lastWeek, props.aggregatedData, weekAccessor, weekEndAccessor ));

const xScaleDomain = computed(() =>
  createDateArray(firstWeekEnd.value, lastWeekEnd.value, props.areaChartRange),
);

const data = computed(() => createStackedAreaArray(props.aggregatedData, uniqueLabels.value, weekAccessor, weekStartAccessor, weekEndAccessor, labelAccessor, yAccessor));

const datesWithData = computed(() => {
  const dates = [...new Set(props.aggregatedData.map(d => d.week_end))];
  return dates.sort((a, b) => new Date(a) - new Date(b));
});

const marginTop = props.marginTop;
const marginRight = props.marginRight;
const marginBottom = props.marginBottom;
const marginLeft = props.marginLeft;

const innerWidth = computed(() => width.value - marginLeft - marginRight);
const innerHeight = computed(() => props.height - marginTop - marginBottom);

const stackSeries = computed(() => stack()
  .keys(uniqueLabels.value)
);

const series = computed(() => stackSeries.value(data.value));

const xScale = computed(() => 
  scaleBand()
    .domain(xScaleDomain.value)
    .range([0, innerWidth.value])
    .padding(0)
  );

const yScale = scaleLinear()
  .domain([0, 100])
  .range([innerHeight.value, 0])
  .nice();

const allXTicks = computed(() => xScale.value.domain());

const xTicksToBeRendered = computed(() =>
  filterXTicks(allXTicks.value, innerWidth.value)
);

const yTicks = computed(() => {
  const numberOfYTicks = Math.floor(innerHeight.value / 40);
  return yScale.ticks(numberOfYTicks);
});

const areaGenerator = computed(() => 
  area()
    .x((d) => {
      return xScale.value(weekEndAccessor(d.data));
    })
    .y1((d) => yScale(d[1]))
    .y0((d) => yScale(d[0]))
    .curve(curveBundle.beta(1)),
);

const colors = computed(() => selectAccessibleColorPalette(uniqueLabels.value));

const colorScale = computed(() => scaleOrdinal(colors.value).domain(uniqueLabels.value));

const handleMouseMove = e => {
  const xPosition = e.offsetX - marginLeft;
  const yPosition = e.offsetY - marginTop;

  if (datesWithData.value.length > 0) {
    // find the closest date with data (horizontal snapping)
    hoveredDate.value = datesWithData.value.reduce((prev, curr) => {
      const prevX = xScale.value(prev);
      const currX = xScale.value(curr);
      return Math.abs(prevX - xPosition) < Math.abs(currX - xPosition) ? prev : curr;
    });

    // filter data for the hovered date
    tooltipData.value = props.aggregatedData.filter(item =>
      weekEndAccessor(item) === hoveredDate.value
    );

  } else {
    hoveredDate.value = null;
    tooltipData.value = [];
  }
}

const handleMouseLeave = () => {
  hoveredDate.value = null;
  tooltipData.value = [];
}
</script>

<template>
  <div
    v-if="numOfUniqueWeeks > 1"
    class="stacked-area-chart-wrapper">
        <CustomCategoricalLegend
          :categories="uniqueLabels"
          :colorScale="colorScale"
        />
      <svg
        role="img"
        :width="width - containerMarginLeft - containerMarginRight"
        :height="height"
      >
        <g :transform="`translate(${marginLeft}, ${marginTop})`">
          <!-- y-axis -->
          <g>
            <line
              x1="0"
              x2="0"
              :y1="0"
              :y2="innerHeight"
              stroke="#bdc3c7"
              stroke-width="1"
            />
            <text
              x="-12"
              y="-25"
              text-anchor="middle"
              fill="#2c3e50"
              font-size="14px"
              font-weight="700"
            >
              {{ yAxisLabel }}
            </text>
            <g
              v-for="tick in yTicks"
              :key="tick"
              :transform="`translate(0, ${yScale(tick)})`"
            >
              <line x1="0" x2="-6" stroke="#bdc3c7" stroke-width="1" />
              <text
                x="-10"
                dy="0.32em"
                text-anchor="end"
                fill="#2c3e50"
                font-size="14px"
              >
                {{ tick === 0 ? 0 : formatValueKey(tick) }}
              </text>
            </g>
          </g>
          
          <!-- x-axis -->
          <g :transform="`translate(0, ${innerHeight})`">
            <line x1="0" :x2="innerWidth" stroke="#bdc3c7" />
            <text
              :x="innerWidth / 2"
              text-anchor="middle"
              y="45"
              fill="#2c3e50"
              font-size="14px"
              font-weight="700"
            >
              {{ xAxisLabel }}
            </text>
            <g
              v-for="(tick, index) in xTicksToBeRendered"
              :key="'tick-' + index"
              :transform="`translate(${xScale(tick)}, 0)`"
            >
              <line :y1="0" :y2="6" stroke="#bdc3c7" />
              <text
                y="10"
                dy="0.8em"
                text-anchor="middle"
                :fill="hoveredDate ? '#bdc3c7' : '#2c3e50'"
                font-size="14px"
              >
                {{ formatTime(parseTime(tick)) }}
              </text>
            </g>
            <g v-if="hoveredDate && tooltipData.length > 0"
              :transform="`translate(${xScale(hoveredDate)}, 0)`"
            >
              <text
                y="10"
                dy="0.8em"
                text-anchor="middle"
                stroke="#ffffff"
                stroke-width="4px"
                font-size="14px"
              >
                {{ formatTime(parseTime(hoveredDate)) }}
              </text>
              <text
                y="10"
                dy="0.8em"
                text-anchor="middle"
                stroke="#000dcb"
                stroke-width="1px"
                font-size="14px"
              >
                {{ formatTime(parseTime(hoveredDate)) }}
              </text>
            </g>
          </g>

          <g>
            <path
              v-for="(s, index) in series" 
              :key="'s-' + index"
              :d="areaGenerator(s)"
              stroke="none"
              :fill="colorScale(index)"
            />
          </g>

          <!-- vertical line -->
          <g v-if="hoveredDate && tooltipData.length > 0"
            :transform="`translate(${xScale(hoveredDate)}, 0)`"
          >
            <line
              x1="0"
              x2="0"
              :y1="0"
              :y2="innerHeight"
              stroke="#ffffff"
              stroke-width="3px"
            />
            <line
              x1="0"
              x2="0"
              :y1="0"
              :y2="innerHeight + 6"
              stroke="#000dcb"
              stroke-width="2px"
            />
          </g>
          <rect
            :width="innerWidth"
            :height="innerHeight"
            :x="0"
            :y="0"
            fill="#ffffff"
            fill-opacity="0"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
          />
        </g>
      </svg>
      <CustomTooltipWithBarChart 
        v-if="hoveredDate && tooltipData.length > 0"
        :width="width"
        :hoveredDate="hoveredDate"
        :tooltipData="tooltipData"
        :xScale="xScale"
        :xAccessor="yAccessor"
        :labelAccessor="labelAccessor"
        :colorScale="colorScale"
        :weekAccessor="weekAccessor"
        :weekStartAccessor="weekStartAccessor"
        :weekEndAccessor="weekEndAccessor"
        :regionAccessor="regionAccessor"
        barChartTitle="Average prevalence"
      />
    </div>
</template>

<style>
.stacked-area-chart-wrapper {
  position: relative;
}
</style>
