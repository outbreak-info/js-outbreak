<template>
  <div ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import * as Plot from "@observablehq/plot";
import { colorPalette } from "../utils/colorSchemes";

const props = defineProps({
  data: { type: Array, required: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 80 },
  marginRight: { type: Number, default: 80 },
  marginTop: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  maleColor: { type: String, default: colorPalette[0] },
  femaleColor: { type: String, default: colorPalette[6] },
  xLabel: { type: String, default: "Population" },
  yLabel: { type: String, default: "Age Group" },
});

const chartContainer = ref(null);

const renderChart = () => {
  if (!chartContainer.value || !props.data || props.data.length === 0) return;

  // Clear existing chart
  chartContainer.value.innerHTML = "";

  // Transform data: males negative (left), females positive (right)
  const maleData = props.data.map((d) => ({
    ageGroup: d.ageGroup,
    population: -d.male,
    gender: "Male",
  }));

  const femaleData = props.data.map((d) => ({
    ageGroup: d.ageGroup,
    population: d.female,
    gender: "Female",
  }));

  const transformedData = [...maleData, ...femaleData];

  // Calculate max absolute value for symmetric axis
  const maxValue = Math.max(
    ...props.data.map((d) => Math.max(Math.abs(d.male), Math.abs(d.female)))
  );

  // Create the plot
  const plot = Plot.plot({
    height: props.height,
    width: props.width,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    x: {
      domain: [-maxValue, maxValue],
      label: props.xLabel,
      tickFormat: (d) => Math.abs(d).toLocaleString(),
    },
    y: {
      domain: props.data.map((d) => d.ageGroup),
      label: props.yLabel,
    },
    color: {
      domain: ["Male", "Female"],
      range: [props.maleColor, props.femaleColor],
      legend: true,
    },
    marks: [
      Plot.barX(transformedData, {
        x: "population",
        y: "ageGroup",
        fill: "gender",
        tip: {
          format: {
            x: (d) => Math.abs(d).toLocaleString(),
          },
        },
      }),
      Plot.ruleX([0]),
    ],
  });

  chartContainer.value.appendChild(plot);
};

onMounted(renderChart);

watch(() => props.data, renderChart, { deep: true });
watch(() => props.maleColor, renderChart);
watch(() => props.femaleColor, renderChart);

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = "";
  }
});
</script>
