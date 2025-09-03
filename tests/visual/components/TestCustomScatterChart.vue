<template>
  <div class="test-container">
    <h1>Custom Scatter Chart Component Test</h1>
    <CustomScatterChart
      :data="chartData"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomScatterChart from "../../../src/components/CustomScatterChart.vue";

const chartData = ref([
  { xValue: 10, yValue: 15 },
  { xValue: 12, yValue: 7 },
  { xValue: 4, yValue: 12 },
  { xValue: 7, yValue: 9 },
  { xValue: 8, yValue: 18 },
  { xValue: 13, yValue: 3 },
  { xValue: 2, yValue: 14 },
  { xValue: 1, yValue: 5 },
  { xValue: 0, yValue: 11 },
  { xValue: 17, yValue: 2 },
  { xValue: 15, yValue: 17 },
  { xValue: 14.5, yValue: 8 },
  { xValue: 16.8, yValue: 19 },
  { xValue: 22, yValue: 6 },
  { xValue: 10.2, yValue: 13 },
  { xValue: 13, yValue: 1 },
  { xValue: 14.5, yValue: 16 },
  { xValue: 19, yValue: 4 },
  { xValue: 7.5, yValue: 10 },
  { xValue: 6, yValue: 20 }
]);
</script>
