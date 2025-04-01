<template>
  <div class="test-box-plot">
    <h2>Box Plot Chart Test</h2>
    <BoxPlotChart 
      :data="testData"
      :height="400"
      :width="600"
      xLabel="Value"
      yLabel="Category"
    />
  </div>
</template>

<script setup lang="ts">
import BoxPlotChart from '../../../src/components/BoxPlotChart.vue'

const categories = ['Category A', 'Category B', 'Category C', 'Category D']
const valuesPerCategory = 30

const testData = categories.flatMap(category => 
  Array.from({ length: valuesPerCategory }, () => ({
    category,
    value: Math.random() * 100
  }))
)
</script>

<style scoped>
.test-box-plot {
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

h2 {
  margin-bottom: 20px;
}
</style> 