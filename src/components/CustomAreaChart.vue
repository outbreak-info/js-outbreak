<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { min, max } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { stack, area, curveBundle } from 'd3-shape';
import { createDateArray, findWeekEnd, createStackedAreaArray } from "../utils/arrays";
import { selectAccessibleColorPalette } from "../utils/colorSchemes";
import { quadtree } from "d3-quadtree";
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
  xAxisLabel: { type: String, default: "last epiweek day" },
  yAxisLabel: { type: String, default: "prevalence (%)" },
  height: { type: Number, default: 300 },
  barChartTitle: { type: String, default: "Average prevalence" },

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

const weekStartAccessor = (d) => d[props.weekStartKey];
const weekEndAccessor = (d) => d[props.weekEndKey];
const yAccessor = (d) => d[props.valueKey];
const weekAccessor = (d) => d[props.weekKey];
const labelAccessor = (d) => d[props.labelKey];

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

const areaGenerator = computed(() => 
  area()
    .x((d) => {
      return xScale.value(d.data.week_end); 
    })
    .y1((d) => yScale(d[1]))
    .y0((d) => yScale(d[0]))
    .curve(curveBundle.beta(1)),
);

const colors = computed(() => selectAccessibleColorPalette(uniqueLabels.value));

const colorScale = computed(() => scaleOrdinal(colors.value).domain(uniqueLabels.value));
</script>

<template>
  <div
    v-if="numOfUniqueWeeks > 1"
    class="stacked-area-chart-wrapper">
      <div>
        <svg
          role="img"
          :width="width - containerMarginLeft - containerMarginRight"
          :height="height"
        >
          <g :transform="`translate(${marginLeft}, ${marginTop})`">      
            <g>
              <path
                v-for="(s, index) in series" 
                :key="'s-' + index"
                :d="areaGenerator(s)"
                stroke="none"
                :fill="colorScale(index)"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
</template>

<style>
.stacked-area-chart-wrapper {
  position: relative;
}
</style>
