<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { heatmapColorScheme } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  domain: { type: Array, default: [] },
  cellWidth: { type: Number, default: 20 },
  cellHeight: { type: Number, default: 20 },
  marginLeft: { type: Number, default: 50 },
  marginRight: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  marginTop: { type: Number, default: 50 },
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

  const nCellsX = new Set(props.data.map(d => d[props.x])).size;
  const nCellsY = new Set(props.data.map(d => d[props.y])).size;

  const chartWidth = 30 + nCellsX * props.cellWidth + props.marginLeft + props.marginRight;
  const chartHeight = 30 + nCellsY * props.cellHeight + props.marginBottom + props.marginTop;

  // Legend properties
  const colorLegend = {type: "linear", scheme: heatmapColorScheme, legend: true, label: props.legendLabel}
  if (props.domain.length > 0) {
    colorLegend.domain = props.domain;
  }

  // Create chart
  const chart = Plot.plot({
    marginLeft: props.marginLeft,
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    width: chartWidth,
    height: chartHeight,
    padding: 0,
    grid: true,
    x: {label: props.xLabel},
    y: {label: props.yLabel},
    color: colorLegend,
    legend: true,
    marks: [
      Plot.axisX({anchor: "bottom", tickRotate: 45, textAnchor: "start"}),
      Plot.cell(props.data, {
        x: props.x,
        y: props.y,
        fill: props.val,
        inset: 0.5,
        rx: 4,
        ry: 4
      }),
      Plot.axisX({anchor: "top", tickRotate: 315, textAnchor: "start"}),
      Plot.tip(props.data, Plot.pointer({
        x: props.x,
        y: props.y,
        title: d => `${d[props.val].toFixed(
            props.tooltipDecimalPlaces
        )}`,
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