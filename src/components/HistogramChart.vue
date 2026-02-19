<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { defaultColor } from '../utils/colorSchemes';
import { defaultFontSize, defaultFontFamily } from '../utils/chartDefaults';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: [Array, Object], required: true },
  // Array mode props
  frequencyKey: { type: String, default: 'frequency' },
  xMin: { type: Number, default: 0 },
  xMax: { type: Number, default: 1 },
  binCount: { type: Number, default: 10 },
  bins: { type: Array, default: null },
  // Object mode props
  binWidth: { type: Number, default: 1 },
  // Shared props
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  marginTop: { type: Number, default: 20 },
  marginRight: { type: Number, default: 20 },
  barColor: { type: String, default: defaultColor },
  xLabel: { type: String, default: 'Frequency Range' },
  yLabel: { type: String, default: 'Number of Samples' },
  fontSize: { type: Number, default: defaultFontSize },
});

const chartContainer = ref(null);

// Compute bins dynamically if not provided (array mode only)
const computedBins = computed(() => {
  if (props.bins) return props.bins;

  const step = (props.xMax - props.xMin) / props.binCount;
  const bins = [];

  for (let i = 0; i <= props.binCount; i++) {
    bins.push(props.xMin + i * step);
  }

  return bins;
});

// Create frequency bins for array mode
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
  if (!props.data || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const isObjectMode = !Array.isArray(props.data);

  const sharedPlotOptions = {
    height: props.height,
    width: props.width,
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    y: { grid: true, label: props.yLabel },
    style: {
      fontSize: `${props.fontSize}px`,
      fontFamily: defaultFontFamily,
      background: 'transparent',
    },
  };

  let chart;
  if (isObjectMode) {
    const chartData = Object.entries(props.data)
      .map(([key, value]) => ({
        x1: Number(key),
        x2: Number(key) + props.binWidth,
        value: Number(value),
      }))
      .sort((a, b) => a.x1 - b.x1);

    if (!chartData.length) return;

    chart = Plot.plot({
      ...sharedPlotOptions,
      x: { label: props.xLabel },
      marks: [
        Plot.rectY(chartData, { x1: 'x1', x2: 'x2', y: 'value', fill: props.barColor }),
        Plot.ruleY([0]),
      ],
    });
  } else {
    if (!props.data.length) return;

    const frequencyData = createFrequencyBins();

    chart = Plot.plot({
      ...sharedPlotOptions,
      x: { tickRotate: 45, label: props.xLabel, type: 'band' },
      marks: [
        Plot.barY(frequencyData, { x: 'key', y: 'value', fill: props.barColor }),
        Plot.ruleY([0]),
      ],
    });
  }

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);

watch(() => props.data, renderChart, { deep: true });
watch(() => props.barColor, renderChart);
watch(() => props.binWidth, renderChart);
watch(() => props.fontSize, renderChart);
watch(() => props.height, renderChart);
watch(() => props.width, renderChart);
watch(() => props.marginTop, renderChart);
watch(() => props.marginRight, renderChart);
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
