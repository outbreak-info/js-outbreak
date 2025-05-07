<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  xAttribute: { type: String, default: 'key' },
  medianAttribute: { type: String, default: 'median' },
  q1Attribute: { type: String, default: 'q1' },
  q3Attribute: { type: String, default: 'q3' },
  minAttribute: { type: String, default: 'min' },
  maxAttribute: { type: String, default: 'max' },
  strokeColor: { type: String, default: colorPalette[6] },
  fillColor: { type: String, default: colorPalette[7] },
  strokeWidth: { type: Number, default: 2 },
  radius: { type: Number, default: 5 },
  height: { type: Number, default: 500 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: 'Key' },
  yLabel: { type: String, default: 'Count' }
});

const chartContainer = ref(null);

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    x: {
      label: props.xLabel,
      tickRotate: 45
    },
    y: {
      label: props.yLabel,
      grid: true
    },
    marks: [
      Plot.gridY(),
      Plot.link(props.data, {
        x1: props.xAttribute,
        y1: props.q1Attribute,
        y2: props.q3Attribute,
        stroke: props.strokeColor,
        strokeWidth: props.strokeWidth,
        sort: {x: "-y"}
      }),
      Plot.dot(props.data, {
        x: props.xAttribute,
        y: props.medianAttribute,
        fill: props.fillColor,
        stroke: props.strokeColor,
        strokeWidth: props.strokeWidth,
        r: props.radius,
      }),
      Plot.tip(props.data, Plot.pointer({
        x: props.xAttribute,
        y: props.medianAttribute,
        title: d => `Median: ${d[props.medianAttribute]}\nQ1: ${d[props.q1Attribute]}\nQ3: ${d[props.q3Attribute]}`,
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