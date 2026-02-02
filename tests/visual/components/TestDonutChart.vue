<script setup>
import { computed } from "vue";
import DonutChart from "../../../src/components/DonutChart.vue";
import {colorPalette} from "../../../src/utils/colorSchemes.js";

const genderData = [
  { label: "Male", value: 487 },
  { label: "Female", value: 513 },
];

const totalCount = computed(() =>
  genderData.reduce((sum, item) => sum + item.value, 0)
);
</script>

<template>
  <h2>DonutChart Component Test</h2>

  <DonutChart
    :data="genderData"
    label-key="label"
    value-key="value"
    :width="500"
    :height="500"
    :margin-left="50"
    :margin-right="50"
    :margin-top="50"
    :margin-bottom="50"
    :color-palette="[colorPalette[0], colorPalette[6]]"
    center-label="Total"
    :center-value="totalCount"
  />
</template>
