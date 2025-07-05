<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  categoryKey: { type: String, default: 'category' },
  time1Key: { type: String, default: 'time1' },
  time2Key: { type: String, default: 'time2' },
  time1Label: { type: String, default: 'Start Time' },
  time2Label: { type: String, default: 'End Time' },
  time1Color: { type: String, default: colorPalette[0] },
  time2Color: { type: String, default: colorPalette[1] },
  linkColor: { type: String, default: colorPalette[2] },
  linkStrokeWidth: { type: Number, default: 2 },
  dotRadius: { type: Number, default: 4 },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 100 },
  marginBottom: { type: Number, default: 50 },
  xLabel: { type: String, default: 'Time' },
  yLabel: { type: String, default: 'Category' }
});

const chartContainer = ref(null);

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const chart = Plot.plot({
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    height: props.height,
    width: props.width,
    x: { 
      label: props.xLabel, 
      type: 'time',
      grid: true
    },
    y: { 
      label: props.yLabel,
      domain: props.data.map(d => d[props.categoryKey])
    },
    marks: [
      Plot.link(props.data, {
        x1: props.time1Key,
        x2: props.time2Key,
        y1: props.categoryKey,
        y2: props.categoryKey,
        stroke: props.linkColor,
        strokeWidth: props.linkStrokeWidth
      }),
      Plot.dot(props.data, {
        x: props.time1Key,
        y: props.categoryKey,
        fill: props.time1Color,
        r: props.dotRadius,
        stroke: 'white',
        strokeWidth: 1
      }),
      Plot.dot(props.data, {
        x: props.time2Key,
        y: props.categoryKey,
        fill: props.time2Color,
        r: props.dotRadius,
        stroke: 'white',
        strokeWidth: 1
      }),
      Plot.tip(props.data, Plot.pointer({
        x: props.time1Key,
        y: props.categoryKey,
        title: d => `${d[props.categoryKey]}\n${props.time1Label}: ${d[props.time1Key].toISOString().slice(0, 10) || d[props.time1Key]}\n${props.time2Label}: ${d[props.time2Key].toISOString().slice(0, 10) || d[props.time2Key]}`
      })),
      Plot.tip(props.data, Plot.pointer({
        x: props.time2Key,
        y: props.categoryKey,
        title: d => `${d[props.categoryKey]}\n${props.time1Label}: ${d[props.time1Key].toISOString().slice(0, 10) || d[props.time1Key]}\n${props.time2Label}: ${d[props.time2Key].toISOString().slice(0, 10) || d[props.time2Key]}`
      }))
    ]
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