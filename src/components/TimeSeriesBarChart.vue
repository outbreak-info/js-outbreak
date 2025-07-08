<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';
import { sum, rollup } from 'd3-array';
import { timeFormat, timeParse } from 'd3-time-format';
import { timeMonth, timeMonths, timeDay, timeYear } from 'd3-time';

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: 'key' },
  valueKey: { type: String, default: 'value' },
  groupKey: { type: String, default: 'group' },
  barColor: { type: String, default: defaultColor },
  lineColor: { type: String, default: colorPalette[2] },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: 'Month' },
  yLabel: { type: String, default: 'Count' },
  showCumulativeLine: { type: Boolean, default: false },
  binInterval: { type: String, default: 'month' },
  tickInterval: { type: String, default: 'month' },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 50 },
  rangeColor: { type: Array, default: colorPalette },
  // For pre binned data
  isPreBinned: { type: Boolean, default: false }
});

const chartContainer = ref(null);

function getMiddleDate(date, binInterval) {
  switch (binInterval) {
    case 'day':
      return date;
    case 'month':
      return timeDay.offset(timeMonth.floor(date), 15);
    case 'year':
      return timeDay.offset(timeYear.floor(date), 182);
    default:
      return timeDay.offset(timeMonth.floor(date), 15);
  }
}

function getTickFormat(binInterval) {
  switch (binInterval) {
    case 'day': return "%Y-%m-%d";
    case 'month': return "%b '%y";
    case 'year': return "%Y";
    default: return "%b '%y";
  }
}

function getDateFromBin(binValue) {
  if (binValue instanceof Date) return binValue;

  const binStr = binValue.toString();

  const parseYear = timeParse("%Y");
  const parseMonth = timeParse("%Y-%m");
  const parseDay = timeParse("%Y-%m-%d");

  if (binStr.match(/^\d{4}$/)) {
    // Year: "2024"
    return parseYear(binStr);
  } else if (binStr.match(/^\d{4}-\d{2}$/)) {
    // Month: "2024-01"
    return parseMonth(binStr);
  } else if (binStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Day: "2024-01-15"
    return parseDay(binStr);
  }
  return new Date(binStr);
}

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  let binnedData = [], binnedCumulativeData = [], processedData = [];

  if(props.isPreBinned) {
    // Data is already binned. Note: Data will be summed by groupKey regardless
    processedData = props.data
        .map(d => ({
          group: d[props.groupKey],
          dateBin: d[props.dateKey],
          date: getDateFromBin(d[props.dateKey]),
          value: d[props.valueKey]
        }))
        .sort((a, b) => a.date - b.date);

    // Data is pre binned
    binnedData = processedData;
  } else {
    // Sort data by date
    const parseDay = timeParse("%Y-%m-%d");

    processedData = props.data.map(d => ({
      date: d[props.dateKey] instanceof Date ? d[props.dateKey] : parseDay(d[props.dateKey]),
      value: d[props.valueKey]
    })).sort((a, b) => a.date - b.date);

    // Bin by binInterval. This is only for cumulative line.
    const binnedValues = rollup(processedData,
        v => sum(v, d => d.value),
        d => [timeFormat(getTickFormat(props.binInterval))(d.date), getMiddleDate(d.date, props.binInterval)]
    )

    binnedData = Array.from(binnedValues.entries())
        .map(([key, value]) => ({
          dateBin: key[0],
          date: key[1],
          value: value
        }));
  }

  // Sort by date. Should be the only place with sort
  binnedData = binnedData.sort((a, b) => a.date - b.date);

  let cumulative = 0;
  binnedCumulativeData = binnedData.map(d => {
    cumulative += d.value;
    return {
      date: d.date,
      cumulative: cumulative,
      dateBin: timeFormat(getTickFormat(props.binInterval))(d.date)
    };
  });

  let binPlot;
  if (props.isPreBinned) {
    binPlot = Plot.rectY(processedData,
        Plot.binX({y: "sum"}, {
          x: "date",
          y: "value",
          fill: "group",
          interval: props.binInterval,
          tip: true,
          title: d => `${timeFormat(getTickFormat(props.binInterval))(d.date)}\n${d.value.toLocaleString()}\n${d.group}`
        }));
  } else {
    binPlot = Plot.rectY(processedData, Plot.binX({ y: "sum" }, {
      x: "date",
      y: "value",
      interval: props.binInterval,
      fill: props.barColor,
      tip: true,
      title: d => `${timeFormat(getTickFormat(props.binInterval))(d.date)}\n${d.value.toLocaleString()}`
    }));
  }

  const marks = [
    binPlot,
    Plot.ruleY([0])
  ];

  if (props.showCumulativeLine) {
    // TODO: Make this work for pre-binned data
    // Use the binned cumulative data for the line and tooltip
    marks.push(
      Plot.line(binnedCumulativeData, { x: "date", y: "cumulative", stroke: props.lineColor, strokeWidth: 1.5, marker: "dot" }),
      Plot.tip(binnedCumulativeData, Plot.pointer({
        x: "date",
        y: "cumulative",
        title: d => `Month: ${d.dateBin}\nCumulative: ${d.cumulative}` // Use the pre-calculated monthLabel
      }))
    );
  }

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    x: {
      label: props.xLabel,
      type: "time",
      tickFormat: getTickFormat(props.binInterval),
      ticks: props.tickInterval
    },
    y: {
      label: props.yLabel,
      grid: true
    },
    color: {
      legend: true,
      range: props.rangeColor
    },
    marks
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>