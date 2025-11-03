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
  xScale: Function,
  colorScale: Function,
  tooltipTitle: { type: String, default: "San Diego, CA, USA" },
  barChartTitle: { type: String, default: "Prevalence" },
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');
const formatValue = format(',.2f');

const xAccessor = d => +d.proportion; 

const tooltipWidth = 320;
const xPosForSmallScreens = 50;

const dateIndex = computed(() =>
  props.xScale.domain().indexOf(props.hoveredDate),
);

const dateArrayLength = props.xScale.domain().length;

const midPoint = Math.floor(dateArrayLength / 2);

const xPosition = computed(() => setXPosition())

const setXPosition = () => {
  let xPos;
  if (props.width <= 700) {
    xPos = xPosForSmallScreens;
  } else xPos = dateIndex.value <= midPoint ?
      props.xScale(props.hoveredDate) + xPosForSmallScreens :
      props.xScale(props.hoveredDate) -
        (tooltipWidth - xPosForSmallScreens);
  return xPos;
}

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
}

const tooltipDividerStyle = {
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  marginTop: "5px",
  marginBottom: "5px",
};

const tooltipGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  fontWeight: "400",
  marginBottom: "5px",
};

const tooltipDataStyle = {
  textAlign: "right",
};

const barChartWrapperStyle = {
  fontWeight: "400",
}

const barChartTitleStyle = {
  fontWeight: "700",
  fontSize: "14px",
}
</script>

<template>
  <div :style="tooltipWrapperStyle">
    <div :style="tooltipTitleStyle"> 
      {{ tooltipTitle }} 
    </div>
    <div :style="tooltipDateStyle">
      {{ formatTime(parseTime(hoveredDate)) }}
      <hr :style="tooltipDividerStyle" />
    </div>
    <div :style="barChartWrapperStyle">
      <h1 :style="barChartTitleStyle">
        {{ barChartTitle }}
      </h1>
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
