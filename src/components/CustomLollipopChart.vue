<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { quadtree } from "d3-quadtree";
import { createDateArray } from "../utils/arrays";

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: "key" },
  valueKey: { type: String, default: "val" },
  xAxisLabel: { type: String, default: "Date" },
  yAxisLabel: { type: String, default: "Value" },
  height: { type: Number, default: 135 },

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

  // Color props
  lollipopColor: { type: String, default: "#d13b62" },
  hoverColor: { type: String, default: "#000dcb" },
});

const width = ref(500);
const hoveredPoint = ref(null);

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

const xAccessor = (d) => d[props.dateKey];
const yAccessor = (d) => d[props.valueKey];

const formatHoveredValueKey = format(",.0f");
const formatValueKey = format(".2s");
const parseTime = timeParse("%Y-%m-%d");
const formatTime = timeFormat("%b %e");

const responsivePointRadius = computed(() => {
  if (width.value < 400) return 2;
  if (width.value < 600) return 3;
  return 4;
});

const responsiveStrokeWidth = computed(() => {
  if (width.value < 400) return "1px";
  return "2px";
});

const marginTop = props.marginTop;
const marginRight = props.marginRight;
const marginBottom = props.marginBottom;
const marginLeft = props.marginLeft;

const innerWidth = computed(() => width.value - marginLeft - marginRight);
const innerHeight = computed(() => props.height - marginTop - marginBottom);

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
    .range([innerHeight.value, 0])
    .nice()
);

const xAccessorScaled = computed(() => (d) => xScale.value(xAccessor(d)));
const yAccessorScaled = computed(() => (d) => yScale.value(yAccessor(d)));

const quadtreeInstance = computed(() =>
  quadtree()
    .x((d) => xScale.value(xAccessor(d)))
    .y((d) => yScale.value(yAccessor(d)))
    .addAll(props.data)
);

const yTicks = computed(() => {
  const numberOfYTicks = Math.floor(innerHeight.value / 40);
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

const ariaLabel = computed(
  () =>
    `Lollipop chart showing ${props.yAxisLabel} over time. Hover over chart for detailed information.`
);
</script>

<template>
  <div class="chart-container" :style="containerMargins">
    <svg
      role="img"
      :aria-label="ariaLabel"
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
              :fill="hoveredPoint ? '#bdc3c7' : '#2c3e50'"
              font-size="14px"
            >
              {{ formatTime(parseTime(tick)) }}
            </text>
          </g>
        </g>

        <!-- data points and lines -->
        <g v-for="(dataPoint, index) in data" :key="'point-' + index">
          <circle
            :r="
              hoveredPoint && xAccessor(dataPoint) === xAccessor(hoveredPoint)
                ? `${responsivePointRadius + 2}`
                : `${responsivePointRadius}`
            "
            :cx="xAccessorScaled(dataPoint)"
            :cy="yAccessorScaled(dataPoint)"
            :fill="
              hoveredPoint && xAccessor(dataPoint) === xAccessor(hoveredPoint)
                ? hoverColor
                : lollipopColor
            "
          />
          <line
            :x1="xAccessorScaled(dataPoint)"
            :x2="xAccessorScaled(dataPoint)"
            :y1="yAccessorScaled(dataPoint)"
            :y2="yScale(0)"
            :stroke="
              hoveredPoint && xAccessor(dataPoint) === xAccessor(hoveredPoint)
                ? hoverColor
                : lollipopColor
            "
            :stroke-width="responsiveStrokeWidth"
          />
        </g>

        <!-- hover effects -->
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
          :fill="hoverColor"
          font-size="14px"
          font-weight="600"
        >
          {{ formatHoveredValueKey(yAccessor(hoveredPoint)) }}
        </text>
        <g v-if="hoveredPoint" :transform="`translate(0, ${innerHeight})`">
          <text
            :x="xAccessorScaled(hoveredPoint)"
            y="10"
            dy="0.8em"
            text-anchor="middle"
            stroke="#ffffff"
            stroke-width="4px"
            font-size="14px"
          >
            {{ formatTime(parseTime(xAccessor(hoveredPoint))) }}
          </text>
          <text
            :x="xAccessorScaled(hoveredPoint)"
            y="10"
            dy="0.8em"
            text-anchor="middle"
            :fill="hoverColor"
            font-size="14px"
          >
            {{ formatTime(parseTime(xAccessor(hoveredPoint))) }}
          </text>
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
