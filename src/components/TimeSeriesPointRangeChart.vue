<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';
import { timeFormat, timeParse } from 'd3-time-format';
import { timeMonth, timeDay, timeYear } from 'd3-time';

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: 'date' },
  medianAttribute: { type: String, default: 'median' },
  q1Attribute: { type: String, default: 'q1' },
  q3Attribute: { type: String, default: 'q3' },
  groupKey: { type: String, default: 'group' },
  strokeColor: { type: String, default: colorPalette[6] },
  fillColor: { type: String, default: colorPalette[7] },
  strokeWidth: { type: Number, default: 2 },
  radius: { type: Number, default: 5 },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  marginTop: { type: Number, default: 20 },
  xLabel: { type: String, default: 'Date' },
  yLabel: { type: String, default: 'Value' },
  binInterval: { type: String, default: 'month' },
  tickInterval: { type: String, default: 'month' },
  rangeColor: { type: Array, default: colorPalette },
  // For pre binned data
  isPreBinned: { type: Boolean, default: false },
  // X-axis domain control
  xTickMin: { type: [Date, String], default: null },
  xTickMax: { type: [Date, String], default: null }
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

  let processedData = [];

  if(props.isPreBinned) {
    // Data is already binned with statistical values
    processedData = props.data
        .map(d => ({
          group: d[props.groupKey],
          dateBin: d[props.dateKey],
          date: getDateFromBin(d[props.dateKey]),
          median: d[props.medianAttribute],
          q1: d[props.q1Attribute],
          q3: d[props.q3Attribute]
        }))
        .sort((a, b) => a.date - b.date);
  } else {
    // Process raw time series data with statistical values
    const parseDay = timeParse("%Y-%m-%d");

    processedData = props.data.map(d => ({
      date: d[props.dateKey] instanceof Date ? d[props.dateKey] : parseDay(d[props.dateKey]),
      median: d[props.medianAttribute],
      q1: d[props.q1Attribute],
      q3: d[props.q3Attribute],
      group: d[props.groupKey]
    })).sort((a, b) => a.date - b.date);

    // Add middle date for binning visualization
    processedData = processedData.map(d => ({
      ...d,
      dateBin: timeFormat(getTickFormat(props.binInterval))(d.date),
      date: getMiddleDate(d.date, props.binInterval)
    }));
  }

  // Sort by date
  processedData = processedData.sort((a, b) => a.date - b.date);

  const marks = [
    Plot.gridY(),
    Plot.ruleY([0])
  ];

  // Add quartile range lines (Q1 to Q3)
  if (props.isPreBinned && processedData.some(d => d.group)) {
    // Grouped data with different colors per group
    marks.push(
      Plot.link(processedData, {
        x1: "date",
        y1: "q1",
        y2: "q3",
        stroke: "group",
        strokeWidth: props.strokeWidth,
        sort: {x: "-y"}
      })
    );
  } else {
    // Single series data
    marks.push(
      Plot.link(processedData, {
        x1: "date",
        y1: "q1",
        y2: "q3",
        stroke: props.strokeColor,
        strokeWidth: props.strokeWidth,
        sort: {x: "-y"}
      })
    );
  }

  // Add median points
  if (props.isPreBinned && processedData.some(d => d.group)) {
    // Grouped data with different colors per group
    marks.push(
      Plot.dot(processedData, {
        x: "date",
        y: "median",
        fill: "group",
        stroke: "group",
        strokeWidth: props.strokeWidth,
        r: props.radius,
      })
    );
  } else {
    // Single series data
    marks.push(
      Plot.dot(processedData, {
        x: "date",
        y: "median",
        fill: props.fillColor,
        stroke: props.strokeColor,
        strokeWidth: props.strokeWidth,
        r: props.radius,
      })
    );
  }

  // Add tooltips
  marks.push(
    Plot.tip(processedData, Plot.pointer({
      x: "date",
      y: "median",
      title: d => {
        const dateLabel = props.isPreBinned ? d.dateBin : timeFormat(getTickFormat(props.binInterval))(d.date);
        const groupLabel = d.group ? `\nGroup: ${d.group}` : '';
        return `Date: ${dateLabel}\nMedian: ${d["median"].toFixed(2)}\nQ1: ${d["q1"].toFixed(2)}\nQ3: ${d["q3"].toFixed(2)}${groupLabel}`;
      },
    }))
  );

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
      grid: true
    },
    color: {
      legend: props.isPreBinned && processedData.some(d => d.group),
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