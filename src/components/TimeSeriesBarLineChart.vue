<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette, otherColor } from '../utils/colorSchemes';
import { defaultFontSize, defaultFontFamily } from '../utils/chartDefaults';
import * as Plot from '@observablehq/plot';
import { sum, rollup, max as d3max, ticks as d3ticks, tickStep } from 'd3-array';
import { timeFormat, timeParse } from 'd3-time-format';
import { timeMonth, timeDay, timeYear, timeWeek } from 'd3-time';

const props = defineProps({
  // Two y-axes
  barData: { type: Array, default: () => [] },
  lineData: { type: Array, default: () => [] },
  dateKey: { type: String, default: 'key' },
  valueKey: { type: String, default: 'value' },
  groupKey: { type: String, default: 'group' },
  barDateKey: { type: String, default: null },
  barValueKey: { type: String, default: null },
  lineDateKey: { type: String, default: null },
  lineValueKey: { type: String, default: null },

  // Primary y-axis
  yLabel: { type: String, default: 'Primary y-axis' },
  yMin: { type: Number, default: 0 },
  yMax: { type: Number, default: null }, // null => autoscale (defaults to 100 when lines present)
  yIntegerTicks: { type: Boolean, default: false }, // when true, only integer ticks, deduplicated

  // Secondary y-axis (bars)
  yRightLabel: { type: String, default: 'Secondary y-axis' },
  yRightMin: { type: Number, default: 0 },
  yRightMax: { type: Number, default: null }, // null => autoscale from barData
  yRightIntegerTicks: { type: Boolean, default: false }, // when true, only integer ticks, deduplicated

  xLabel: { type: String, default: 'Surveillance Month' },

  barColor: { type: String, default: otherColor },
  barLegendLabel: { type: String, default: 'Count' },
  showBarTooltip: { type: Boolean, default: true },
  legendDomain: { type: Array, default: null },
  legendRange: { type: Array, default: null },
  showLegend: { type: Boolean, default: true },

  curve: { type: String, default: 'linear' },
  showDots: { type: Boolean, default: true },
  dotRadius: { type: Number, default: 3 },

  binInterval: { type: String, default: 'month' },
  tickInterval: { type: String, default: 'month' },
  autoTickInterval: { type: Boolean, default: true },
  isPreBinned: { type: Boolean, default: true },
  xTickMin: { type: [Date, String], default: null },
  xTickMax: { type: [Date, String], default: null },
  tickRotate: { type: Number, default: 0 },

  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginTop: { type: Number, default: 20 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 50 },
  autoMarginLeft: { type: Boolean, default: true },
  marginRight: { type: Number, default: 60 },
  autoMarginRight: { type: Boolean, default: true },

  showGridY: { type: Boolean, default: true },
  gridColor: { type: String, default: '#e0e0e0' },
  tooltipDecimalPlaces: { type: Number, default: 1 },
  lineValueSuffix: { type: String, default: '%' },
  fontSize: { type: Number, default: defaultFontSize },
  fontColor: { type: String, default: '#333' },
});

const chartContainer = ref(null);

// Helpers copied from TimeSeriesBarChart.vue
function getMiddleDate(date, binInterval) {
  switch (binInterval) {
    case 'day': return date;
    case 'week': return timeDay.offset(timeWeek.floor(date), 3);
    case 'month': return timeDay.offset(timeMonth.floor(date), 15);
    case 'year': return timeDay.offset(timeYear.floor(date), 182);
    default: return timeDay.offset(timeMonth.floor(date), 15);
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

function getDateFromBin(binValue) {
  if (binValue instanceof Date) return binValue;

  const binStr = binValue.toString();

  const parseYear = timeParse("%Y");
  const parseMonth = timeParse("%Y-%m");
  const parseDay = timeParse("%Y-%m-%d");
  const parseWeek = timeParse("%Y-W%W");

  if (binStr.match(/^\d{4}$/)) {
    return parseYear(binStr);
  } else if (binStr.match(/^\d{4}-W\d{2}$/)) {
    return parseWeek(binStr);
  } else if (binStr.match(/^\d{4}-\d{2}$/)) {
    return parseMonth(binStr);
  } else if (binStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return parseDay(binStr);
  }
  return new Date(binStr);
}

// Copied from TimeSeriesBarChart
function computeTickInterval(minDate, maxDate, binInterval, width, marginLeft, marginRight, fontSize, tickRotate) {
  const plotWidth = width - marginLeft - marginRight;
  const charWidth = fontSize * 0.6;
  const labelCharCounts = { day: 10, week: 6, month: 7, year: 4 };
  const rad = (Math.abs(tickRotate) * Math.PI) / 180;

  const binFloorFn = { day: timeDay, week: timeWeek, month: timeMonth, year: timeYear }[binInterval] || timeMonth;
  const alignedMin = binFloorFn.floor(minDate);
  const alignedMax = binFloorFn.ceil(maxDate);

  const candidates = [
    { name: 'day', countFn: () => timeDay.count(alignedMin, alignedMax) },
    { name: 'week', countFn: () => timeWeek.count(alignedMin, alignedMax) },
    { name: 'month', countFn: () => timeMonth.count(alignedMin, alignedMax) },
    { name: 'year', countFn: () => timeYear.count(alignedMin, alignedMax) },
  ];

  const binOrder = ['day', 'week', 'month', 'year'];
  const binIdx = binOrder.indexOf(binInterval);
  const eligible = candidates.filter((_, i) => i >= binIdx);

  for (const candidate of eligible) {
    const rawLabelWidth = (labelCharCounts[candidate.name] ?? 7) * charWidth;
    const effectiveLabelWidth = rad > 0
      ? rawLabelWidth * Math.abs(Math.cos(rad)) + fontSize * Math.abs(Math.sin(rad))
      : rawLabelWidth;
    const minTickSpacing = effectiveLabelWidth + charWidth * 0.5;
    const maxTicks = Math.floor(plotWidth / minTickSpacing) + 1;
    if (candidate.countFn() <= maxTicks) {
      return candidate.name;
    }
  }
  return 'year';
}

// Copied from TimeSeriesBarChart
function computeMarginLeft(values, yMin, yMax, fontSize) {
  const charWidth = fontSize * 0.6;
  const dataMax = yMax !== null ? yMax : Math.max(...values, 0);
  const dataMin = yMin !== null ? yMin : Math.min(...values, 0);

  const tickCount = 10;
  const step = (dataMax - dataMin) / tickCount;
  const candidateTicks = Array.from({ length: tickCount + 1 }, (_, i) => dataMin + i * step);

  const widestLabel = candidateTicks
    .map(v => v.toLocaleString())
    .reduce((a, b) => (a.length >= b.length ? a : b), '');

  const labelWidth = widestLabel.length * charWidth;
  return Math.ceil(6 + labelWidth + charWidth * 3);
}

// Mirror of computeMarginLeft()
function computeMarginRight(rightTicksOriginal, fontSize) {
  const charWidth = fontSize * 0.6;
  const widestLabel = rightTicksOriginal
    .map(v => Math.round(v).toLocaleString())
    .reduce((a, b) => (a.length >= b.length ? a : b), '');
  const labelWidth = widestLabel.length * charWidth;
  // tick mark (6px) + label + vertical axis title (~fontSize) + breathing room
  return Math.ceil(6 + labelWidth + fontSize + charWidth * 2);
}

function resolveKey(override, shared) {
  return override != null ? override : shared;
}

function niceCeil(v) {
  if (v <= 0) return 1;
  const step = tickStep(0, v, 10);
  return Math.ceil(v / step) * step;
}

function toDate(v) {
  return v instanceof Date ? v : new Date(v);
}

function processSeries(rows, dateKey, valueKey, groupKey, binInterval, isPreBinned) {
  if (!rows || rows.length === 0) return [];
  const parseDay = timeParse('%Y-%m-%d');
  return rows
    .map(d => ({
      date: isPreBinned
        ? getMiddleDate(getDateFromBin(d[dateKey]), binInterval)
        : (d[dateKey] instanceof Date ? d[dateKey] : parseDay(d[dateKey])),
      value: Number(d[valueKey]),
      group: groupKey ? d[groupKey] : null,
    }))
    .sort((a, b) => a.date - b.date);
}

/**
 * Given a sorted array of tick values, filter to integers only and remove
 * duplicates.
 */
function toIntegerTicks(ticks) {
  const seen = new Set();
  return ticks
    .map(Math.round)
    .filter(v => {
      if (seen.has(v)) return false;
      seen.add(v);
      return true;
    });
}

function renderChart() {
  const hasBars = props.barData && props.barData.length > 0;
  const hasLines = props.lineData && props.lineData.length > 0;
  if ((!hasBars && !hasLines) || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const binFloor = { day: timeDay, week: timeWeek, month: timeMonth, year: timeYear }[props.binInterval] || timeMonth;

  // 1. Process both datasets into the canonical { date, value, group } shape.
  const barProcessed = processSeries(
    props.barData,
    resolveKey(props.barDateKey, props.dateKey),
    resolveKey(props.barValueKey, props.valueKey),
    null,
    props.binInterval,
    props.isPreBinned,
  );
  const lineProcessed = processSeries(
    props.lineData,
    resolveKey(props.lineDateKey, props.dateKey),
    resolveKey(props.lineValueKey, props.valueKey),
    props.groupKey,
    props.binInterval,
    props.isPreBinned,
  );

  // 2. Resolve the two y-domains and the rescale factor (the dual-axis core).
  // Bars are summed per bin (matching the binX render), so derive the right max
  // from binned sums rather than raw per-row values.
  const barBinnedSums = hasBars
    ? rollup(barProcessed, v => sum(v, d => d.value), d => +binFloor.floor(d.date))
    : new Map();
  const barMax = barBinnedSums.size ? d3max(Array.from(barBinnedSums.values())) : 0;
  const lineMax = hasLines ? (d3max(lineProcessed, d => d.value) || 0) : 0;

  const rightMin = props.yRightMin != null ? props.yRightMin : 0;
  const rightMax = props.yRightMax != null ? props.yRightMax : niceCeil(barMax || 1);

  let leftMin, leftMax;
  if (hasLines) {
    leftMin = props.yMin != null ? props.yMin : 0;
    leftMax = props.yMax != null ? props.yMax : niceCeil(lineMax || 100);
  } else {
    // Bars-only: mirror the right domain so bars aren't squashed into [0,100].
    leftMin = rightMin;
    leftMax = rightMax;
  }

  const rightSpan = rightMax - rightMin;
  const scaleFactor = (!hasBars || rightSpan === 0) ? (hasBars ? 0 : 1) : (leftMax - leftMin) / rightSpan;

  // Map a right-domain (count) value into a left-domain position, and back again.
  const toPosition = (countValue) => leftMin + (countValue - rightMin) * scaleFactor;
  const toCount = (position) => scaleFactor === 0 ? rightMin : rightMin + (position - leftMin) / scaleFactor;

  const barsRescaled = barProcessed.map(d => ({ ...d, scaledValue: toPosition(d.value) }));

  // Right-axis ticks: positions live in the left domain, labels show original counts.
  // When yRightIntegerTicks is true, filter to unique integers in the right  domain
  // before mapping back to left-domain positions.
  const rightTicksCandidates = d3ticks(rightMin, rightMax, 5);
  const rightTicksOriginal = props.yRightIntegerTicks
    ? toIntegerTicks(rightTicksCandidates)
    : rightTicksCandidates;
  const rightTickPositions = rightTicksOriginal.map(toPosition);

  // Left-axis ticks: when yIntegerTicks is true, compute explicit integer ticks over
  // the left domain so Plot does not render fractional values.
  // These are used both for the explicit axisY mark (dual-axis case) and for the
  // implicit y-scale ticks (lines-only case, passed via y.ticks).
  const leftTicksCandidates = d3ticks(leftMin, leftMax, 10);
  const leftTicksExplicit = props.yIntegerTicks
    ? toIntegerTicks(leftTicksCandidates)
    : null; // null => let Plot decide

  // 3. Margins.
  const resolvedMarginLeft = props.autoMarginLeft
    ? computeMarginLeft([leftMin, leftMax], leftMin, leftMax, props.fontSize)
    : props.marginLeft;
  const resolvedMarginRight = (props.autoMarginRight && hasBars)
    ? computeMarginRight(rightTicksOriginal, props.fontSize)
    : props.marginRight;

  // Tick interval, derived from the union of bar + line dates.
  let resolvedTickInterval;
  if (!props.autoTickInterval) {
    resolvedTickInterval = props.tickInterval;
  } else {
    const allDates = [...barProcessed, ...lineProcessed].map(d => d.date);
    const dataMin = allDates.reduce((a, b) => (a < b ? a : b), allDates[0]);
    const dataMax = allDates.reduce((a, b) => (a > b ? a : b), allDates[0]);
    const rangeMin = props.xTickMin ? toDate(props.xTickMin) : dataMin;
    const rangeMax = props.xTickMax ? toDate(props.xTickMax) : dataMax;
    resolvedTickInterval = computeTickInterval(
      rangeMin, rangeMax, props.binInterval, props.width,
      resolvedMarginLeft, resolvedMarginRight, props.fontSize, props.tickRotate,
    );
  }

  // Tooltip formatters.
  const fmtBin = (d) => timeFormat(getTickFormat(props.binInterval))(binFloor.floor(d));
  const barTipFormat = {
    format: {
      x: fmtBin,
      y: (d) => Math.round(toCount(d)).toLocaleString(), // un-rescale to original count
      fill: true,
    },
  };
  const lineTipFormat = {
    format: {
      x: fmtBin,
      y: (d) => `${Number(d).toFixed(props.tooltipDecimalPlaces)}${props.lineValueSuffix}`,
      fill: true,
    },
  };

  // Color scale: line groups first, the bar swatch ("Enrolled") last.
  const lineGroups = hasLines
    ? (props.legendDomain || Array.from(new Set(lineProcessed.map(d => d.group))))
    : [];
  const lineColors = props.legendRange || colorPalette;
  const colorDomain = [...lineGroups, ...(hasBars ? [props.barLegendLabel] : [])];
  const colorRange = [...lineColors.slice(0, lineGroups.length), ...(hasBars ? [props.barColor] : [])];

  const marks = [];

  if (props.showGridY) {
    marks.push(Plot.gridY({ stroke: props.gridColor, strokeWidth: 0.5, strokeOpacity: 0.7 }));
  }

  if (hasBars) {
    marks.push(
      Plot.rectY(barsRescaled, Plot.binX({ y: 'sum' }, {
        x: 'date',
        y: 'scaledValue',
        interval: props.binInterval,
        fill: () => props.barLegendLabel,
        ...(props.showBarTooltip ? { tip: barTipFormat } : {}),
      })),
    );
  }

  marks.push(Plot.ruleY([0]));

  if (hasLines) {
    marks.push(
      Plot.line(lineProcessed, {
        x: 'date', y: 'value', z: 'group', stroke: 'group',
        strokeWidth: 2, curve: props.curve,
      }),
    );
    if (props.showDots) {
      marks.push(
        Plot.dot(lineProcessed, {
          x: 'date', y: 'value', fill: 'group', r: props.dotRadius, fillOpacity: 0.9,
          tip: lineTipFormat,
        }),
      );
    }
  }

  if (hasBars) {
    // Adding an explicit right axis suppresses Plot's implicit left axis, so the
    // left (primary) axis must be rendered explicitly too.
    marks.push(
      Plot.axisY(
        // Pass explicit integer ticks when requested; otherwise let Plot choose.
        ...(leftTicksExplicit ? [leftTicksExplicit] : []),
        {
          anchor: 'left',
          label: props.yLabel,
          labelAnchor: 'center',
          labelArrow: 'none',
          tickSize: 6,
          // Suppress the ".0" suffix Plot adds to whole-number floats.
          ...(leftTicksExplicit ? { tickFormat: v => Math.round(v).toLocaleString() } : {}),
        },
      ),
    );
    marks.push(
      Plot.axisY(rightTickPositions, {
        anchor: 'right',
        label: props.yRightLabel,
        labelAnchor: 'center',
        labelArrow: 'none',
        tickFormat: (pos) => Math.round(toCount(pos)).toLocaleString(),
        tickSize: 6,
      }),
    );
  }

  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    marginTop: props.marginTop,
    marginRight: resolvedMarginRight,
    marginBottom: props.marginBottom,
    marginLeft: resolvedMarginLeft,
    style: {
      fontSize: `${props.fontSize}px`,
      fontFamily: defaultFontFamily,
      background: 'transparent',
      color: props.fontColor,
    },
    x: {
      label: props.xLabel,
      labelAnchor: 'center',
      labelArrow: 'none',
      type: 'time',
      tickFormat: getTickFormat(resolvedTickInterval),
      ticks: resolvedTickInterval,
      tickRotate: props.tickRotate,
      ...(props.xTickMin && props.xTickMax ? { domain: [toDate(props.xTickMin), toDate(props.xTickMax)] } : {}),
    },
    y: {
      label: props.yLabel,
      labelAnchor: 'center',
      labelArrow: 'none',
      domain: [leftMin, leftMax],
      // In lines-only mode (no bars) Plot renders the left axis implicitly from
      // the y scale, so pass ticks here to enforce integer-only values.
      ...(!hasBars && leftTicksExplicit ? {
        ticks: leftTicksExplicit,
        // Suppress the ".0" suffix Plot adds to whole-number floats.
        tickFormat: v => Math.round(v).toLocaleString(),
      } : {}),
    },
    color: {
      legend: props.showLegend && colorDomain.length > 0,
      domain: colorDomain,
      range: colorRange,
      style: { fontSize: `${props.fontSize}px` },
    },
    marks,
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.barData, renderChart, { deep: true });
watch(() => props.lineData, renderChart, { deep: true });
watch(
  () => [
    props.dateKey, props.valueKey, props.groupKey,
    props.barDateKey, props.barValueKey, props.lineDateKey, props.lineValueKey,
    props.yLabel, props.yMin, props.yMax, props.yIntegerTicks,
    props.yRightLabel, props.yRightMin, props.yRightMax, props.yRightIntegerTicks,
    props.xLabel,
    props.barColor, props.barLegendLabel, props.showBarTooltip, props.legendDomain, props.legendRange, props.showLegend,
    props.curve, props.showDots, props.dotRadius,
    props.binInterval, props.tickInterval, props.autoTickInterval, props.isPreBinned,
    props.xTickMin, props.xTickMax, props.tickRotate,
    props.height, props.width,
    props.marginTop, props.marginBottom, props.marginLeft, props.autoMarginLeft,
    props.marginRight, props.autoMarginRight,
    props.showGridY, props.gridColor, props.tooltipDecimalPlaces, props.lineValueSuffix,
    props.fontSize, props.fontColor,
  ],
  renderChart,
);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>

<style scoped>
</style>
