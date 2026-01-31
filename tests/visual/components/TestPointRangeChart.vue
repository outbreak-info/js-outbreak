<template>
  <div class="test-container">
    <h1>Point Range Chart Test</h1>

    <h2>With q1 and q3</h2>
    <PointRangeChart
      :data="chartData"
    />

    <h2>With min and max</h2>
    <PointRangeChart
      :data="chartData2"
      minAttribute="min"
      maxAttribute="max"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PointRangeChart from "../../../src/components/PointRangeChart.vue";

const chartData = ref([
  { key: "A", median: 42, q1: 32, q3: 52 },
  { key: "B", median: 56, q1: 46, q3: 66 },
  { key: "C", median: 48, q1: 38, q3: 58 },
  { key: "D", median: 65, q1: 55, q3: 75 },
  { key: "E", median: 72, q1: 62, q3: 82 },
  { key: "F", median: 63, q1: 53, q3: 73 }
]);

const chartData2 = ref([
  { key: "A", median: 42, q1: 32, q3: 52, min: 27, max: 27 },
  { key: "B", median: 56, q1: 46, q3: 66, min: 41, max: 71 },
  { key: "C", median: 48, q1: 38, q3: 58, min: 32, max: 60 },
  { key: "D", median: 65, q1: 55, q3: 75, min: 40, max: 80 },
  { key: "E", median: 72, q1: 62, q3: 82, min: 50, max: 95 },
  { key: "F", median: 63, q1: 53, q3: 73, min: 50, max: 75 }
])

</script>