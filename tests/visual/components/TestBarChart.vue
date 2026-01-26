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

    Color by cat2 (no sort)
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

    Stacked bar chart (default order)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="false"
        :stacked="true"
        xKey="value"
        yKey="cat1"
        colorBy="cat2"
        xLabel="Value"
        yLabel="Category"
    />

    Stacked bar chart with legendDomain order (A1 bottom, B2 top)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="false"
        :stacked="true"
        xKey="value"
        yKey="cat1"
        colorBy="cat2"
        :legendDomain="['A1', 'B2']"
        xLabel="Value"
        yLabel="Category"
    />

    Stacked bar chart with reversed legendDomain order (B2 bottom, A1 top)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="false"
        :stacked="true"
        xKey="value"
        yKey="cat1"
        colorBy="cat2"
        :legendDomain="['B2', 'A1']"
        xLabel="Value"
        yLabel="Category"
    />

    Grouped by cat1, colored by cat2
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

    Custom legend with custom colors and labels
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="true"
        colorBy="cat2"
        :legendDomain="['A1', 'B2']"
        :legendRange="[colorPalette[5], colorPalette[6]]"
        xLabel="Value"
        yLabel="Key"
        sortOrder="desc"
    />

    Custom Category Order (bars desc, ticks custom order)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="true"
        sortOrder="desc"
        :categoryOrder="['D', 'A', 'M', 'T', 'B']"
        xLabel="Value"
        yLabel="Key"
    />

    Custom Category Order (vertical, custom tick order)
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="false"
        sortOrder="None"
        :categoryOrder="['T', 'M', 'K', 'E', 'A']"
        xLabel="Key"
        yLabel="Value"
    />

    With custom y-axis limits
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="false"
        sortOrder="None"
        :categoryOrder="['T', 'M', 'K', 'E', 'A']"
        xLabel="Key"
        yLabel="Value"
        :yMin="0"
        :yMax="100"
    />

    With custom x-axis limits
    <BarChart
        :data="chartData"
        :width="width"
        :height="height"
        :horizontal="true"
        sortOrder="None"
        :categoryOrder="['T', 'M', 'K', 'E', 'A']"
        xLabel="Key"
        yLabel="Value"
        :xMin="0"
        :xMax="100"
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
  {"key": "A", "value": 15, "cat1": "A", "cat2": "A1"},
  {"key": "B", "value": 7, "cat1": "A", "cat2": "B2"},
  {"key": "C", "value": 12, "cat1": "A", "cat2": "B2"},
  {"key": "D", "value": 9, "cat1": "A", "cat2": "B2"},
  {"key": "E", "value": 18, "cat1": "A", "cat2": "B2"},
  {"key": "F", "value": 3, "cat1": "B", "cat2": "B2"},
  {"key": "G", "value": 14, "cat1": "B", "cat2": "B2"},
  {"key": "H", "value": 5, "cat1": "B", "cat2": "B2"},
  {"key": "I", "value": 11, "cat1": "B", "cat2": "B2"},
  {"key": "J", "value": 2, "cat1": "B", "cat2": "B2"},
  {"key": "K", "value": 17, "cat1": "B", "cat2": "B2"},
  {"key": "L", "value": 8, "cat1": "B", "cat2": "A1"},
  {"key": "M", "value": 19, "cat1": "B", "cat2": "A1"},
  {"key": "N", "value": 6, "cat1": "C", "cat2": "A1"},
  {"key": "O", "value": 13, "cat1": "C", "cat2": "A1"},
  {"key": "P", "value": 1, "cat1": "C", "cat2": "A1"},
  {"key": "Q", "value": 16, "cat1": "C", "cat2": "A1"},
  {"key": "R", "value": 4, "cat1": "C", "cat2": "A1"},
  {"key": "S", "value": 10, "cat1": "D", "cat2": "A1"},
  {"key": "T", "value": 20, "cat1": "D", "cat2": "A1"}
])

const randomizeData = () => {
  chartData.value = chartData.value.map(item => ({
    key: item.key,
    value: Math.floor(Math.random() * 20) + 1
  }))
}

</script>