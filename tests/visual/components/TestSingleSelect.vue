<script setup>
import { ref } from "vue";
import SingleSelect from "../../../src/components/SingleSelect.vue";

const options = [
  { label: "Category A", value: "Category A" },
  { label: "Category B", value: "Category B" },
  { label: "Category C", value: "Category C" },
  { label: "Category D", value: "Category D" },
];

const selectedCategory = ref("Category A");
</script>

<template>
  <div class="test-container">
    <h1>Single Select Component Test</h1>
    <SingleSelect
      label="Category"
      v-model="selectedCategory"
      :options="options"
      :width="150"
    />
    <p>Selected: {{ selectedCategory }}</p>
  </div>
</template>
