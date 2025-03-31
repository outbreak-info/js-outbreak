<template>
  <div class="test-container">
    <h1>HistogramChart Component Test</h1>
    
    <div class="chart-wrapper">
      <HistogramChart
        :data=testData
        :bins="[0,1,2,3,4,5,6,7,8,9]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HistogramChart from '../../../src/components/HistogramChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

const testData = ref([
  { id: 1, frequency: 5 },
  { id: 2, frequency: 5 },
  { id: 3, frequency: 4 },
  { id: 4, frequency: 6 },
  { id: 5, frequency: 5 },
  { id: 6, frequency: 4 },
  { id: 7, frequency: 3 }
]);

</script>