<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { heatmapColorScheme } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  colorScheme: { type: String, default: heatmapColorScheme },
  x: { type: String, default: 'x' },
  y: { type: String, default: 'y' },
  val: { type: String, default: 'val' },
  tooltipDecimalPlaces: { type: Number, default: 2 },
  xLabel: { type: String, default: 'x' },
  yLabel: { type: String, default: 'y' },
  legendLabel: { type: String, default: 'val' }
});

const chartContainer = ref(null);

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  // Create chart
  const chart = Plot.plot({
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    width: props.width,
    height: props.height,
    padding: 0,
    grid: true,
    x: {label: props.xLabel},
    y: {label: props.yLabel},
    color: {type: "linear", scheme: heatmapColorScheme, legend: true, label: props.legendLabel},
    legend: true,
    marks: [
      Plot.cell(props.data, {
        x: props.x,
        y: props.y,
        fill: props.val,
        inset: 0.5,
        rx: 4,
        ry: 4
      }),
      Plot.tip(props.data, Plot.pointer({
        x: props.x,
        y: props.y,
        title: d => `${d[props.val].toFixed(
            props.tooltipDecimalPlaces
        )}}`,
      }))
    ]
  })

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.barColor, renderChart);
watch(() => props.horizontal, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>