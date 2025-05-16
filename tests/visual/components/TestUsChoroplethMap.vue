<template>
  <div class="test-container">
    <h1>US Choropleth Map Component Test</h1>
      <UsChoroplethMap
        :data="chartData"
        valueLabel="Prevalence (%)" 
      />
  </div>
</template>

<script setup>
import UsChoroplethMap from '../../../src/components/UsChoroplethMap.vue';

const chartData = [
  { state: 'Alabama', value: 23.4 },
  { state: 'Alaska', value: 57.9 },
  { state: 'Arizona', value: 91.2 },
  { state: 'Arkansas', value: 34.7 },
  { state: 'California', value: 78.5 },
  { state: 'Colorado', value: 66.1 },
  { state: 'Connecticut', value: 12.8 },
  { state: 'Delaware', value: 45.0 },
  { state: 'Florida', value: 88.3 },
  { state: 'Georgia', value: 37.6 },
  { state: 'Hawaii', value: 81.9 },
  { state: 'Idaho', value: 40.2 },
  { state: 'Illinois', value: 29.5 },
  { state: 'Indiana', value: 50.7 },
  { state: 'Iowa', value: 62.1 },
  { state: 'Kansas', value: 71.4 },
  { state: 'Kentucky', value: 49.9 },
  { state: 'Louisiana', value: 36.8 },
  { state: 'Maine', value: 19.3 },
  { state: 'Maryland', value: 42.6 },
  { state: 'Massachusetts', value: 64.2 },
  { state: 'Michigan', value: 58.0 },
  { state: 'Minnesota', value: 70.5 },
  { state: 'Mississippi', value: 21.9 },
  { state: 'Missouri', value: 33.1 },
  { state: 'Montana', value: 47.8 },
  { state: 'Nebraska', value: 25.6 },
  { state: 'Nevada', value: 59.2 },
  { state: 'New Hampshire', value: 35.0 },
  { state: 'New Jersey', value: 76.3 },
  { state: 'New Mexico', value: 44.7 },
  { state: 'New York', value: 83.9 },
  { state: 'North Carolina', value: 39.8 },
  { state: 'North Dakota', value: 18.4 },
  { state: 'Ohio', value: 52.1 },
  { state: 'Oklahoma', value: 28.7 },
  { state: 'Oregon', value: 68.2 },
  { state: 'Pennsylvania', value: 73.5 },
  { state: 'Rhode Island', value: 13.0 },
  { state: 'South Carolina', value: 56.4 },
  { state: 'South Dakota', value: 24.5 },
  { state: 'Tennessee', value: 60.9 },
  { state: 'Texas', value: 53.6 },
  { state: 'Utah', value: 65.7 },
  { state: 'Vermont', value: 11.1 },
  { state: 'Virginia', value: 67.3 },
  { state: 'Washington', value: 86.0 },
  { state: 'West Virginia', value: 32.2 },
  { state: 'Wisconsin', value: 75.6 },
];
</script>
