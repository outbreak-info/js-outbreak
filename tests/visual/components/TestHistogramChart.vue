<template>
  <div class="test-container">
    <h1>HistogramChart Component Test</h1>
    
    <div class="chart-wrapper">
      <HistogramChart
        :data=testData
        :xMin="0"
        :xMax="1"
        :binCount="10"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HistogramChart from '../../../src/components/HistogramChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

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
</script>