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

  // Scale padding configuration
  cellPadding: { type: Number, default: 0 },

  // Bandwidth offset behavior
  useBandwidthOffset: { type: Boolean, default: false },

  // Color props
  lollipopColor: { type: String, default: "#d13b62" },
  hoverColor: { type: String, default: "#000dcb" },
  showXAxisLabelAndTicks: { type: Boolean, default: true },

  // Scale props
  xScale: { type: Function, default: null },
});

const emit = defineEmits(["hover", "leave"]);

const width = ref(500);
const internalHoveredPoint = ref(null);
const focusedIndex = ref(-1);
const chartId = ref(
  `lollipop-chart-${Math.random().toString(36).substr(2, 9)}`
);
const liveRegionId = ref(`${chartId.value}-live`);

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

// Dynamic bottom margin based on whether x-axis labels/ticks are shown
const effectiveMarginBottom = computed(() => {
  return props.showXAxisLabelAndTicks ? props.marginBottom : 15;
});

// Adjust total height to account for reduced bottom margin
const effectiveHeight = computed(() => {
  const baseInnerHeight = props.height - props.marginTop - props.marginBottom;
  return baseInnerHeight + props.marginTop + effectiveMarginBottom.value;
});

const innerWidth = computed(
  () => width.value - props.marginLeft - props.marginRight
);

const innerHeight = computed(
  () => props.height - props.marginTop - props.marginBottom
);

const xScaleDomain = computed(() => {
  if (props.xScale) {
    return props.xScale.domain();
  }
  return createDateArray(
    xAccessor(props.data[0]),
    xAccessor(props.data[props.data.length - 1])
  );
});

const xScale = computed(() => {
  if (props.xScale) {
    return props.xScale;
  }
  return scaleBand()
    .domain(xScaleDomain.value)
    .range([0, innerWidth.value])
    .paddingInner(props.cellPadding);
});

const yScale = computed(() =>
  scaleLinear()
    .domain([0, max(props.data, yAccessor)])
    .range([innerHeight.value, 0])
    .nice()
);

const bandwidthOffset = computed(() =>
  props.useBandwidthOffset ? xScale.value.bandwidth() / 2 : 0
);

const xAccessorScaled = computed(
  () => (d) => xScale.value(xAccessor(d)) + bandwidthOffset.value
);

const yAccessorScaled = computed(() => (d) => yScale.value(yAccessor(d)));

const quadtreeInstance = computed(() =>
  quadtree()
    .x((d) => xScale.value(xAccessor(d)) + bandwidthOffset.value)
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
    return props.data.find((d) => xAccessor(d) === props.activeKey) || null;
  }
  return internalHoveredPoint.value;
});

const minValue = computed(() => Math.min(...props.data.map(yAccessor)));
const maxValue = computed(() => max(props.data, yAccessor));

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

const handleKeyDown = (e, d, index) => {
  let newIndex = index;

  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      e.preventDefault();
      newIndex = Math.min(index + 1, props.data.length - 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      newIndex = Math.max(index - 1, 0);
      break;
    case "Home":
      e.preventDefault();
      newIndex = 0;
      break;
    case "End":
      e.preventDefault();
      newIndex = props.data.length - 1;
      break;
    default:
      return;
  }

  if (newIndex !== index) {
    focusedIndex.value = newIndex;
    internalHoveredPoint.value = props.data[newIndex];
    // Focus the next element
    const elements = document.querySelectorAll(
      `[data-chart-id="${chartId.value}"] g[role="button"]`
    );
    if (elements[newIndex]) {
      elements[newIndex].focus();
    }
    emit("hover", xAccessor(props.data[newIndex]), props.data[newIndex]);
  }
};

const handleFocus = (d, index) => {
  focusedIndex.value = index;
  internalHoveredPoint.value = d;
  emit("hover", xAccessor(d), d);
};

const handleBlur = () => {
  focusedIndex.value = -1;
  internalHoveredPoint.value = null;
  emit("leave");
};

// Aria label with data summary
const ariaLabel = computed(() => {
  const title = `${props.yAxisLabel} over ${props.xAxisLabel}`;
  const description =
    `A lollipop chart displaying ${props.data.length} data points. ` +
    `Values range from ${formatHoveredValueKey(
      minValue.value
    )} to ${formatHoveredValueKey(maxValue.value)}.`;
  return `${title}. ${description}`;
});

// Individual point aria label
const getPointAriaLabel = (d) => {
  const date = formatTime(parseTime(xAccessor(d)));
  const value = formatHoveredValueKey(yAccessor(d));
  return `${date}: ${value} ${props.yAxisLabel}`;
};

// Screen reader instructions
const srInstructions = computed(
  () =>
    "Use arrow keys to navigate between data points. Press Home or End to jump to first or last point."
);

// Live region announcement for screen readers
const liveRegionText = computed(() => {
  if (hoveredPoint.value) {
    return getPointAriaLabel(hoveredPoint.value);
  }
  return "";
});

// Inline styles
const chartContainerStyle = computed(() => ({
  position: "relative",
  ...containerMargins.value,
}));

const srOnlyStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
};

const lollipopPointStyle = {
  cursor: "pointer",
  outline: "none",
};
</script>

<template>
  <div :style="chartContainerStyle">
    <!-- screen reader instructions (visually hidden) -->
    <div :style="srOnlyStyle" :id="`${chartId}-instructions`">
      {{ srInstructions }}
    </div>

    <!-- live region for announcing changes to screen readers -->
    <div
      :id="liveRegionId"
      :style="srOnlyStyle"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ liveRegionText }}
    </div>

    <svg
      role="img"
      :aria-label="ariaLabel"
      :aria-describedby="`${chartId}-instructions`"
      :width="width - containerMarginLeft - containerMarginRight"
      :height="effectiveHeight"
      :data-chart-id="chartId"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- title for assistive technologies -->
      <title>{{ `${yAxisLabel} over ${xAxisLabel} lollipop chart` }}</title>

      <!-- description for assistive technologies -->
      <desc>
        {{
          `A lollipop chart showing ${yAxisLabel} over ${xAxisLabel.toLowerCase()}. The chart contains ${
            data.length
          } data points ranging from ${formatHoveredValueKey(
            minValue
          )} to ${formatHoveredValueKey(maxValue)}.`
        }}
      </desc>

      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <!-- y-axis -->
        <g role="presentation" aria-hidden="true">
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
        <g
          :transform="`translate(0, ${innerHeight})`"
          role="presentation"
          aria-hidden="true"
        >
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
              :transform="`translate(${xScale(tick) + bandwidthOffset}, 0)`"
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
          :style="lollipopPointStyle"
          tabindex="0"
          role="button"
          :aria-label="getPointAriaLabel(d)"
          :aria-describedby="liveRegionId"
          :aria-pressed="
            hoveredPoint && xAccessor(d) === xAccessor(hoveredPoint)
              ? 'true'
              : 'false'
          "
          @focus="handleFocus(d, i)"
          @blur="handleBlur"
          @keydown="handleKeyDown($event, d, i)"
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
            pointer-events="none"
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
            pointer-events="none"
          />

          <!-- focus ring for keyboard navigation -->
          <circle
            v-if="focusedIndex === i"
            :cx="xAccessorScaled(d)"
            :cy="yAccessorScaled(d)"
            :r="responsivePointRadius + 6"
            fill="none"
            :stroke="hoverColor"
            stroke-width="2"
            stroke-dasharray="4 2"
            pointer-events="none"
            opacity="0.6"
          />
        </g>

        <!-- hover effects -->
        <g v-if="hoveredPoint" role="presentation" aria-hidden="true">
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
        <g v-if="showXAxisLabelAndTicks" role="presentation" aria-hidden="true">
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
