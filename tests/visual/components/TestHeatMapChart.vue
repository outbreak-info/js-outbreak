<template>
  <div class="test-container">
    <h1>Heatmap Component Test</h1>
    <HeatMapChart :data="chartData" :width="width" :height="height" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeatMapChart from '../../../src/components/HeatMapChart.vue'

const width = ref(250)
const height = ref(200)

const chartData = ref([
  {"x": 1, "y": "A", "val": 10},
  {"x": 2, "y": "A", "val": 20},
  {"x": 3, "y": "A", "val": 30},
  {"x": 4, "y": "A", "val": 30},
  {"x": 1, "y": "B", "val": 10},
  {"x": 2, "y": "B", "val": 20},
  {"x": 3, "y": "B", "val": 5},
  {"x": 4, "y": "B", "val": 30},
  {"x": 1, "y": "C", "val": 5},
  {"x": 2, "y": "C", "val": 2},
  {"x": 3, "y": "C", "val": 5},
  {"x": 4, "y": "C", "val": 6},
  {"x": 3, "y": "D", "val": 30},
  {"x": 4, "y": "D", "val": 20},
])

</script>