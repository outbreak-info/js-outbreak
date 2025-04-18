<template>
  <div class="test-container">
    <h1>Monthly Bar Chart Component Test</h1>
    <MonthlyBarChart
      :data="chartData"
      :showCumulativeLine="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MonthlyBarChart from '../../../src/components/MonthlyBarChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

const chartData = ref([
  { key: '2024-04-01', value: 300 },
  { key: '2024-05-01', value: 250 },
  { key: '2024-06-01', value: 320 },
  { key: '2024-07-01', value: 280 },
  { key: '2024-08-01', value: 200 },
  { key: '2024-09-01', value: 180 },
  { key: '2024-10-01', value: 150 },
  { key: '2024-11-01', value: 350 },
  { key: '2024-12-01', value: 1200 },
  { key: '2025-01-01', value: 500 },
  { key: '2025-02-01', value: 100 }
]);
</script> 