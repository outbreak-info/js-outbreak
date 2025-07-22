<template>
  <div class="test-container">
    <h1>Custom US Choropleth Map Component Test</h1>
    <CustomUsChoroplethMap
      :data="chartData"
      valueKey="prevalence"
      :tooltip-fields="[
        {
          label: 'Prevalence',
          key: 'prevalence',
          formatter: '.2f',
          suffix: '%',
        },
        { label: 'Samples', key: 'num_samples', formatter: ',.0f' },
      ]"
    />
  </div>
</template>

<script setup>
import CustomUsChoroplethMap from "../../../src/components/CustomUsChoroplethMap.vue";

const chartData = [
  { state: "Alabama", prevalence: 23.4, num_samples: 24 },
  { state: "Alaska", prevalence: 57.9, num_samples: 1153 },
  { state: "Arizona", prevalence: 91.2, num_samples: 101 },
  { state: "Arkansas", prevalence: 34.7, num_samples: 171 },
  { state: "California", prevalence: 78.5, num_samples: 217 },
  { state: "Colorado", prevalence: 66.1, num_samples: 150 },
  { state: "Connecticut", prevalence: 12.8, num_samples: 2 },
  { state: "Delaware", prevalence: 45.0, num_samples: 4 },
  { state: "Florida", prevalence: 88.3, num_samples: 17 },
  { state: "Georgia", prevalence: 37.6, num_samples: 27 },
  { state: "Hawaii", prevalence: 81.9, num_samples: 11 },
  { state: "Idaho", prevalence: 40.2, num_samples: 34 },
  { state: "Illinois", prevalence: 29.5, num_samples: 137 },
  { state: "Indiana", prevalence: 50.7, num_samples: 101 },
  { state: "Iowa", prevalence: 62.1, num_samples: 10 },
  { state: "Kansas", prevalence: 71.4, num_samples: 174 },
  { state: "Kentucky", prevalence: 49.9, num_samples: 41 },
  { state: "Louisiana", prevalence: 36.8, num_samples: 19 },
  { state: "Maine", prevalence: 19.3, num_samples: 7 },
  { state: "Maryland", prevalence: 42.6, num_samples: 47 },
  { state: "Massachusetts", prevalence: 64.2, num_samples: 19 },
  { state: "Michigan", prevalence: 58.0, num_samples: 31 },
  { state: "Minnesota", prevalence: 70.5, num_samples: 33 },
  { state: "Mississippi", prevalence: 21.9, num_samples: 53 },
  { state: "Missouri", prevalence: 33.1, num_samples: 61 },
  { state: "Montana", prevalence: 47.8, num_samples: 30 },
  { state: "Nebraska", prevalence: 25.6, num_samples: 1 },
  { state: "Nevada", prevalence: 59.2, num_samples: 23 },
  { state: "New Hampshire", prevalence: 35.0, num_samples: 24 },
  { state: "New Jersey", prevalence: 76.3, num_samples: 39 },
  { state: "New Mexico", prevalence: 44.7, num_samples: 42 },
  { state: "New York", prevalence: 83.9, num_samples: 178 },
  { state: "North Carolina", prevalence: 39.8, num_samples: 81 },
  { state: "North Dakota", prevalence: 18.4, num_samples: 77 },
  { state: "Ohio", prevalence: 52.1, num_samples: 13 },
  { state: "Oklahoma", prevalence: 28.7, num_samples: 202 },
  { state: "Oregon", prevalence: 68.2, num_samples: 182 },
  { state: "Pennsylvania", prevalence: 73.5, num_samples: 100 },
  { state: "Rhode Island", prevalence: 13.0, num_samples: 7 },
  { state: "South Carolina", prevalence: 56.4, num_samples: 51 },
  { state: "South Dakota", prevalence: 24.5, num_samples: 19 },
  { state: "Tennessee", prevalence: 60.9, num_samples: 23 },
  { state: "Texas", prevalence: 53.6, num_samples: 56 },
  { state: "Utah", prevalence: 65.7, num_samples: 45 },
  { state: "Vermont", prevalence: 11.1, num_samples: 22 },
  { state: "Virginia", prevalence: 67.3, num_samples: 22 },
  { state: "Washington", prevalence: 86.0, num_samples: 13 },
  { state: "West Virginia", prevalence: 32.2, num_samples: 34 },
  { state: "Wisconsin", prevalence: 75.6, num_samples: 11 },
];
</script>
