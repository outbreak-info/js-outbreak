<script setup>
import { ref } from "vue";
import RadioButtonGroup from '../../../src/components/RadioButtonGroup.vue';

const lineageOptions = [
  { label: "WHO variant", value: "whovariant" },
  { label: "Phylogenetic", value: "phylogenetic" }
];

const selectedLineageGroupingApproach = ref("whovariant");
</script>

<template>
  <div>
    <h1>Radio Button Group Component Test</h1>
    <RadioButtonGroup
      v-model="selectedLineageGroupingApproach"
      label="Lineage grouping approach"
      :options="lineageOptions"   
    />
    <p>Selected: {{ selectedLineageGroupingApproach }}</p>
  </div>
</template>

