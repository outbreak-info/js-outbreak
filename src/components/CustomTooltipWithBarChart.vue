<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { min, max } from "d3-array";
import { format } from "d3-format";

const props = defineProps({
  width: Number,
  hoveredDate: String,
  tooltipData: Array,
  colorScale: Function,
  barChartTitle: { type: String, default: "Prevalence" },
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');
const formatValue = format(',.2f');

const tooltipWidth = 320;
const xPosition = 50;

const xAccessor = d => +d.proportion; 

const sortedTooltipData = computed(() => 
 props.tooltipData.sort((a, b) => {
    if (a.name === 'Other') return -1; 
    if (b.name === 'Other') return 1; 

    if (a.proportion !== b.proportion) {
      return a.proportion - b.proportion;
    }
  
    return b.name.localeCompare(a.name);
  })
);

const numberOfGroups = computed(() => (sortedTooltipData.value.length));

const barChartWidth = 300;
const barChartHeight = computed(() => numberOfGroups.value * 20);

const barChartMargin = {
  top: 0,
  right: 65,
  bottom: 0,
  left: 85,
};

const barChartInnerWidth =
  barChartWidth - barChartMargin.left - barChartMargin.right;

const barChartInnerHeight = computed(() => barChartHeight.value - barChartMargin.top - barChartMargin.bottom);

const barChartXScale = computed(() =>
  scaleLinear()
    .domain([0, max(sortedTooltipData.value, xAccessor)])
    .range([0, barChartInnerWidth]),
);

const barChartYScale = computed(() => 
  scaleBand()
    .domain(sortedTooltipData.value.map(d => d.label))
    .range([barChartInnerHeight.value, 0])
    .padding(0.25),
);

const xAccessorScaled = (d) => barChartXScale.value(xAccessor(d));
</script>

<template>
  <div
    class="tooltip-wrapper"
    :style="{
      transform: `translate(${xPosition}px, 0px)`,
      width: `${tooltipWidth}px`,
    }"
  >
    <div class="title"> 
      San Diego, CA, USA
    </div>
    <div class="date">
      {{ formatTime(parseTime(hoveredDate)) }}
      <hr class="divider" />
    </div>
    <div class="bar-chart-wrapper">
      <h1 class="bar-chart-title">{{ barChartTitle }}</h1>
      <svg :width="barChartWidth" :height="barChartHeight">
        <g
          :transform="`translate(${barChartMargin.left}, ${barChartMargin.top})`"
        >
          <g v-for="lineage in sortedTooltipData">
            <text
              text-anchor="end"
              x="-10"
              :y="barChartYScale(lineage.label) + barChartYScale.bandwidth() / 2"
              dy=".32em"
              font-size="13px"
              stroke="#2c3e50"
              stroke-width=".5"
            >
              {{ lineage.label }}
            </text>
            <rect 
              x="0"
              :y="barChartYScale(lineage.label)"
              :width="xAccessorScaled(lineage)"
              :height="barChartYScale.bandwidth()"
              :fill="colorScale(lineage.label)"
            />
            <text
              text-anchor="start"
              :x="xAccessorScaled(lineage)"
              dx="10"
              :y="barChartYScale(lineage.label) + barChartYScale.bandwidth() / 2"
              dy=".32em"
              font-size="13px"
              stroke="#2c3e50"
              stroke-width=".5"
            >
              {{ `${formatValue(lineage.proportion * 100)}%` }}
            </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  background: #ffffff;
  box-shadow: 1px 2px 7px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  position: absolute;
  padding: 0.5em;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  z-index: 2;
  color: '#2c3e50';
}
.title {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
.date {
  font-size: 12px;
  text-transform: uppercase;
}
.divider {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 5px;
  margin-bottom: 5px;
}
.bar-chart-wrapper {
  font-weight: 400;
}
.bar-chart-title {
  font-weight: 700;
  font-size: 14px;
}
</style>
