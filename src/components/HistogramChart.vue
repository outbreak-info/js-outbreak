<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { defaultColor } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  frequencyKey: { type: String, default: 'frequency' },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  barColor: { type: String, default: defaultColor },
  xLabel: { type: String, default: 'Frequency Range' },
  yLabel: { type: String, default: 'Number of Samples' },
  xMin: { type: Number, default: 0 },
  xMax: { type: Number, default: 1 },
  binCount: { type: Number, default: 10 }, // 10 bins for 0 to 1 with 0.1 steps
  bins: { type: Array, default: null }, // Make this optional to allow auto-generation
});

const chartContainer = ref(null);

// Compute bins dynamically if not provided
const computedBins = computed(() => {
  if (props.bins) return props.bins;
  
  const step = (props.xMax - props.xMin) / props.binCount;
  const bins = [];
  
  for (let i = 0; i <= props.binCount; i++) {
    bins.push(props.xMin + i * step);
  }
  
  return bins;
});

// Create frequency bins for histogram
function createFrequencyBins() {
  const bins = computedBins.value;
  const counts = Array(bins.length - 1).fill(0);
  
  props.data.forEach(item => {
    const freq = parseFloat(item[props.frequencyKey]) || 0;
    
    for (let i = 0; i < bins.length - 1; i++) {
      if (freq >= bins[i] && freq < bins[i + 1]) {
        counts[i]++;
        break;
      }
    }
  });
  
  return bins.slice(0, -1).map((bin, index) => {
    return { key: bin.toFixed(2), value: counts[index] };
  });
}

function renderChart() {
  if (!props.data || !props.data.length || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';
  
  const frequencyData = createFrequencyBins();
  
  const chart = Plot.plot({
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

  chartContainer.value.appendChild(chart);
}

onMounted(() => {
  renderChart();
});

watch(() => props.data, renderChart, { deep: true });
watch(() => props.barColor, renderChart);
watch(() => props.xMin, renderChart);
watch(() => props.xMax, renderChart);
watch(() => props.binCount, renderChart);
watch(() => props.bins, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>