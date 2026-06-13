<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import { defaultFontSize, defaultFontFamily } from '../utils/chartDefaults';
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
  // When true (default), the tick interval is computed dynamically to avoid
  // label overlap. Set to false to use tickInterval as-is.
  autoTickInterval: { type: Boolean, default: true },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 50 },
  // When true (default), marginLeft is computed dynamically based on the widest
  // y-axis tick label. Set to false to use marginLeft as-is.
  autoMarginLeft: { type: Boolean, default: true },
  marginRight: { type: Number, default: 20 },
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
  categoryOrder: { type: Array, default: null },
  fontSize: { type: Number, default: defaultFontSize },
  tickRotate: { type: Number, default: 0 },
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

function computeTickInterval(minDate, maxDate, binInterval, width, marginLeft, marginRight, fontSize, tickRotate) {
  const plotWidth = width - marginLeft - marginRight;

  // Approximate character width relative to font size
  const charWidth = fontSize * 0.6;

  // Estimated label widths (in characters) per format string
  const labelCharCounts = {
    day: 10,   // "2024-01-15"
    week: 6,   // "Jan 15"
    month: 7,  // "Jan '24"
    year: 4,   // "2024"
  };
  const rawLabelWidth = (labelCharCounts[binInterval] ?? 7) * charWidth;

  // When labels are rotated, their horizontal footprint shrinks.
  // Use the projected width onto the x-axis: w * |cos(θ)| + h * |sin(θ)|
  // For simplicity we treat label height as fontSize.
  const rad = (Math.abs(tickRotate) * Math.PI) / 180;
  const effectiveLabelWidth = rad > 0
    ? rawLabelWidth * Math.abs(Math.cos(rad)) + fontSize * Math.abs(Math.sin(rad))
    : rawLabelWidth;

  // Minimum spacing between tick centres: label width + half a character of breathing room.
  const minTickSpacing = effectiveLabelWidth + charWidth * 0.5;

  // Maximum number of ticks that fit: n ticks create (n-1) gaps, so the last
  // tick doesn't need a trailing slot. Solving (n-1) * spacing <= plotWidth gives n.
  const maxTicks = Math.floor(plotWidth / minTickSpacing) + 1;

  // Align the date range to bin boundaries, matching how Plot pads its x domain
  // for bar charts (floor the start, ceil the end to the next bin boundary).
  const binFloorFn = { day: timeDay, week: timeWeek, month: timeMonth, year: timeYear }[binInterval] || timeMonth;
  const alignedMin = binFloorFn.floor(minDate);
  const alignedMax = binFloorFn.ceil(maxDate);

  // Candidate intervals ordered finest: coarsest, each paired with a function
  // that counts how many ticks of that interval fall in [alignedMin, alignedMax].
  const candidates = [
    { name: 'day',   countFn: () => timeDay.count(alignedMin, alignedMax) },
    { name: 'week',  countFn: () => timeWeek.count(alignedMin, alignedMax) },
    { name: 'month', countFn: () => timeMonth.count(alignedMin, alignedMax) },
    { name: 'year',  countFn: () => timeYear.count(alignedMin, alignedMax) },
  ];

  // Only consider intervals that are >= binInterval (no point ticking finer than bins)
  const binOrder = ['day', 'week', 'month', 'year'];
  const binIdx = binOrder.indexOf(binInterval);
  const eligible = candidates.filter((_, i) => i >= binIdx);

  for (const candidate of eligible) {
    if (candidate.countFn() <= maxTicks) {
      return candidate.name;
    }
  }

  // Fallback: yearly ticks always fit
  return 'year';
}

function computeMarginLeft(values, yMin, yMax, fontSize) {
  const charWidth = fontSize * 0.6;

  const dataMax = yMax !== null ? yMax : Math.max(...values, 0);
  const dataMin = yMin !== null ? yMin : Math.min(...values, 0);

  // Generate representative tick values across the domain.
  // Plot targets roughly 5 ticks; we sample ~10 to be safe and find the widest.
  const tickCount = 10;
  const step = (dataMax - dataMin) / tickCount;
  const candidateTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    dataMin + i * step
  );

  // Format each tick the same way Plot does by default
  const widestLabel = candidateTicks
    .map(v => v.toLocaleString())
    .reduce((a, b) => (a.length >= b.length ? a : b), '');

  const labelWidth = widestLabel.length * charWidth;

  // tick mark (6px) + label + three chars of breathing room between label and plot area
  return Math.ceil(6 + labelWidth + charWidth * 3);
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

  const timeIntervalFloor = { day: timeDay, week: timeWeek, month: timeMonth, year: timeYear };
  const binFloor = timeIntervalFloor[props.binInterval] || timeMonth;
  const binTotalMap = new Map();
  binnedData.forEach(d => {
    const key = timeFormat(getTickFormat(props.binInterval))(binFloor.floor(d.date));
    binTotalMap.set(key, (binTotalMap.get(key) || 0) + Number(d.value));
  });

  let cumulative = 0;
  binnedCumulativeData = binnedData.map(d => {
    cumulative += d.value;
    return {
      date: d.date,
      cumulative: cumulative,
      dateBin: timeFormat(getTickFormat(props.binInterval))(d.date)
    };
  });

  // When autoMarginLeft is true, compute dynamically based on the widest y-axis
  // tick label. Set autoMarginLeft to false to use marginLeft as-is.
  const allValues = processedData.map(d => Number(d.value));
  const resolvedMarginLeft = props.autoMarginLeft
    ? computeMarginLeft(allValues, props.yMin, props.yMax, props.fontSize)
    : props.marginLeft;

  // When autoTickInterval is true, compute dynamically to avoid label overlap.
  // Set autoTickInterval to false to use tickInterval as-is.
  let resolvedTickInterval;
  if (!props.autoTickInterval) {
    // Caller opted out of auto-computation — use tickInterval as-is
    resolvedTickInterval = props.tickInterval;
  } else {
    // Derive the visible date range (respecting xTickMin/xTickMax if provided)
    const allDates = binnedData.map(d => d.date);
    const dataMin = allDates.reduce((a, b) => a < b ? a : b, allDates[0]);
    const dataMax = allDates.reduce((a, b) => a > b ? a : b, allDates[0]);

    const rangeMin = props.xTickMin
      ? (props.xTickMin instanceof Date ? props.xTickMin : new Date(props.xTickMin))
      : dataMin;
    const rangeMax = props.xTickMax
      ? (props.xTickMax instanceof Date ? props.xTickMax : new Date(props.xTickMax))
      : dataMax;

    resolvedTickInterval = computeTickInterval(
      rangeMin,
      rangeMax,
      props.binInterval,
      props.width,
      resolvedMarginLeft,
      props.marginRight,
      props.fontSize,
      props.tickRotate,
    );
  }

  // Tooltip format configuration for binned data
  let _tipBinKey = null;
  const tipFormat = {
    format: {
      x: (d) => {
        _tipBinKey = timeFormat(getTickFormat(props.binInterval))(binFloor.floor(d));
        return _tipBinKey;
      },
      y: (d) => {
        const binTotal = _tipBinKey ? (binTotalMap.get(_tipBinKey) || 0) : 0;
        const text = d.toLocaleString();
        if (binTotal > 0) {
          const pct = ((d / binTotal) * 100).toFixed(props.tooltipDecimalPlaces);
          return `${text} (${pct}%)`;
        }
        return text;
      },
      fill: false
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
    marginLeft: resolvedMarginLeft,
    marginRight: props.marginRight,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    style: {
      fontSize: `${props.fontSize}px`,
      fontFamily: defaultFontFamily,
      background: "transparent",
    },
    x: {
      label: props.xLabel,
      labelAnchor: "center",
      labelArrow: "none",
      type: "time",
      tickFormat: getTickFormat(props.binInterval),
      ticks: resolvedTickInterval,
      tickRotate: props.tickRotate,
      ...(props.xTickMin && props.xTickMax ? {
        domain: [
          props.xTickMin instanceof Date ? props.xTickMin : new Date(props.xTickMin),
          props.xTickMax instanceof Date ? props.xTickMax : new Date(props.xTickMax)
        ]
      } : {})
    },
    y: {
      label: props.yLabel,
      labelAnchor: "center",
      labelArrow: "none",
      ...(props.categoryOrder && { domain: props.categoryOrder }),
      ...(props.yMin !== null && props.yMax !== null ? { domain: [props.yMin, props.yMax] } : {}),
      grid: true
    },
    color: {
      legend: props.showLegend,
      style: { fontSize: `${props.fontSize}px` },
      ...(props.legendDomain && { domain: props.legendDomain }),
      range: props.legendRange || colorPalette
    },
    marks
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.fontSize, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>
