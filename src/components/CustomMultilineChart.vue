<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { min, max } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { line, area } from "d3-shape";
import { createDateArray } from "../utils/arrays";
import { selectAccessibleColorPalette } from "../utils/colorSchemes";
import { quadtree } from "d3-quadtree";
import CustomTooltipWithBarChart from "./CustomTooltipWithBarChart.vue";
import CustomCategoricalLegend from "./CustomCategoricalLegend.vue";

const props = defineProps({
  data: { type: Array, required: true },
  setLabel: { type: String, default: "label" },
  setData: { type: String, default: "data" },
  dateKey: { type: String, default: "date" },
  valueKey: { type: String, default: "proportion" },
  lowerCIKey: { type: String, default: "proportion_ci_lower" },
  upperCIKey: { type: String, default: "proportion_ci_upper" },
  xAxisLabel: { type: String, default: "date" },
  yAxisLabel: { type: String, default: "prevalence (%)" },
  height: { type: Number, default: 300 },
  tooltipTitle: { type: String, default: "San Diego, CA, USA" },
  barChartTitle: { type: String, default: "Prevalence" },

  // Margins
  marginTop: { type: Number, default: 35 },
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

const setLabelAccessor = (d) => d[props.setLabel];
const setDataAccessor = (d) => d[props.setData];
const xAccessor = (d) => d[props.dateKey];
const yAccessor = (d) => d[props.valueKey];
const lowerCIAccessor = (d) => d[props.lowerCIKey];
const upperCIAccessor = (d) => d[props.upperCIKey];

const formatValueKey = format(".2s");
const parseTime = timeParse("%Y-%m-%d");
const formatTime = timeFormat("%b %e");

const uniqueLabels = computed(() => {
  const labels = [...new Set(props.data.map(setLabelAccessor))].sort((a, b) =>
    a.localeCompare(b)
  );

  if (labels.includes('Other')) {
    labels.push(...labels.splice(labels.indexOf('Other'), 1));
  }

  return labels;
});

const dateRange = computed(() => {
  const allDates = props.data.flatMap(item => setDataAccessor(item).map(d => new Date(xAccessor(d))));
  if (allDates.length === 0) return { earliest: null, latest: null };

  const earliest = new Date(Math.min(...allDates)).toISOString().split('T')[0];
  const latest = new Date(Math.max(...allDates)).toISOString().split('T')[0];

  return { earliest, latest };
});

const marginTop = props.marginTop;
const marginRight = props.marginRight;
const marginBottom = props.marginBottom;
const marginLeft = props.marginLeft;

const innerWidth = computed(() => width.value - marginLeft - marginRight);
const innerHeight = computed(() => props.height - marginTop - marginBottom);

const xScaleDomain = computed(() =>
  createDateArray(dateRange.value.earliest, dateRange.value.latest)
);

const allXTicks = computed(() => xScale.value.domain());

const filterXTicks = (numberOfXTicks, width) => {
  if (numberOfXTicks > 270) {
    if (width > 700) return allXTicks.value.filter((d, i) => !(i % 60));
    else if (width > 550) return allXTicks.value.filter((d, i) => !(i % 90));
    else return allXTicks.value.filter((d, i) => !(i % 210));
  }
  if (numberOfXTicks > 210) {
    if (width > 700) return allXTicks.value.filter((d, i) => !(i % 30));
    else if (width > 550) return allXTicks.value.filter((d, i) => !(i % 60));
    else return allXTicks.value.filter((d, i) => !(i % 90));
  }
  if (numberOfXTicks > 120) {
    if (width > 700) return allXTicks.value.filter((d, i) => !(i % 21));
    else if (width > 550) return allXTicks.value.filter((d, i) => !(i % 30));
    else return allXTicks.value.filter((d, i) => !(i % 60));
  } else {
    if (width > 700) return allXTicks.value.filter((d, i) => !(i % 14));
    else if (width > 550) return allXTicks.value.filter((d, i) => !(i % 21));
    else if (width > 400) return allXTicks.value.filter((d, i) => !(i % 30));
    else return allXTicks.value.filter((d, i) => !(i % 45));
  }
};

const xTicksToBeRendered = computed(() =>
  filterXTicks(xScaleDomain.value.length, innerWidth.value)
);
 
const xScale = computed(() =>
  scaleBand().domain(xScaleDomain.value).range([0, innerWidth.value])
);

const yScale = computed(() =>
  scaleLinear().domain([0, 100]).range([innerHeight.value, 0]).nice()
);

const yTicks = computed(() => {
  const numberOfYTicks = Math.floor(innerHeight.value / 40);
  return yScale.value.ticks(numberOfYTicks);
});

const colors = computed(() => selectAccessibleColorPalette(uniqueLabels.value));

const colorScale = computed(() => scaleOrdinal(colors.value).domain(uniqueLabels.value));

// Line generation
const lineGenerator = computed(() =>
  line()
    .x(d => xScale.value(xAccessor(d)))
    .y(d => yScale.value(100 * yAccessor(d)))
    .defined(d => !Number.isNaN(yAccessor))
);

// Check whether any confidence intervals are present
const hasConfidenceIntervals = computed(() => {
  return props.data.some(series =>
    setDataAccessor(series).some(d =>
      d[props.lowerCIKey] != null &&
      d[props.upperCIKey] != null &&
      !Number.isNaN(d[props.lowerCIKey]) &&
      !Number.isNaN(d[props.upperCIKey])
    )
  );
});

// Area generation for confidence intervals
const areaGenerator = computed(() => {
  if (!hasConfidenceIntervals.value) return null;

  return area()
    .x(d => xScale.value(xAccessor(d)))
    .y0(d => yScale.value(100 * lowerCIAccessor(d)))
    .y1(d => yScale.value(100 * upperCIAccessor(d)))
    .defined(d => !Number.isNaN(lowerCIAccessor(d)) && !Number.isNaN(upperCIAccessor(d)));
});

const linesAndIntervals = computed(() => {
  return props.data.map(series => ({
    label: setLabelAccessor(series),
    path: lineGenerator.value(setDataAccessor(series)),
    areaPath: areaGenerator.value ? areaGenerator.value(setDataAccessor(series)) : null,
    color: colorScale.value(setLabelAccessor(series))
  }));
});

// Flat array of all data points with their dates for the quadtree
const allDataPoints = computed(() => {
  return xScaleDomain.value.map(date => ({
    date,
    x: xScale.value(date),
    y: innerHeight.value / 2 // Use middle of chart for y position
  }));
});

const quadtreeInstance = computed(() =>
  quadtree()
    .x(d => d.x)
    .y(d => d.y)
    .addAll(allDataPoints.value)
);

const handleMouseMove = (e) => {
  const xPosition = e.offsetX - marginLeft;
  const yPosition = e.offsetY - marginTop;
  const foundPoint = quadtreeInstance.value.find(xPosition, yPosition);

  if (foundPoint) {
    hoveredDate.value = foundPoint.date;
    tooltipData.value = props.data
      .map(series => {
        const dataPoint = setDataAccessor(series).find(d => xAccessor(d) === hoveredDate.value);
        return dataPoint ? {
          label: setLabelAccessor(series),
          date: xAccessor(dataPoint),
          proportion: yAccessor(dataPoint)
        } : null;
      })
    .filter(Boolean)
    console.log("tooltipData", tooltipData.value );
  }
};

const handleMouseLeave = () => {
  hoveredDate.value = null;
  tooltipData.value = null;
};
</script>

<template>
  <div class="chart-container" :style="containerMargins">
    <CustomCategoricalLegend
      :categories="uniqueLabels"
      :colorScale="colorScale"
    />
    <svg
      role="img"
      :width="width - containerMarginLeft - containerMarginRight"
      :height="height"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
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

        <!-- confidence intervals -->
        <g v-if="hasConfidenceIntervals">
          <g v-for="line in linesAndIntervals" :key="'ci-' + setLabelAccessor(line)">
            <path
              v-if="line.areaPath"
              :d="line.areaPath"
              :fill="line.color"
              fill-opacity="0.2"
              stroke="none"
            />
          </g>
        </g>

        <!-- lines -->
        <g v-for="line in linesAndIntervals" :key="setLabelAccessor(line)">
          <path
            :d="line.path"
            :stroke="line.color"
            stroke-width="2.5px"
            fill="none"
            stroke-linecap="round"
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
      </g>
    </svg>
    <CustomTooltipWithBarChart v-if="hoveredDate && tooltipData.length > 0"
      :width="width"
      :hoveredDate="hoveredDate"
      :tooltipData="tooltipData"
      :xScale="xScale"
      :colorScale="colorScale"
      tooltipTitle="San Diego, CA, USA"
      barChartTitle="Prevalence"
    />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}
</style>
