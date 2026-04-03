<template>
  <div class="test-container">
    <h1>HistogramChart Component Test</h1>

    <h2>Raw data, binned internally</h2>
    <HistogramChart
      :data="testData"
      :xMin="0"
      :xMax="1"
      :binCount="10"
    />

    <h2>With integer ticks</h2>
    <HistogramChart
        :data="testData"
        :integerTicks="true"
    />

    <h2>Pre-computed counts</h2>
    <HistogramChart
      :data="objectData"
      xLabel="Value"
      yLabel="Count"
    />

    <h2>With integer ticks</h2>
    <HistogramChart
        :data="testData3"
        :integerTicks="true"
    />

    <HistogramChart
        :data="testData2"
        :integerTicks="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HistogramChart from '../../../src/components/HistogramChart.vue'

const testData = ref([
  { id: 1, frequency: 0.1 },
  { id: 2, frequency: 0.2 },
  { id: 3, frequency: 0.2 },
  { id: 4, frequency: 0.3 },
  { id: 5, frequency: 0.3 },
  { id: 6, frequency: 0.3 },
  { id: 7, frequency: 0.4 },
  { id: 8, frequency: 0.5 },
  { id: 9, frequency: 0.6 },
  { id: 10, frequency: 0.7 },
  { id: 11, frequency: 0.8 },
  { id: 12, frequency: 0.9 }
]);

const testData2 = ref({
    "0": 20,
    "1": 2,
    "2": 1,
    "4": 1,
    "8": 2,
    "9": 2,
    "10": 2,
    "15": 4,
    "23": 1,
    "24": 1,
    "32": 43,
    "38": 35,
    "53": 34
})

const testData3 = ref({
  "0": 25
});

const objectData = ref({ "4": 24, "2": 29, "1": 14, "0": 13, "3": 24, "5": 19, "7": 6, "6": 7, "11": 1, "8": 1, "9": 1 });
</script>
