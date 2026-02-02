<template>
  <div>
    <h2>PopulationPyramidChart Component Test</h2>
    <PopulationPyramidChart :data="populationData" :width="800" :height="600" />
  </div>
</template>

<script setup lang="ts">
import PopulationPyramidChart from "../../../src/components/PopulationPyramidChart.vue";

const populationData = [
  { ageGroup: "0-4", male: 12000, female: 11500 },
  { ageGroup: "5-9", male: 13000, female: 12400 },
  { ageGroup: "10-14", male: 14500, female: 13800 },
  { ageGroup: "15-19", male: 15800, female: 15200 },
  { ageGroup: "20-24", male: 18500, female: 17800 },
  { ageGroup: "25-29", male: 22000, female: 21200 },
  { ageGroup: "30-34", male: 24500, female: 23800 },
  { ageGroup: "35-39", male: 25000, female: 24500 },
  { ageGroup: "40-44", male: 24000, female: 23600 },
  { ageGroup: "45-49", male: 22500, female: 22000 },
  { ageGroup: "50-54", male: 20000, female: 19800 },
  { ageGroup: "55-59", male: 18000, female: 18200 },
  { ageGroup: "60-64", male: 15500, female: 16000 },
  { ageGroup: "65-69", male: 13000, female: 13800 },
  { ageGroup: "70-74", male: 10000, female: 11000 },
  { ageGroup: "75-79", male: 7500, female: 8500 },
  { ageGroup: "80-84", male: 5000, female: 6000 },
  { ageGroup: "85+", male: 3000, female: 4500 },
];
</script>
