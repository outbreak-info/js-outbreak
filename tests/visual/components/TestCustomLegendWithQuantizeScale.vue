<template>
  <div class="test-container">
    <h1>Custom Legend With Quantize Scale Component Test</h1>
    <CustomLegendWithQuantizeScale 
      :colorScale="colorScale"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleThreshold, scaleLinear, scaleBand } from "d3-scale";
import { format } from "d3-format";
import { min, max } from "d3-array";
import { timeFormat, timeParse } from "d3-time-format";
import {
  ylOrRdDiscrete11,
  diagonalHatchPatternDef,
} from "../../../src/utils/colorSchemes";
import CustomLegendWithQuantizeScale from "../../../src/components/CustomLegendWithQuantizeScale.vue";

const colorDomain = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const colorRange = ylOrRdDiscrete11;

const colorScale = scaleThreshold().domain(colorDomain).range(colorRange);
</script>