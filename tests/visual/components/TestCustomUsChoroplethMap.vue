<template>
  <div class="test-container">
    <h1>Custom US Choropleth Map Component Test</h1>
    <CustomUsChoroplethMap :data="chartData" valueKey="prevalence" />
  </div>
</template>

<script setup>
import CustomUsChoroplethMap from "../../../src/components/CustomUsChoroplethMap.vue";

const chartData = [
  { state: "Alabama", prevalence: 23.4 },
  { state: "Alaska", prevalence: 57.9 },
  { state: "Arizona", prevalence: 91.2 },
  { state: "Arkansas", prevalence: 34.7 },
  { state: "California", prevalence: 78.5 },
  { state: "Colorado", prevalence: 66.1 },
  { state: "Connecticut", prevalence: 12.8 },
  { state: "Delaware", prevalence: 45.0 },
  { state: "Florida", prevalence: 88.3 },
  { state: "Georgia", prevalence: 37.6 },
  { state: "Hawaii", prevalence: 81.9 },
  { state: "Idaho", prevalence: 40.2 },
  { state: "Illinois", prevalence: 29.5 },
  { state: "Indiana", prevalence: 50.7 },
  { state: "Iowa", prevalence: 62.1 },
  { state: "Kansas", prevalence: 71.4 },
  { state: "Kentucky", prevalence: 49.9 },
  { state: "Louisiana", prevalence: 36.8 },
  { state: "Maine", prevalence: 19.3 },
  { state: "Maryland", prevalence: 42.6 },
  { state: "Massachusetts", prevalence: 64.2 },
  { state: "Michigan", prevalence: 58.0 },
  { state: "Minnesota", prevalence: 70.5 },
  { state: "Mississippi", prevalence: 21.9 },
  { state: "Missouri", prevalence: 33.1 },
  { state: "Montana", prevalence: 47.8 },
  { state: "Nebraska", prevalence: 25.6 },
  { state: "Nevada", prevalence: 59.2 },
  { state: "New Hampshire", prevalence: 35.0 },
  { state: "New Jersey", prevalence: 76.3 },
  { state: "New Mexico", prevalence: 44.7 },
  { state: "New York", prevalence: 83.9 },
  { state: "North Carolina", prevalence: 39.8 },
  { state: "North Dakota", prevalence: 18.4 },
  { state: "Ohio", prevalence: 52.1 },
  { state: "Oklahoma", prevalence: 28.7 },
  { state: "Oregon", prevalence: 68.2 },
  { state: "Pennsylvania", prevalence: 73.5 },
  { state: "Rhode Island", prevalence: 13.0 },
  { state: "South Carolina", prevalence: 56.4 },
  { state: "South Dakota", prevalence: 24.5 },
  { state: "Tennessee", prevalence: 60.9 },
  { state: "Texas", prevalence: 53.6 },
  { state: "Utah", prevalence: 65.7 },
  { state: "Vermont", prevalence: 11.1 },
  { state: "Virginia", prevalence: 67.3 },
  { state: "Washington", prevalence: 86.0 },
  { state: "West Virginia", prevalence: 32.2 },
  { state: "Wisconsin", prevalence: 75.6 },
];
</script>
