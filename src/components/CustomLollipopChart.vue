<template>
  <div class="chart-container">
    <svg
      role="img"
      :aria-label="`Lollipop chart showing ${yAxisLabel} over time`"
      :width="chartWidth"
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
            y="-10"
            text-anchor="middle"
            fill="#2c3e50"
            font-size="14px"
            font-weight="600"
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
            font-weight="600"
          >
            {{ xAxisLabel }}
          </text>
          <g
            v-for="(tick, index) in xTicksToBeRendered"
            :key="'tick-' + index"
            :transform="`translate(${
              xScale(tick) + xScale.bandwidth() / 2
            }, 0)`"
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

        <!-- data points and lines -->
        <g v-for="(dataPoint, index) in data" :key="'point-' + index">
          <circle
            :r="responsivePointRadius"
            :cx="xAccessorScaled(dataPoint)"
            :cy="yAccessorScaled(dataPoint)"
            fill="#2c3e50"
          />
          <line
            :x1="xAccessorScaled(dataPoint)"
            :x2="xAccessorScaled(dataPoint)"
            :y1="yAccessorScaled(dataPoint)"
            :y2="yScale(0)"
            :stroke="
              hoveredPoint && xAccessor(dataPoint) === xAccessor(hoveredPoint)
                ? '#0570b0'
                : '#2c3e50'
            "
            :stroke-width="responsiveStrokeWidth"
          />
        </g>

        <!-- hover effects -->
        <circle
          v-if="hoveredPoint"
          :r="responsivePointRadius + 2"
          :cx="xAccessorScaled(hoveredPoint)"
          :cy="yAccessorScaled(hoveredPoint)"
          fill="#0570b0"
        />
        <text
          v-if="hoveredPoint"
          :x="xAccessorScaled(hoveredPoint)"
          :y="yAccessorScaled(hoveredPoint) - 10"
          text-anchor="middle"
          stroke="#ffffff"
          stroke-width="4px"
          font-size="14px"
        >
          {{ formatValueKey(yAccessor(hoveredPoint)) }}
        </text>
        <text
          v-if="hoveredPoint"
          :x="xAccessorScaled(hoveredPoint)"
          :y="yAccessorScaled(hoveredPoint) - 10"
          text-anchor="middle"
          fill="#0570b0"
          font-size="14px"
        >
          {{ formatValueKey(yAccessor(hoveredPoint)) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { quadtree } from "d3-quadtree";
import { createDateArray } from "../utils/arrays";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  dateKey: {
    type: String,
    default: "key",
  },
  valueKey: {
    type: String,
    default: "val",
  },
  marginTop: {
    type: Number,
    default: 25,
  },
  marginRight: {
    type: Number,
    default: 5,
  },
  marginBottom: {
    type: Number,
    default: 75,
  },
  marginLeft: {
    type: Number,
    default: 140,
  },
  xAxisLabel: {
    type: String,
    default: "Date",
  },
  yAxisLabel: {
    type: String,
    default: "Value",
  },
  containerLeftMargin: {
    type: Number,
    default: 50,
  },
  containerRightMargin: {
    type: Number,
    default: 50,
  },
});

const windowWidth = ref(500);
const hoveredPoint = ref(null);
const height = 155;

const chartWidth = computed(() => {
  if (windowWidth.value >= 1000) {
    return 1000 - props.containerLeftMargin - props.containerRightMargin;
  } else {
    return (
      windowWidth.value - props.containerLeftMargin - props.containerRightMargin
    );
  }
});

const xAccessor = (d) => d[props.dateKey];
const yAccessor = (d) => d[props.valueKey];

const formatValueKey = format(",.0f");
const parseTime = timeParse("%Y-%m-%d");
const formatTime = timeFormat("%b %e");

const responsivePointRadius = computed(() => {
  if (chartWidth.value < 400) return 2;
  if (chartWidth.value < 600) return 3;
  return 4;
});

const responsiveStrokeWidth = computed(() => {
  if (chartWidth.value < 400) return "1px";
  return "2px";
});

const marginTop = props.marginTop;
const marginRight = props.marginRight;
const marginBottom = props.marginBottom;
const marginLeft = props.marginLeft;

const innerWidth = computed(() => chartWidth.value - marginLeft - marginRight);
const innerHeight = height - marginTop - marginBottom;

const xScaleDomain = computed(() =>
  createDateArray(
    xAccessor(props.data[0]),
    xAccessor(props.data[props.data.length - 1])
  )
);

const xScale = computed(() =>
  scaleBand().domain(xScaleDomain.value).range([0, innerWidth.value])
);

const yScale = computed(() =>
  scaleLinear()
    .domain([0, max(props.data, yAccessor)])
    .range([innerHeight, 0])
    .nice()
);

const xAccessorScaled = computed(
  () => (d) => xScale.value(xAccessor(d)) + xScale.value.bandwidth() / 2
);
const yAccessorScaled = computed(() => (d) => yScale.value(yAccessor(d)));

const quadtreeInstance = computed(() =>
  quadtree()
    .x((d) => xScale.value(xAccessor(d)) + xScale.value.bandwidth() / 2)
    .y((d) => yScale.value(yAccessor(d)))
    .addAll(props.data)
);

const yTicks = computed(() => {
  const numberOfYTicks = Math.floor(innerHeight / 40);
  return yScale.value.ticks(numberOfYTicks);
});

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

const handleResize = () => {
  if (window.innerWidth >= 1000) {
    windowWidth.value = 1000;
  } else {
    windowWidth.value = window.innerWidth;
  }
};

const handleMouseMove = (e) => {
  const xPosition = e.offsetX - marginLeft;
  const yPosition = e.offsetY - marginTop;
  const foundPoint = quadtreeInstance.value.find(xPosition, yPosition);

  if (foundPoint) {
    hoveredPoint.value = foundPoint;
  }
};

const handleMouseLeave = () => {
  hoveredPoint.value = null;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.chart-container {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>
