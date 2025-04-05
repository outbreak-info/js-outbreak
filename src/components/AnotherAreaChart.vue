<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup >
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { colorPalette } from '../utils/colorSchemes';
import { generateFormattedData } from '../utils/arrayFunctions';
import { selectColorPalette } from '../utils/wastewaterColorPalettes';
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
const formattedArray = ref([])
const uniqueNames = ref([])
const colors = ref([]);

const renderChart = () => {
  if (!formattedArray.value || formattedArray.value.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  // Create marks array
  const marks = [];

  marks.push(
      Plot.areaY(formattedArray.value, {
        x: "week_end_date",
        y: "mean_lineage_prevalence",
        z: "name", 
        fill: "name",
        fillOpacity: 1,
        curve: 'monotone-x'
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
      domain: uniqueNames.value,
      range: colors.value,
      legend: props.showLegend
    },
    marks
  };

  const chart = Plot.plot(plotConfig);

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);

onMounted(() => {
  const result = generateFormattedData(props.data);
  formattedArray.value = result.formattedArray;
  uniqueNames.value = result.uniqueNames;
  colors.value = selectColorPalette(uniqueNames.value);
})

watch(() => formattedArray.value, renderChart, { deep: true });
watch(() => colors.value, renderChart, { deep: true });

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
