<template>
  <h1>Select Bar Chart with Bar Graph Component Test</h1>
  Select Item: {{ selectedItem }}
  <br/>
  <SelectBarChartWithBarGraph
      :data="chartData"
      fieldName="test-field"
      :selectedItem="selectedItem"
      @item-selected="itemSelected"
      :nItems="8"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SelectBarChartWithBarGraph from '../../../src/components/SelectBarChartWithBarGraph.vue'

const itemSelected = (item) => {
  selectedItem.value = item;
};

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

const selectedItem = ref(chartData.value[0]);

</script>