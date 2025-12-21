<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
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
  xKey: { type: String, default: 'value' },
  yKey: { type: String, default: 'key' },
  xLabel: { type: String, default: 'value' },
  yLabel: { type: String, default: 'key' },
  sortOrder: { type: String, default: 'desc' },
  groupBy: { type: String, default: '' },
  colorBy: { type: String, default: '' }, // Use barColor to color bars by category and colorBy to set BOTH fill and tick label to attribute. Change this in the future?
  stacked: { type: Boolean, default: false }
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



  // Create chart
  const chart = props.horizontal
    ? Plot.plot({
        marginLeft: props.marginLeft,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        height: props.height,
        width: props.width,
        fx: props.groupBy,
        y: {label: props.yLabel},
        x: {label: props.xLabel, grid: true},
        color: {
          legend: true,
          range: colorPalette
        },
        marks: [
          props.stacked
            ? Plot.barX(props.data, Plot.stackX({
                y: props.yKey,
                x: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy,
                tip: true
              }))
            : Plot.barX(props.data, {
                y: props.colorBy || props.yKey,
                x: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy || props.barColor,
                sort: getSortOrder(props.sortOrder, props.horizontal),
                tip: true
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
        x: {tickRotate: 45, label: props.xLabel},
        y: {grid: true, label: props.yLabel},
        color: {
          legend: true,
          range: colorPalette
        },
        marks: [
          props.stacked
            ? Plot.barY(props.data, Plot.stackY({
                x: props.yKey,
                y: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy,
                tip: true
              }))
            : Plot.barY(props.data, {
                x: props.colorBy || props.yKey,
                y: props.xKey,
                fx: props.groupBy,
                fill: props.colorBy || props.barColor,
                sort: getSortOrder(props.sortOrder, props.horizontal),
                tip: true
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

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>