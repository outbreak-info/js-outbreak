<template>
  <div class="test-container">
    <h1>DatePickerComponent Test</h1>

    <div>
      <h2>Basic DatePicker</h2>
      <DatePickerComponent v-model="selectedDate" @update:formattedModelValue="selectedFormattedDate = $event" />
      <p>Value: {{ selectedDate }}</p>
      <p>Formatted Value: {{ selectedFormattedDate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DatePickerComponent from "../../../src/components/DatePickerComponent.vue";

const selectedDate = ref(Date.now());
const selectedFormattedDate = ref(null);

</script>

<style scoped>

</style>