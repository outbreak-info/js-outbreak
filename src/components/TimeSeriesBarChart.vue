<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';
import { sum, rollup } from 'd3-array';
import { timeFormat, timeParse } from 'd3-time-format';
import { timeMonth, timeDay, timeYear, timeWeek } from 'd3-time';

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
  marginTop: { type: Number, default: 20 },
  rangeColor: { type: Array, default: colorPalette },
  isPreBinned: { type: Boolean, default: false },
  xTickMin: { type: [Date, String], default: null },
  xTickMax: { type: [Date, String], default: null },
  yMin: { type: Number, default: null },
  yMax: { type: Number, default: null },
  showProportion: { type: Boolean, default: false },
  tooltipDecimalPlaces: { type: Number, default: 1 },
  legendDomain: { type: Array, default: null },
  legendRange: { type: Array, default: null },
  showLegend: { type: Boolean, default: true },
  categoryOrder: { type: Array, default: null }
});

const chartContainer = ref(null);

function getMiddleDate(date, binInterval) {
  switch (binInterval) {
    case 'day':
      return date;
    case 'week':
      return timeDay.offset(timeWeek.floor(date), 3);
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
    case 'week': return "%b %d";
    case 'month': return "%b '%y";
    case 'year': return "%Y";
    default: return "%b '%y";
  }
}

function getIntervalLabel(binInterval) {
  switch (binInterval) {
    case 'day': return 'Day';
    case 'week': return 'Week';
    case 'month': return 'Month';
    case 'year': return 'Year';
    default: return 'Month';
  }
}

function getDateFromBin(binValue) {
  if (binValue instanceof Date) return binValue;

  const binStr = binValue.toString();

  const parseYear = timeParse("%Y");
  const parseMonth = timeParse("%Y-%m");
  const parseDay = timeParse("%Y-%m-%d");
  const parseWeek = timeParse("%Y-W%W");

  if (binStr.match(/^\d{4}$/)) {
    // Year: "2024"
    return parseYear(binStr);
  } else if (binStr.match(/^\d{4}-W\d{2}$/)) {
    // Week: "2024-W01"
    return parseWeek(binStr);
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

  // Calculate total for proportion display
  const total = props.data.reduce((acc, d) => acc + Number(d[props.valueKey] || 0), 0);

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
      value: d[props.valueKey],
      group: d[props.groupKey],
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

  // Tooltip format configuration for binned data
  const tipFormat = {
    format: {
      x: (d) => timeFormat(getTickFormat(props.binInterval))(d),
      y: (d) => {
        const text = d.toLocaleString();
        if (props.showProportion && total > 0) {
          const pct = ((d / total) * 100).toFixed(props.tooltipDecimalPlaces);
          return `${text} (${pct}%)`;
        }
        return text;
      },
      fill: true
    }
  };

  let binPlot;
  if (props.isPreBinned) {
    binPlot = Plot.rectY(processedData,
        Plot.binX({y: "sum"}, {
          x: "date",
          y: "value",
          fill: "group",
          interval: props.binInterval,
          ...(props.legendDomain && { order: props.legendDomain }),
          tip: tipFormat
        }));
  } else {
    binPlot = Plot.rectY(processedData, Plot.binX({ y: "sum" }, {
      x: "date",
      y: "value",
      interval: props.binInterval,
      fill: (props.legendDomain) ? "group" : props.barColor, // TODO: For now, set barColor to "group" to color by group
      ...(props.legendDomain && { order: props.legendDomain }),
      tip: tipFormat
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
        title: d => `${getIntervalLabel(props.binInterval)}: ${d.dateBin}\nCumulative: ${d.cumulative}`
      }))
    );
  }

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    x: {
      label: props.xLabel,
      type: "time",
      tickFormat: getTickFormat(props.binInterval),
      ticks: props.tickInterval,
      ...(props.xTickMin && props.xTickMax ? { 
        domain: [
          props.xTickMin instanceof Date ? props.xTickMin : new Date(props.xTickMin),
          props.xTickMax instanceof Date ? props.xTickMax : new Date(props.xTickMax)
        ]
      } : {})
    },
    y: {
      label: props.yLabel,
      ...(props.categoryOrder && { domain: props.categoryOrder }),
      ...(props.yMin !== null && props.yMax !== null ? { domain: [props.yMin, props.yMax] } : {}),
      grid: true
    },
    color: {
      legend: props.showLegend,
      ...(props.legendDomain && { domain: props.legendDomain }),
      range: props.legendRange || colorPalette
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