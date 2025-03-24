<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  xKey: { type: String, default: 'x' },
  yKey: { type: String, default: 'y' },
  titleKey: { type: String, default: 'key' },
  pointColor: { type: String, default: 'indianred' },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 70 },
  marginBottom: { type: Number, default: 70 },
  xLabel: { type: String, default: 'X Axis' },
  yLabel: { type: String, default: 'Y Axis' },
  xGrid: { type: Boolean, default: true },
  yGrid: { type: Boolean, default: true },
  logScale: { type: Boolean, default: false },
  tipFormatString: { type: String, default: '' }
});

const chartContainer = ref(null);

function getTipFormat(d) {
  if (props.tipFormatString) {
    return props.tipFormatString
      .replace('{key}', d[props.titleKey])
      .replace('{x}', d[props.xKey])
      .replace('{y}', d[props.yKey]);
  }
  return `${props.titleKey}: ${d[props.titleKey]}\n${props.xKey}: ${d[props.xKey]}\n${props.yKey}: ${d[props.yKey]}`;
}

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';
  
  const xConfig = {
    label: props.xLabel,
    grid: props.xGrid
  };
  
  const yConfig = {
    label: props.yLabel,
    grid: props.yGrid
  };
  
  if (props.logScale) {
    yConfig.type = 'log';
  }
  
  // Create chart
  const chart = Plot.plot({
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    height: props.height,
    width: props.width,
    x: xConfig,
    y: yConfig,
    marks: [
      Plot.dot(props.data, { 
        x: props.xKey, 
        y: props.yKey, 
        title: props.titleKey, 
        fill: props.pointColor 
      }),
      Plot.tip(props.data, Plot.pointer({
        x: props.xKey,
        y: props.yKey,
        title: getTipFormat
      }))
    ],
    style: {
      fontSize: "12px"
    }
  });
  
  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.logScale, renderChart);
watch(() => props.xKey, renderChart);
watch(() => props.yKey, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem;
}
</style>