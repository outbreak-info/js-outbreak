<script setup>
import { computed, onMounted, ref } from "vue";
import { scaleLinear, scaleBand } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { max } from "d3-array";
import { format } from "d3-format";
import { insertYearWeekSeparator } from "../utils/helpers";

const props = defineProps({
  width: { type: Number, required: true },
  hoveredDate: { type: String, required: true },
  tooltipData: { type: Array, required: true },
  xScale: { type: Function, required: true },
  xAccessor: { type: Function, required: true },
  labelAccessor: { type: Function, required: true },
  colorScale: { type: Function, required: true },
  
  // Tooltip header props
  tooltipTitle: { type: String, default: "" },
  // Overrides the auto-generated date line (firstDate · lastDate for epiweek
  // data, or hoveredDate otherwise) when non-empty. Defaults preserve
  // existing behaviour.
  tooltipSubtitle: { type: String, default: "" },
  
  // Optional props for area chart 
  weekAccessor: { type: Function, default: null },
  weekStartAccessor: { type: Function, default: null },
  weekEndAccessor: { type: Function, default: null },
  regionAccessor: { type: Function, default: null },
  
  // Chart title
  barChartTitle: { type: String, default: "Prevalence" },

  tooltipDecimalPlaces: { type: Number, default: 2 },
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');
const formatValue = computed(() => format(`,.${props.tooltipDecimalPlaces}f`));

const xPosForSmallScreens = 50;

// Font used to measure label widths for truncation/margin sizing.
// Read whatever font is actually being rendered via
// getComputedStyle on a hidden probe <text> element (see labelProbeRef in
// the template) and use that.
const FALLBACK_LABEL_FONT = "13px sans-serif";
const labelProbeRef = ref(null);
const resolvedLabelFont = ref(FALLBACK_LABEL_FONT);

const measureResolvedLabelFont = () => {
  if (typeof window === "undefined" || !labelProbeRef.value) return;
  const style = window.getComputedStyle(labelProbeRef.value);
  const fontStyle = style.fontStyle || "normal";
  const fontWeight = style.fontWeight || "normal";
  const fontSize = style.fontSize || "13px";
  const fontFamily = style.fontFamily || "sans-serif";
  resolvedLabelFont.value = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
};

onMounted(measureResolvedLabelFont);

// Distance between a label's right edge and the y-axis (matches x="-10" on
// the label <text> below), plus a small buffer for stroke-width/antialiasing.
const LABEL_TEXT_GAP = 10;
const LABEL_SAFETY_BUFFER = 4;

// Original fixed values, kept as the floor.
const DEFAULT_BAR_CHART_LEFT_MARGIN = 85;
const BAR_CHART_RIGHT_MARGIN = 65;
// Width of the bars' drawing area itself stays fixed regardless of label
// length, so bar lengths stay visually comparable across different tooltips.
const BAR_CHART_INNER_WIDTH = 150;
// Difference between the original barChartWidth (300) and tooltipWidth (320):
// accounts for the tooltip wrapper's own padding plus a small buffer.
const TOOLTIP_WIDTH_BUFFER = 20;

// Hard ceiling on how wide the tooltip is allowed to grow. Labels that would
// need more room than this get truncated with an ellipsis instead.
const MAX_TOOLTIP_WIDTH = 350;
const MAX_BAR_CHART_WIDTH = MAX_TOOLTIP_WIDTH - TOOLTIP_WIDTH_BUFFER;
const MAX_BAR_CHART_LEFT_MARGIN =
  MAX_BAR_CHART_WIDTH - BAR_CHART_INNER_WIDTH - BAR_CHART_RIGHT_MARGIN;

const ELLIPSIS = "\u2026";

let measureCanvasContext = null;
const getTextWidth = (text, font) => {
  if (typeof document === "undefined") return 0;
  if (!measureCanvasContext) {
    measureCanvasContext = document.createElement("canvas").getContext("2d");
  }
  measureCanvasContext.font = font;
  return measureCanvasContext.measureText(text ?? "").width;
};

// Truncates `text` with a trailing ellipsis so it fits within `maxWidth`,
// using a binary search over character count.
// Returns the original text unchanged if it already fits.
const truncateLabelToWidth = (text, maxWidth, font) => {
  if (!text) return text;
  if (getTextWidth(text, font) <= maxWidth) return text;

  const ellipsisWidth = getTextWidth(ELLIPSIS, font);
  if (maxWidth <= ellipsisWidth) return ELLIPSIS;

  let low = 0;
  let high = text.length;
  let best = 0;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidateWidth = getTextWidth(text.slice(0, mid) + ELLIPSIS, font);
    if (candidateWidth <= maxWidth) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return text.slice(0, best) + ELLIPSIS;
};

// Determine if this is epiweek data (area chart) or regular date data (multiline chart)
const isEpiweekData = computed(() => 
  props.weekAccessor !== null && 
  props.weekStartAccessor !== null && 
  props.weekEndAccessor !== null
);

const dateIndex = computed(() =>
  props.xScale.domain().indexOf(props.hoveredDate),
);

const dateArrayLength = props.xScale.domain().length;
const midPoint = Math.floor(dateArrayLength / 2);

const xPosition = computed(() => {
  if (props.width <= 700) {
    return xPosForSmallScreens;
  }
  
  return dateIndex.value <= midPoint
    ? props.xScale(props.hoveredDate) + xPosForSmallScreens
    : props.xScale(props.hoveredDate) - (tooltipWidth.value - xPosForSmallScreens);
});

const sortedTooltipData = computed(() => 
  [...props.tooltipData].sort((a, b) => {
    if (props.labelAccessor(a) === 'Other') return -1; 
    if (props.labelAccessor(b) === 'Other') return 1; 

    if (props.xAccessor(a) !== props.xAccessor(b)) {
      return props.xAccessor(a) - props.xAccessor(b);
    }
  
    return props.labelAccessor(b).localeCompare(props.labelAccessor(a));
  })
);

const numberOfGroups = computed(() => sortedTooltipData.value.length);

const barChartHeight = computed(() => numberOfGroups.value * 20);

// Widest row label in the current tooltip, used to grow the left margin
// only as much as needed to avoid clipping.
const maxLabelWidth = computed(() =>
  sortedTooltipData.value.reduce(
    (widest, category) =>
      Math.max(widest, getTextWidth(props.labelAccessor(category), resolvedLabelFont.value)),
    0
  )
);

const barChartMargin = computed(() => ({
  top: 0,
  right: BAR_CHART_RIGHT_MARGIN,
  bottom: 0,
  left: Math.min(
    MAX_BAR_CHART_LEFT_MARGIN,
    Math.max(
      DEFAULT_BAR_CHART_LEFT_MARGIN,
      Math.ceil(maxLabelWidth.value) + LABEL_TEXT_GAP + LABEL_SAFETY_BUFFER
    )
  ),
}));

// Space actually available for label text once the gap/buffer reserved
// around it are subtracted. Labels wider than this get truncated below.
const availableLabelWidth = computed(() =>
  Math.max(0, barChartMargin.value.left - LABEL_TEXT_GAP - LABEL_SAFETY_BUFFER)
);

// Display text for a row label: truncated with an ellipsis if it wouldn't
// otherwise fit within the (possibly capped) left margin.
const getDisplayLabel = (category) =>
  truncateLabelToWidth(
    props.labelAccessor(category),
    availableLabelWidth.value,
    resolvedLabelFont.value
  );

const barChartInnerWidth = BAR_CHART_INNER_WIDTH;
const barChartInnerHeight = computed(() => 
  barChartHeight.value - barChartMargin.value.top - barChartMargin.value.bottom
);

// Total SVG width grows with the left margin so the bars' drawing area
// (barChartInnerWidth) never shrinks to make room for longer labels.
const barChartWidth = computed(
  () => barChartMargin.value.left + barChartInnerWidth + barChartMargin.value.right
);

// Tooltip container grows in lockstep with the bar chart.
const tooltipWidth = computed(() => barChartWidth.value + TOOLTIP_WIDTH_BUFFER);

const barChartXScale = computed(() =>
  scaleLinear()
    .domain([0, max(sortedTooltipData.value, props.xAccessor)])
    .range([0, barChartInnerWidth]),
);

const barChartYScale = computed(() => 
  scaleBand()
    .domain(sortedTooltipData.value.map(props.labelAccessor))
    .range([barChartInnerHeight.value, 0])
    .padding(0.25),
);

const xAccessorScaled = (d) => barChartXScale.value(props.xAccessor(d));

// Computed values for epiweek data
const region = computed(() => 
  isEpiweekData.value && props.regionAccessor && props.tooltipData.length > 0
    ? props.regionAccessor(props.tooltipData[0])
    : null
);

const week = computed(() => 
  isEpiweekData.value && props.weekAccessor && props.tooltipData.length > 0
    ? props.weekAccessor(props.tooltipData[0])
    : null
);

const firstDate = computed(() => 
  isEpiweekData.value && props.weekStartAccessor && props.tooltipData.length > 0
    ? props.weekStartAccessor(props.tooltipData[0])
    : null
);

const lastDate = computed(() => 
  isEpiweekData.value && props.weekEndAccessor && props.tooltipData.length > 0
    ? props.weekEndAccessor(props.tooltipData[0])
    : null
);

// Tooltip inline styles
const tooltipWrapperStyle = computed(() => ({
  transform: `translate(${xPosition.value}px, 0px)`,
  width: `${tooltipWidth.value}px`,
  background: "#ffffff",
  boxShadow: "1px 2px 7px rgba(0, 0, 0, 0.2)",
  borderRadius: "3px",
  position: "absolute",
  padding: "0.5em",
  textAlign: "left",
  fontSize: "13px",
  lineHeight: "18px",
  zIndex: 1,
  color: "#2c3e50",
  pointerEvents: "none",
}));

const tooltipTitleStyle = {
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "16px",
};

const tooltipDateStyle = {
  fontSize: "12px",
  textTransform: "uppercase",
};

const tooltipDividerStyle = {
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  marginTop: "5px",
  marginBottom: "5px",
};

const barChartWrapperStyle = {
  fontWeight: "400",
};

const barChartTitleStyle = {
  fontWeight: "700",
  fontSize: "14px",
};
</script>

<template>
  <div :style="tooltipWrapperStyle">
    <!-- Header: either epiweek format or simple title -->
    <template v-if="isEpiweekData">
      <div :style="tooltipTitleStyle">
        <!-- tooltipTitle, when provided, overrides the auto-generated region/epiweek label -->
        <template v-if="tooltipTitle">{{ tooltipTitle }}</template>
        <template v-else>{{ region }} &#183; {{ `Epiweek ${insertYearWeekSeparator(week)}` }}</template>
      </div>
      <div :style="tooltipDateStyle">
        <!-- tooltipSubtitle, when provided, overrides the auto-generated date range -->
        <template v-if="tooltipSubtitle">{{ tooltipSubtitle }}</template>
        <template v-else>
          {{ formatTime(parseTime(firstDate)) }} &#183;
          {{ formatTime(parseTime(lastDate)) }}
        </template>
      </div>
    </template>
    <template v-else>
      <div :style="tooltipTitleStyle"> 
        {{ tooltipTitle }}
      </div>
      <div :style="tooltipDateStyle">
        <!-- tooltipSubtitle, when provided, overrides the auto-generated hovered date -->
        <template v-if="tooltipSubtitle">{{ tooltipSubtitle }}</template>
        <template v-else>{{ formatTime(parseTime(hoveredDate)) }}</template>
      </div>
    </template>
    
    <hr :style="tooltipDividerStyle" />
    
    <!-- Bar chart -->
    <div :style="barChartWrapperStyle">
      <h1 :style="barChartTitleStyle">
        {{ barChartTitle }}
      </h1>
      <!-- overflow: visible is a defensive fallback in case the rendered
           label width ever drifts slightly from the canvas measurement used
           to size the left margin below (e.g. a font substitution) -->
      <svg :width="barChartWidth" :height="barChartHeight" style="overflow: visible;">
        <!-- Hidden probe used only to read the actual computed font (via
             getComputedStyle in script setup) for width measurement, without
             forcing a font-family on the visible labels below. -->
        <text ref="labelProbeRef" font-size="13px" visibility="hidden" aria-hidden="true">Ag</text>
        <g :transform="`translate(${barChartMargin.left}, ${barChartMargin.top})`">
          <g v-for="category in sortedTooltipData" :key="labelAccessor(category)">
            <text
              text-anchor="end"
              x="-10"
              :y="barChartYScale(labelAccessor(category)) + barChartYScale.bandwidth() / 2"
              dy=".32em"
              font-size="13px"
              stroke="#2c3e50"
              stroke-width=".5"
            >
              {{ getDisplayLabel(category) }}
            </text>
            <rect 
              x="0"
              :y="barChartYScale(labelAccessor(category))"
              :width="xAccessorScaled(category)"
              :height="barChartYScale.bandwidth()"
              :fill="colorScale(labelAccessor(category))"
            />
            <text
              text-anchor="start"
              :x="xAccessorScaled(category)"
              dx="10"
              :y="barChartYScale(labelAccessor(category)) + barChartYScale.bandwidth() / 2"
              dy=".32em"
              font-size="13px"
              stroke="#2c3e50"
              stroke-width=".5"
            >
              {{ `${formatValue(xAccessor(category))}%` }}
            </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>
