<script setup>
import { scaleBand, scaleLinear } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { line, curveBundle } from "d3-shape";
import { max } from 'd3-array';
import { format } from 'd3-format';
import { filterXTicks } from "../utils/tickFilters";

const props = defineProps({
  width: Number,
  data: Array,
  xAccessor: Function,
  yAccessor: Function,
  xScaleDomain: Array,
  hoveredCell: Object,
});

const parseTime = timeParse('%Y-%m-%d');
const formatTime = timeFormat('%b %e');

const lineChartWidth = 200;

const lineChartHeight = 80;

const lineChartMargin = {
  top: 25,
  right: 18,
  bottom: 25,
  left: 40,
};

const lineChartInnerWidth =
  lineChartWidth - lineChartMargin.left - lineChartMargin.right;

const lineChartInnerHeight =
  lineChartHeight - lineChartMargin.top - lineChartMargin.bottom;

const lineChartXScale = scaleBand()
  .domain(props.xScaleDomain)
  .range([0, lineChartInnerWidth])
  .padding(0);

const lineChartYScale = scaleLinear()
  .domain([0, max(props.data, props.yAccessor)])
  .range([lineChartInnerHeight, 0])
  .nice();

const xAccessorScaled = (d) => lineChartXScale(props.xAccessor(d));
const yAccessorScaled = (d) => lineChartYScale(props.yAccessor(d));

const lineGenerator = line()
  .x(xAccessorScaled)
  .y(yAccessorScaled)
  .defined(d => {
    const y = props.yAccessor(d);
    return Number.isFinite(y);
  })
  .curve(curveBundle);

const prevalenceLine = lineGenerator(props.data);

const allXTicks = lineChartXScale.domain();

const xTicksToBeRendered = filterXTicks(allXTicks, innerWidth);

const formatPrevalence = format(',.1f');

const yTicks =lineChartYScale.domain();

const yMin = lineChartYScale.range()[0];
const yMax = lineChartYScale.range()[1];
</script>

<template>
  <svg :width="lineChartWidth" :height="lineChartHeight">
    <g
      :transform="`translate(${lineChartMargin.left}, ${lineChartMargin.top})`"
    >
      <g :transform="`translate(0 ${lineChartInnerHeight})`">
        <line 
          :x1="-lineChartXScale.bandwidth() / 2" 
          :x2="lineChartInnerWidth" 
          stroke='#bdc3c7' 
        />
        <g
          v-for="(tick, index) in xTicksToBeRendered"
          :key="'xYick-' + index"
          :transform="`translate(${
            lineChartXScale(tick) + lineChartXScale.bandwidth() / 2
          } 0)`"
        >
          <line y1="0" y2="6" stroke="#bdc3c7" />
          <text
            y="10"
            dy="0.8em"
            text-anchor="middle"
            fill="#2c3e50"
            font-size="12px"
          >
            {{ formatTime(parseTime(tick)) }}
          </text>
        </g>
      </g>
      <g>
        <text
          x="-40"
          :y="yMax - 15"
          text-anchor="start"
          fill="#2c3e50"
          font-size="12px"
        >
          prevalence (%)
        </text>
        <line 
          :x1="0" 
          :x2="0" 
          :y1="yMin" 
          :y2="yMax" 
          stroke='#bdc3c7' 
        />
        <g
          v-for="(tick, index) in yTicks"
          :key="'yTick-' + index"
          :transform="`translate(0 ${lineChartYScale(tick)})`"
        >
          <line x1="0" x2="-6" stroke="#bdc3c7" />
          <text
            dx="-10"
            dy="0.34em"
            text-anchor="end"
            fill="#2c3e50"
            font-size="12px"
          >
            {{ tick == 0 ? 0 : formatPrevalence(tick) }} 
          </text>
        </g>
      </g>
      <path
        :d="prevalenceLine"
        stroke="#bdc3c7"
        stroke-width="3px"
        fill="none"
        stroke-linecap="round"
      />
      <circle
        :cx="xAccessorScaled(hoveredCell)"
        :cy="yAccessorScaled(hoveredCell)"
        fill="#000dcb"
        :r="lineChartXScale.bandwidth() / 2 + 1"
      /> 
    </g>
  </svg>
</template>
