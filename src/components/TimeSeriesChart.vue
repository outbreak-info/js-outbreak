<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: 'key' },
  valueKey: { type: String, default: 'value' },
  lineColor: { type: String, default: defaultColor },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: 'Date' },
  yLabel: { type: String, default: 'Count' },
  fontSize: { type: Number, default: 10 },
  marginTop: { type: Number, default: 20 },
  marginRight: { type: Number, default: 30 },
  marginBottom: { type: Number, default: 40 },
  marginLeft: { type: Number, default: 40 }
});

const chartContainer = ref(null);

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const processedData = props.data.map(d => ({
    ...d,
    [props.dateKey]: d[props.dateKey] instanceof Date ? d[props.dateKey] : new Date(d[props.dateKey])
  }));

  processedData.sort((a, b) => a[props.dateKey] - b[props.dateKey]);

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    style: {
      fontSize: `${props.fontSize}px`
    },
    x: {
      label: props.xLabel,
      type: "time"
    },
    y: {
      label: props.yLabel,
      grid: true
    },
    marks: [
      Plot.gridY(),
      Plot.line(processedData, {
        x: props.dateKey,
        y: props.valueKey,
        stroke: props.lineColor,
        strokeWidth: 2
      }),
      Plot.tip(processedData, Plot.pointer({
        x: props.dateKey,
        y: props.valueKey,
        title: d => `Date: ${d[props.dateKey].toLocaleDateString()}\n${props.yLabel}: ${d[props.valueKey]}`,
        fontSize: props.fontSize
      }))
    ]
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.fontSize, renderChart);
watch(() => [props.marginTop, props.marginRight, props.marginBottom, props.marginLeft], renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>
