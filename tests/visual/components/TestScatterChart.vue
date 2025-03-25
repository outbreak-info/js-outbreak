<!-- tests/visual/components/TestScatterChart.vue -->
<template>
  <div class="test-container">
    <h1>ScatterChart Component Test</h1>
    <div>
      <h2>Basic Scatter Plot</h2>
      <ScatterChart
        :data="chartData"
        :width="width"
        :height="height"
        :pointColor="currentColor"
        xKey="key"
        yKey="value"
        titleKey="key"
        xLabel="Category"
        yLabel="Value"
      />
    </div>
    
    <div>
      <h2>Scatter Plot with Log Scale</h2>
      <ScatterChart
        :data="chartData"
        :width="width"
        :height="height"
        :pointColor="'indianred'"
        xKey="key"
        yKey="value"
        titleKey="key"
        xLabel="Category"
        yLabel="Value (log scale)"
        :logScale="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScatterChart from '../../../src/components/ScatterChart.vue'

const width = ref(800)
const height = ref(400)
const currentColor = ref('#333333')

const chartData = ref([
  {"key": "A", "value": 15},
  {"key": "B", "value": 7},
  {"key": "C", "value": 12},
  {"key": "D", "value": 9},
  {"key": "E", "value": 18},
  {"key": "F", "value": 3},
  {"key": "G", "value": 14},
  {"key": "H", "value": 5},
  {"key": "I", "value": 11},
  {"key": "J", "value": 2},
  {"key": "K", "value": 17},
  {"key": "L", "value": 8},
  {"key": "M", "value": 19},
  {"key": "N", "value": 6},
  {"key": "O", "value": 13},
  {"key": "P", "value": 1},
  {"key": "Q", "value": 16},
  {"key": "R", "value": 4},
  {"key": "S", "value": 10},
  {"key": "T", "value": 20}
])

</script>

<style scoped>
.test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

button {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>