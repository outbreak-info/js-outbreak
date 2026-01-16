<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { format } from "d3-format";
import { timeFormat, timeParse } from "d3-time-format";
import { quadtree } from "d3-quadtree";
import { createDateArray } from "../utils/arrays";
import { filterXTicks } from "../utils/tickFilters";

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: "key" },
  valueKey: { type: String, default: "val" },
  activeKey: { type: String, default: null },
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
  showXAxisLabelAndTicks: { type: Boolean, default: true },
});

const emit = defineEmits(["hover", "leave"]);

const width = ref(500);
const internalHoveredPoint = ref(null);

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
  width.value = window.innerWidth >= 1000 ? 1000 : window.innerWidth;
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

const innerWidth = computed(
  () => width.value - props.marginLeft - props.marginRight
);
const innerHeight = computed(
  () => props.height - props.marginTop - props.marginBottom
);

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
  const count = Math.floor(innerHeight.value / 40);
  return yScale.value.ticks(count);
});

const allXTicks = computed(() => xScale.value.domain());

const xTicksToBeRendered = computed(() =>
  filterXTicks(allXTicks.value, innerWidth.value)
);

const hoveredPoint = computed(() => {
  if (props.activeKey) {
    return (
      props.data.find((d) => xAccessor(d) === props.activeKey) || null
    );
  }
  return internalHoveredPoint.value;
});

const handleMouseMove = (e) => {
  const x = e.offsetX - props.marginLeft;
  const y = e.offsetY - props.marginTop;
  const found = quadtreeInstance.value.find(x, y);

  if (found) {
    internalHoveredPoint.value = found;
    emit("hover", xAccessor(found), found);
  }
};

const handleMouseLeave = () => {
  internalHoveredPoint.value = null;
  emit("leave");
};

const ariaLabel = computed(
  () =>
    `Lollipop chart showing ${props.yAxisLabel} over time. Hover or focus to explore values.`
);

// Chart container inline styles
const chartContainerStyle = computed(() => ({
  position: "relative",
  ...containerMargins.value,
}));
</script>

<template>
  <div :style="containerMargins">
    <svg
      role="img"
      :aria-label="ariaLabel"
      :width="width"
      :height="height"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <!-- y-axis -->
        <g>
          <line x1="0" x2="0" y1="0" :y2="innerHeight" stroke="#bdc3c7" />
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
            <line x1="0" x2="-6" stroke="#bdc3c7" />
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
        <g :transform="`translate(0, ${innerHeight})`"  >
          <line x1="0" :x2="innerWidth" stroke="#bdc3c7" />
          <g v-if="showXAxisLabelAndTicks">
            <text
              :x="innerWidth / 2"
              y="45"
              text-anchor="middle"
              fill="#2c3e50"
              font-size="14px"
              font-weight="700"
            >
              {{ xAxisLabel }}
            </text>
          </g>
          
          <g v-if="showXAxisLabelAndTicks">
            <g
              v-for="tick in xTicksToBeRendered"
              :key="tick"
              :transform="`translate(${xScale(tick)}, 0)`"
            >
              <line y1="0" y2="6" stroke="#bdc3c7" />
              <text
                y="10"
                dy="0.8em"
                text-anchor="middle"
                :fill="
                  hoveredPoint
                    ? tick === xAccessor(hoveredPoint)
                      ? hoverColor
                      : '#bdc3c7'
                    : '#2c3e50'
                "
                font-size="14px"
                :font-weight="
                  hoveredPoint && tick === xAccessor(hoveredPoint)
                    ? '600'
                    : '400'
                "
              >
                {{ formatTime(parseTime(tick)) }}
              </text>
            </g>
          </g>
        </g>

        <!-- lollipops -->
        <g
          v-for="(d, i) in data"
          :key="i"
          tabindex="0"
          role="graphics-symbol"
          :aria-label="`Date ${formatTime(parseTime(xAccessor(d)))} value ${yAccessor(d)}`"
          @focus="emit('hover', xAccessor(d), d)"
          @blur="emit('leave')"
        >
          <line
            :x1="xAccessorScaled(d)"
            :x2="xAccessorScaled(d)"
            :y1="yAccessorScaled(d)"
            :y2="yScale(0)"
            :stroke="
              hoveredPoint && xAccessor(d) === xAccessor(hoveredPoint)
                ? hoverColor
                : lollipopColor
            "
            :stroke-width="responsiveStrokeWidth"
          />
          <circle
            :cx="xAccessorScaled(d)"
            :cy="yAccessorScaled(d)"
            :r="
              hoveredPoint && xAccessor(d) === xAccessor(hoveredPoint)
                ? responsivePointRadius + 2
                : responsivePointRadius
            "
            :fill="
              hoveredPoint && xAccessor(d) === xAccessor(hoveredPoint)
                ? hoverColor
                : lollipopColor
            "
          />
        </g>

        <!-- hover effects -->
        <g v-if="hoveredPoint">
          <text
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
            :x="xAccessorScaled(hoveredPoint)"
            :y="yAccessorScaled(hoveredPoint) - 10"
            text-anchor="middle"
            :fill="hoverColor"
            font-size="14px"
            font-weight="600"
          >
            {{ formatHoveredValueKey(yAccessor(hoveredPoint)) }}
          </text>
        </g>
        <g v-if="showXAxisLabelAndTicks">
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
              font-weight="600"
            >
              {{ formatTime(parseTime(xAccessor(hoveredPoint))) }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>
