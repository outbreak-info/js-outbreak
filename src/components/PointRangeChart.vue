<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette } from '../utils/colorSchemes';
import { defaultFontSize, defaultFontFamily } from '../utils/chartDefaults';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  xAttribute: { type: String, default: 'key' },
  medianAttribute: { type: String, default: 'median' },
  q1Attribute: { type: String, default: 'q1' },
  q3Attribute: { type: String, default: 'q3' },
  minAttribute: { type: String, default: null },
  maxAttribute: { type: String, default: null },
  strokeColor: { type: String, default: colorPalette[6] },
  fillColor: { type: String, default: colorPalette[7] },
  strokeWidth: { type: Number, default: 2 },
  whiskerStrokeWidth: { type: Number, default: 1 },
  radius: { type: Number, default: 5 },
  height: { type: Number, default: 500 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: 'Key' },
  yLabel: { type: String, default: 'Count' },
  yMin: { type: Number, default: null },
  yMax: { type: Number, default: null },
  fontSize: { type: Number, default: defaultFontSize },
  fontFamily: { type: String, default: defaultFontFamily }
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
    style: {
      fontSize: `${props.fontSize}px`,
      fontFamily: props.fontFamily,
      background: "transparent",
    },
    x: {
      label: props.xLabel,
      tickRotate: 45
    },
    y: {
      label: props.yLabel,
      ...(props.yMin !== null && props.yMax !== null ? { domain: [props.yMin, props.yMax] } : {}),
      grid: true
    },
    marks: [
      Plot.gridY(),
      // Whisker line (min to max) - rendered first so it's behind the Q1-Q3 line
      ...(props.minAttribute && props.maxAttribute ? [Plot.link(props.data.filter(d => d[props.minAttribute] != null && d[props.maxAttribute] != null), {
        x1: props.xAttribute,
        y1: props.minAttribute,
        y2: props.maxAttribute,
        stroke: props.strokeColor,
        strokeWidth: props.whiskerStrokeWidth,
        sort: {x: "-y"}
      })] : []),
      // Q1-Q3 range line (thicker, overlays whisker)
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
        title: d => {
          let tip = `Median: ${d[props.medianAttribute]}\nQ1: ${d[props.q1Attribute]}\nQ3: ${d[props.q3Attribute]}`;
          if (props.minAttribute && d[props.minAttribute] != null) tip += `\nMin: ${d[props.minAttribute]}`;
          if (props.maxAttribute && d[props.maxAttribute] != null) tip += `\nMax: ${d[props.maxAttribute]}`;
          return tip;
        },
      }))
    ]
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.yMin, renderChart);
watch(() => props.yMax, renderChart);
watch(() => props.fontSize, renderChart);
watch(() => props.fontFamily, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>