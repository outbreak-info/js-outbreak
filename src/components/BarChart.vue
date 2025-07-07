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
  xLabel: { type: String, default: 'value' },
  yLabel: { type: String, default: 'key' },
  sortOrder: { type: String, default: 'desc' },
  groupBy: { type: String, default: '' },
  colorBy: { type: String, default: '' }
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
          Plot.barX(props.data, {
            y: props.colorBy || "key", 
            x: "value", 
            fx: props.groupBy, 
            fill: props.colorBy || props.barColor, 
            sort: getSortOrder(props.sortOrder, props.horizontal)
          }),
          Plot.ruleX([0])
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
          Plot.barY(props.data, {
            x: props.colorBy || "key", 
            y: "value", 
            fx: props.groupBy, 
            fill: props.colorBy || props.barColor, 
            sort: getSortOrder(props.sortOrder, props.horizontal)
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

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>