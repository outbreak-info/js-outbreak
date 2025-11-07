<template>
  <div class="test-container">
    <h1>Custom Categorical Legend Component Test</h1>
    <CustomCategoricalLegend 
      :categories="alphabet"
      :colorScale="colorScale"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { selectAccessibleColorPalette } from "../../../src/utils/colorSchemes";
import CustomCategoricalLegend from "../../../src/components/CustomCategoricalLegend.vue";

const alphabet = ['Alpha', 'Bravo', 'Charlie', 'Delta', 
                  'Echo', 'Foxtrot', 'Golf', 'Hotel'];

const colors = selectAccessibleColorPalette(alphabet);

const colorScale = scaleOrdinal(colors).domain(alphabet);
</script>