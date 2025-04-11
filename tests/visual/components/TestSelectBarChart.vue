<template>
  <div class="test-container">
    <h1>Select Bar Chart Component Test</h1>
    Horizontal
    <SelectBarChart
        :data="chartData"
        @bar-selected="barSelected"
    />
    <div v-if="selectedItem" class="selected-info">
      Selected: {{ selectedItem.key }} ({{ selectedItem.value }})
    </div>

    Vertical
    <SelectBarChart
        :data="chartData"
        :horizontal="false"
        fieldName="test-field"
        :selectedBarKey="selectedItemVertical"
        @bar-selected="barSelectedVertical"
    />
    <select v-model="selectedItemVertical" class="form-select">
      <option v-for="item in chartData" :key="item.key" :value="{ key: item.key, value: item.value }">
        {{ item.key }} ({{ item.value }})
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SelectBarChart from '../../../src/components/SelectBarChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

const width = ref(800)
const height = ref(400)
const currentColor = colorPalette[7];

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

const selectedItem = ref(null);
const selectedItemVertical = ref(chartData.value[3]);

const barSelected = (item) => {
  selectedItem.value = item;
};

const barSelectedVertical = (item) => {
  selectedItemVertical.value = item;
};

</script>