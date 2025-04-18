<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: 'key' },
  valueKey: { type: String, default: 'value' },
  barColor: { type: String, default: defaultColor },
  lineColor: { type: String, default: colorPalette[1] },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: 'Month' },
  yLabel: { type: String, default: 'Count' },
  showCumulativeLine: { type: Boolean, default: true }
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

  // Calculate cumulative values
  let cumulative = 0;
  const cumulativeData = processedData.map(d => {
    cumulative += d[props.valueKey];
    return {
      ...d,
      cumulative
    };
  });

  const marks = [
    Plot.rectY(processedData, Plot.binX({ y: "sum" }, { x: props.dateKey, y: props.valueKey, thresholds: Plot.utcMonth, fill: props.barColor })),
    Plot.ruleY([0])
  ];

  if (props.showCumulativeLine) {
    marks.push(
      Plot.line(cumulativeData, { x: props.dateKey, y: "cumulative", stroke: props.lineColor, strokeWidth: 1.5, marker: "dot" }),
      Plot.tip(cumulativeData, Plot.pointer({ x: props.dateKey, y: "cumulative", title: d => `Month: ${d[props.dateKey].toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}\nCumulative: ${d.cumulative}` }))
    );
  }

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    x: {
      label: props.xLabel,
      type: "time",
      tickFormat: "%b '%y"
    },
    y: {
      label: props.yLabel,
      grid: true
    },
    marks
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