<template>
  <div class="test-container">
    <h1>BarChart Component Test</h1>
    Horizontal (default descending order)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        barColor="currentColor"
    />

    Vertical (ascending order)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        barColor="currentColor"
        :horizontal="false"
        sortOrder="asc"
        xLabel="key"
        yLabel="value"
    />

    Color by cat1 (no sort)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        barColor="cat2"
        :horizontal="false"
        xLabel="key"
        yLabel="value"
        sortOrder="None"
    />

    Grouped by cat2, colored by cat1
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="false"
        groupBy="cat1"
        colorBy="cat2"
        xLabel="Category 1"
        yLabel="Value"
        sortOrder="None"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BarChart from '../../../src/components/BarChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

const width = ref(800)
const height = ref(400)
const currentColor = colorPalette[7];

const chartData = ref([
  {"key": "A", "value": 15, "cat1": "A", "cat2": "1"},
  {"key": "B", "value": 7, "cat1": "A", "cat2": "2"},
  {"key": "C", "value": 12, "cat1": "A", "cat2": "2"},
  {"key": "D", "value": 9, "cat1": "A", "cat2": "2"},
  {"key": "E", "value": 18, "cat1": "A", "cat2": "2"},
  {"key": "F", "value": 3, "cat1": "B", "cat2": "2"},
  {"key": "G", "value": 14, "cat1": "B", "cat2": "2"},
  {"key": "H", "value": 5, "cat1": "B", "cat2": "2"},
  {"key": "I", "value": 11, "cat1": "B", "cat2": "2"},
  {"key": "J", "value": 2, "cat1": "B", "cat2": "2"},
  {"key": "K", "value": 17, "cat1": "B", "cat2": "2"},
  {"key": "L", "value": 8, "cat1": "B", "cat2": "1"},
  {"key": "M", "value": 19, "cat1": "B", "cat2": "1"},
  {"key": "N", "value": 6, "cat1": "C", "cat2": "1"},
  {"key": "O", "value": 13, "cat1": "C", "cat2": "1"},
  {"key": "P", "value": 1, "cat1": "C", "cat2": "1"},
  {"key": "Q", "value": 16, "cat1": "C", "cat2": "1"},
  {"key": "R", "value": 4, "cat1": "C", "cat2": "1"},
  {"key": "S", "value": 10, "cat1": "D", "cat2": "1"},
  {"key": "T", "value": 20, "cat1": "D", "cat2": "1"}
])

const randomizeData = () => {
  chartData.value = chartData.value.map(item => ({
    key: item.key,
    value: Math.floor(Math.random() * 20) + 1
  }))
}

</script>