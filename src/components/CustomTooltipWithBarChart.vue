<script setup>
import { computed } from "vue";
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
  
  // Optional props for area chart 
  weekAccessor: { type: Function, default: null },
  weekStartAccessor: { type: Function, default: null },
  weekEndAccessor: { type: Function, default: null },
  regionAccessor: { type: Function, default: null },
  
  // Chart title
  barChartTitle: { type: String, default: "Prevalence" },
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');
const formatValue = format(',.2f');

const tooltipWidth = 320;
const xPosForSmallScreens = 50;

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
    : props.xScale(props.hoveredDate) - (tooltipWidth - xPosForSmallScreens);
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

const barChartWidth = 300;
const barChartHeight = computed(() => numberOfGroups.value * 20);

const barChartMargin = {
  top: 0,
  right: 65,
  bottom: 0,
  left: 85,
};

const barChartInnerWidth = barChartWidth - barChartMargin.left - barChartMargin.right;
const barChartInnerHeight = computed(() => 
  barChartHeight.value - barChartMargin.top - barChartMargin.bottom
);

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
  width: `${tooltipWidth}px`,
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
        {{ region }} &#183; {{ `Epiweek ${insertYearWeekSeparator(week)}` }}
      </div>
      <div :style="tooltipDateStyle">
        {{ formatTime(parseTime(firstDate)) }} &#183;
        {{ formatTime(parseTime(lastDate)) }}
      </div>
    </template>
    <template v-else>
      <div :style="tooltipTitleStyle"> 
        {{ tooltipTitle }}
      </div>
      <div :style="tooltipDateStyle">
        {{ formatTime(parseTime(hoveredDate)) }}
      </div>
    </template>
    
    <hr :style="tooltipDividerStyle" />
    
    <!-- Bar chart -->
    <div :style="barChartWrapperStyle">
      <h1 :style="barChartTitleStyle">
        {{ barChartTitle }}
      </h1>
      <svg :width="barChartWidth" :height="barChartHeight">
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
              {{ labelAccessor(category) }}
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
