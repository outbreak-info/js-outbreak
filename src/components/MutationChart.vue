<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
  frequencyKey: { type: String, default: 'frequency' },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  barColor: { type: String, default: defaultColor },
  xLabel: { type: String, default: 'Frequency' },
  yLabel: { type: String, default: '' },
  bins: { type: Array, default: () => [0, 0.01, 0.02, 0.03, 0.04, 0.05] },
});

const chartContainer = ref(null);

// Create frequency bins for histogram
function createFrequencyBins() {
  const bins = props.bins;
  const counts = Array(bins.length).fill(0);
  
  props.data.forEach(item => {
    const freq = parseFloat(item[props.frequencyKey]) || 0;
    
    for (let i = 0; i < bins.length; i++) {
      const max = i === bins.length - 1 ? Infinity : bins[i + 1];
      if (freq >= bins[i] && freq < max) {
        counts[i]++;
        break;
      }
    }
  });
  
  return bins.map((bin, index) => {
    const label = index < bins.length - 1 
      ? `${bin.toFixed(2)}-${bins[index + 1].toFixed(2)}`
      : `${bin.toFixed(2)}+`;
    return { key: label, value: counts[index] };
  });
}

// Format cell values
function formatValue(value, format) {
  if (value == null) return '';
  
  switch (format) {
    case 'number': return typeof value === 'number' ? value.toLocaleString() : value;
    case 'decimal': return typeof value === 'number' ? value.toFixed(2) : value;
    case 'percent': return typeof value === 'number' ? (value * 100).toFixed(1) + '%' : value;
    default: return value;
  }
}

function renderChart() {
  if (!props.data || !props.data.length || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';
  
  const frequencyData = createFrequencyBins();
  
  const chartPanel = document.createElement('div');
  chartPanel.style.padding = '20px 0 0 0';
  
  // Sample count
  const sampleCount = document.createElement('div');
  sampleCount.style.padding = '0 0 10px 20px';
  sampleCount.style.fontWeight = 'bold';
  sampleCount.textContent = `${props.data.length} Sample${props.data.length !== 1 ? 's' : ''}`;
  chartPanel.appendChild(sampleCount);
  
  const barChart = Plot.plot({
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    height: props.height,
    width: props.width,
    x: {
      tickRotate: 45, 
      label: props.xLabel, 
      type: "band"
    },
    y: {
      grid: true, 
      label: props.yLabel
    },
    marks: [
      Plot.barY(frequencyData, {x: "key", y: "value", fill: props.barColor}),
      Plot.ruleY([0])
    ]
  });
  
  chartPanel.appendChild(barChart);

  chartContainer.value.appendChild(chartPanel);
}

onMounted(() => {
  renderChart();
});

watch(() => props.data, renderChart, { deep: true });
watch(() => props.barColor, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>