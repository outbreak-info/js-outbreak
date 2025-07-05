<template>
  <div class="test-container">
    <h1>DumbbellChart Component Test</h1>
    
    <h2>Lag</h2>
    <DumbbellChart
      :data="projectData"
      :width="800"
      :height="400"
      categoryKey="mutation"
      time1Key="startDate"
      time2Key="endDate"
      time1Label="Variants"
      time2Label="Mutations"
      xLabel="Time"
      yLabel="Mutations"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DumbbellChart from '../../../src/components/DumbbellChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

const projectData = ref([
  {
    mutation: "A",
    startDate: new Date('2023-01-15'),
    endDate: new Date('2023-03-20')
  },
  {
    mutation: "B",
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-05-15')
  },
  {
    mutation: "C",
    startDate: new Date('2023-01-10'),
    endDate: new Date('2023-02-28')
  },
  {
    mutation: "D",
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-04-10')
  },
  {
    mutation: "E",
    startDate: new Date('2023-02-15'),
    endDate: new Date('2023-04-30')
  }
])
</script>