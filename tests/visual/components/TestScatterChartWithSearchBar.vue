<template>
  <div class="test-container">
    <h1>Scatter Plot with Search Bar Component Test</h1>
      <div>
      <h2>Scatter Plot with Search Bar</h2>
      <ScatterChartWithSearchBar
        :data="chartData"
        :xKey="'valueX'"
        :yKey="'valueY'"
        :searchKey="'key'"
        :pointColor="currentColor"
        :highlightColor=colorPalette[2]
        :height="height"
        :width="width"
        xLabel="valueX"
        yLabel="valueY"
        searchPlaceholder="Search points..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScatterChartWithSearchBar from '../../../src/components/ScatterChartWithSearchBar.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

const width = ref(800)
const height = ref(400)
const currentColor = colorPalette[0];

const chartData = ref([
  {"key": 'a',"valueX": 10, "valueY": 15},
  {"key": 'b',"valueX": 12, "valueY": 7},
  {"key": 'c',"valueX": 4, "valueY": 12},
  {"key": 'd',"valueX": 7, "valueY": 9},
  {"key": 'e',"valueX": 8, "valueY": 18},
  {"key": 'f',"valueX": 13, "valueY": 3},
  {"key": 'g',"valueX": 2, "valueY": 14},
  {"key": 'h',"valueX": 1, "valueY": 5},
  {"key": 'i',"valueX": 0, "valueY": 11},
  {"key": 'j',"valueX": 17, "valueY": 2},
  {"key": 'k',"valueX": 15, "valueY": 17},
  {"key": 'l',"valueX": 14.5, "valueY": 8},
  {"key": 'm',"valueX": 16.8, "valueY": 19},
  {"key": 'n',"valueX": 22, "valueY": 6},
  {"key": 'o',"valueX": 10.2, "valueY": 13},
  {"key": 'p',"valueX": 13, "valueY": 1},
  {"key": 'q',"valueX": 14.5, "valueY": 16},
  {"key": 'r',"valueX": 19, "valueY": 4},
  {"key": 's',"valueX": 7.5, "valueY": 10},
  {"key": 't',"valueX": 6, "valueY": 20}
])

</script>