<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 60 },
  marginRight: { type: Number, default: 40 },
  marginTop: { type: Number, default: 40 },
  marginBottom: { type: Number, default: 50 },
  colors: { type: Array, default: () => colorPalette },
  xLabel: { type: String, default: 'Date' },
  yLabel: { type: String, default: 'Value' },
  showLegend: { type: Boolean, default: true },
  dateFormat: { type: String, default: '%b %Y' }
});

const chartContainer = ref(null);

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  // Get unique categories for legend
  const categories = [...new Set(props.data.map(d => d.category))];

  // Create marks array
  const marks = [];

  marks.push(
      Plot.areaY(props.data, {
        x: "date",
        y: "value",
        z: "category", // Use z for stacking by category
        fill: "category",
        fillOpacity: 0.7,
        stroke: "category",
        strokeWidth: 1
      })
  );

  marks.push(Plot.ruleY([0]));

  const plotConfig = {
    height: props.height,
    width: props.width,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    x: {
      label: props.xLabel,
      grid: true
    },
    y: {
      label: props.yLabel,
      grid: true
    },
    color: {
      domain: categories,
      range: props.colors.slice(0, categories.length),
      legend: props.showLegend
    },
    marks
  };

  const chart = Plot.plot(plotConfig);

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.colors, renderChart, { deep: true });

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
}
</style>