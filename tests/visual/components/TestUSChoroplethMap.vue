<template>
  <div class="test-container">
    <h1>US Choropleth Map Component Test</h1>
    <USChoroplethMap
      :stateData="percentages"
      :thresholds="thresholds"
      :colorSchem="colorScheme"
     />
  </div>
</template>
  
<script setup>
import USChoroplethMap from "../../../src/components/USChoroplethMap.vue"; 

const percentages = {
  California: 72.5,
  Texas: 38.1,
  Florida: 51.2,
};

const thresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const colorScheme = ['#fff0a9','#fee087','#fec965','#feab4b','#fd893c','#fa5c2e','#ec3023','#d31121','#af0225','#800026'];
</script>
