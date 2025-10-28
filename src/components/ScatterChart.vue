<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';

const props = defineProps({
  data: { type: Array, required: true },
  xKey: { type: String, default: 'x' },
  yKey: { type: String, default: 'y' },
  pointColor: { type: String, default: defaultColor},
  colorKey: { type: String, default: null },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  xLabel: { type: String, default: 'valueX' },
  yLabel: { type: String, default: 'valueY' },
  xGrid: { type: Boolean, default: true },
  yGrid: { type: Boolean, default: true },
  logScale: { type: Boolean, default: false },
  tipFormatString: { type: String, default: '' },
  titleKey: { type: String, default: 'key' },
  additionalAnnotationKeys: { type: Array, default: () => [] },
  showMinMaxXLabels: { type: Boolean, default: false },
  minXLabel: { type: String, default: 'Decreasing' },
  maxXLabel: { type: String, default: 'Increasing' },
  xDomain: { type: Array, default: undefined },
  yDomain: { type: Array, default: undefined }
});

const chartContainer = ref(null);

function getTipFormat(d) {
  if (props.tipFormatString) {
    let tipFormat = props.tipFormatString
      .replace('{x}', d[props.xKey])
      .replace('{y}', d[props.yKey])
      .replace('{key}', d[props.titleKey]);
    
    // Handle multiple additional annotations
    props.additionalAnnotationKeys.forEach((key, index) => {
      tipFormat = tipFormat.replace(`{additional${index}}`, d[key]);
    });
    
    return tipFormat;
  }
  return `${props.xKey}: ${d[props.xKey]}\n${props.yKey}: ${d[props.yKey]}`;
}

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';
  
  const xConfig = {
    label: props.showMinMaxXLabels ? null : props.xLabel,
    grid: props.xGrid
  };
  
  if (props.xDomain && !props.xDomain.some(val => val === null)) {
    xConfig.domain = props.xDomain;
  }
  
  const yConfig = {
    label: props.yLabel,
    grid: props.yGrid
  };
  
  if (props.yDomain && !props.yDomain.some(val => val === null)) {
    yConfig.domain = props.yDomain;
  }
  
  if (props.logScale) {
    yConfig.type = 'log';
  }

  const marks = [
    Plot.ruleY([(props.logScale) ? 1 : 0]),
    Plot.ruleX([0]),
    Plot.dot(props.data, { 
      x: props.xKey,
      y: props.yKey,
      fill: props.colorKey ? props.colorKey : props.pointColor
    }),
    Plot.tip(props.data, Plot.pointer({
      x: props.xKey,
      y: props.yKey,
      title: getTipFormat
    }))
  ];
  
  if (props.showMinMaxXLabels) {
    marks.push(
      Plot.axisX({
        anchor: "bottom",
        labelAnchor: "left",
        labelArrow: "left",
        label: props.minXLabel
      }),
      Plot.axisX({
        anchor: "bottom",
        labelAnchor: "right",
        labelArrow: "right",
        label: props.maxXLabel
      })
    );
  }
  
  const chart = Plot.plot({
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    height: props.height,
    width: props.width,
    x: xConfig,
    y: yConfig,
    marks: marks
  });
  
  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(() => props.logScale, renderChart);
watch(() => props.xKey, renderChart);
watch(() => props.yKey, renderChart);
watch(() => props.showMinMaxXLabels, renderChart);
watch(() => props.minXLabel, renderChart);
watch(() => props.maxXLabel, renderChart);
watch(() => props.xDomain, renderChart, { deep: true });
watch(() => props.yDomain, renderChart, { deep: true });
watch(() => props.additionalAnnotationsKeys, renderChart, { deep: true });

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>