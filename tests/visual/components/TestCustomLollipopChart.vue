<template>
  <div class="test-container">
    <h1>Custom Lollipop Component Test</h1>
    <CustomLollipopChart
      :data="chartData"
      valueKey="val"
      xAxisLabel="date"
      yAxisLabel="samples"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomLollipopChart from "../../../src/components/CustomLollipopChart.vue";

const chartData = ref([
  { key: "2025-01-25", val: 5 },
  { key: "2025-02-15", val: 12 },
  { key: "2025-02-22", val: 47 },
  { key: "2025-03-01", val: 56 },
  { key: "2025-03-08", val: 53 },
  { key: "2025-03-15", val: 56 },
  { key: "2025-03-22", val: 48 },
  { key: "2025-03-29", val: 40 },
  { key: "2025-04-05", val: 38 },
  { key: "2025-04-12", val: 39 },
  { key: "2025-04-19", val: 37 },
  { key: "2025-04-26", val: 39 },
  { key: "2025-05-03", val: 39 },
  { key: "2025-05-10", val: 50 },
  { key: "2025-05-17", val: 52 },
  { key: "2025-05-24", val: 10 },
]);
</script>
