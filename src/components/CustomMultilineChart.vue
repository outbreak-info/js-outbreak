<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { createDateArray } from "../utils/arrays";
import { selectAccessibleColorPalette } from "../utils/colorSchemes";

const props = defineProps({
  data: { type: Array, required: true },
  xAxisLabel: { type: String, default: "Date" },
  yAxisLabel: { type: String, default: "Value" },
  height: { type: Number, default: 300 },

  // Margins
  marginTop: { type: Number, default: 35 },
  marginRight: { type: Number, default: 130 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 40 },

  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 10 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 10 },
});

const width = ref(500);

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

const formatValueKey = format(".2s");
const parseTime = timeParse("%Y-%m-%d");
const formatTime = timeFormat("%b %e");

const uniqueLabels = computed(() => {
  const labels = [...new Set(props.data.map(i => i.label))].sort((a, b) =>
    a.localeCompare(b)
  );

  if (labels.includes('Other')) {
    labels.push(...labels.splice(labels.indexOf('Other'), 1));
  }

  return labels;
});

const dateRange = computed(() => {
  const allDates = props.data.flatMap(item => item.data.map(d => new Date(d.date)));
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
</script>

<template>
  <div class="chart-container" :style="containerMargins">
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
              fill="#2c3e50"
              font-size="14px"
            >
              {{ formatTime(parseTime(tick)) }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}
</style>
