<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import { defaultFontSize, defaultFontFamily } from '../utils/chartDefaults';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  horizontal: { type: Boolean, default: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginTop: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  barColor: { type: String, default: defaultColor },
  xKey: { type: String, default: 'value' }, // TODO: xKey is currently used for x-axis in horizontal and y-axis in vertical. Fix this.
  yKey: { type: String, default: 'key' },
  xLabel: { type: String, default: 'value' },
  yLabel: { type: String, default: 'key' },
  sortOrder: { type: String, default: 'desc' },
  groupBy: { type: String, default: '' },
  colorBy: { type: String, default: '' }, // Use barColor to color bars by category and colorBy to set BOTH fill and tick label to attribute. Change this in the future?
  stacked: { type: Boolean, default: false },
  showProportion: { type: Boolean, default: false },
  tooltipDecimalPlaces: { type: Number, default: 1 },
  legendDomain: { type: Array, default: null },
  legendRange: { type: Array, default: null },
  showLegend: { type: Boolean, default: true },
  categoryOrder: { type: Array, default: null },
  xMin: { type: Number, default: null },
  xMax: { type: Number, default: null },
  yMin: { type: Number, default: null },
  yMax: { type: Number, default: null },
  fontSize: { type: Number, default: defaultFontSize }
});

const chartContainer = ref(null);

function getSortOrder(sortOrder, horizontal) {
  let desc = {x: "-y"};
  let asc = {x: "y"};

  if (horizontal) {
    desc = {y: "-x"};
    asc = {y: "x"};
  }

  switch (props.sortOrder) {
    case 'desc':          // descending
      return desc;

    case 'asc':           // ascending
      return asc;

    case 'None':          // leave unsorted
      return false;
  }
  return false;
}

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const total = props.data.reduce((sum, d) => sum + Number(d[props.xKey] || 0), 0);

  // Format function that handles both numeric values and category strings
  const formatValue = (d) => {
    if (typeof d === 'number') {
      const text = d.toLocaleString();
      if (props.showProportion && total > 0) {
        const pct = ((d / total) * 100).toFixed(props.tooltipDecimalPlaces);
        return `${text} (${pct}%)`;
      }
      return text;
    }
    return d;
  };

  const horizontalTipFormat = {
    format: { x: formatValue, fill: true }
  };

  const verticalTipFormat = {
    format: { y: formatValue, fill: true }
  };



  // Create chart
  const chart = props.horizontal
    ? Plot.plot({
        marginLeft: props.marginLeft,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        height: props.height,
        width: props.width,
        fx: props.groupBy,
        style: {
          fontSize: `${props.fontSize}px`,
          fontFamily: defaultFontFamily,
          background: "transparent",
        },
        y: {
          label: props.yLabel,
          ...(props.categoryOrder && { domain: props.categoryOrder })
        },
        x: {
          label: props.xLabel,
          ...(props.xMin !== null && props.xMax !== null ? { domain: [props.xMin, props.xMax] } : {}),
          grid: true
        },
        color: {
          legend: props.showLegend,
          ...(props.legendDomain && { domain: props.legendDomain }),
          range: props.legendRange || colorPalette
        },
        marks: [
          props.stacked
            ? Plot.barX(props.data, Plot.stackX({
                y: props.yKey,
                x: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy,
                ...(props.legendDomain && { order: props.legendDomain }),
                tip: horizontalTipFormat
              }))
            : Plot.barX(props.data, {
                y: props.colorBy || props.yKey,
                x: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy || props.barColor,
                sort: getSortOrder(props.sortOrder, props.horizontal),
                tip: horizontalTipFormat
              }),
          Plot.ruleX([0]),
        ]
      })
    : Plot.plot({
        marginBottom: props.marginBottom,
        marginTop: props.marginTop,
        marginLeft: props.marginLeft,
        height: props.height,
        width: props.width,
        fx: props.groupBy,
        style: {
          fontSize: `${props.fontSize}px`,
          fontFamily: defaultFontFamily,
          background: "transparent",
        },
        x: {
          tickRotate: 45,
          label: props.xLabel,
          ...(props.categoryOrder && { domain: props.categoryOrder })
        },
        y: {
          grid: true,
          label: props.yLabel,
          ...(props.yMin !== null && props.yMax !== null ? { domain: [props.yMin, props.yMax] } : {})
        },
        color: {
          legend: props.showLegend,
          ...(props.legendDomain && { domain: props.legendDomain }),
          range: props.legendRange || colorPalette
        },
        marks: [
          props.stacked
            ? Plot.barY(props.data, Plot.stackY({
                x: props.yKey,
                y: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy,
                ...(props.legendDomain && { order: props.legendDomain }),
                tip: verticalTipFormat
              }))
            : Plot.barY(props.data, {
                x: props.colorBy || props.yKey,
                y: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy || props.barColor,
                sort: getSortOrder(props.sortOrder, props.horizontal),
                tip: verticalTipFormat
              }),
          Plot.ruleY([0])
        ]
      });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.barColor, renderChart);
watch(() => props.horizontal, renderChart);
watch(() => props.groupBy, renderChart);
watch(() => props.colorBy, renderChart);
watch(() => props.stacked, renderChart);
watch(() => props.showProportion, renderChart);
watch(() => props.tooltipDecimalPlaces, renderChart);
watch(() => props.legendDomain, renderChart, { deep: true });
watch(() => props.legendRange, renderChart, { deep: true });
watch(() => props.showLegend, renderChart);
watch(() => props.categoryOrder, renderChart, { deep: true });
watch(() => props.xMin, renderChart);
watch(() => props.xMax, renderChart);
watch(() => props.yMin, renderChart);
watch(() => props.yMax, renderChart);
watch(() => props.fontSize, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>