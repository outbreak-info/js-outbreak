<script setup>
import { ref } from "vue";
import SliderWithInput from '../../../src/components/SliderWithInput.vue';

const selectedRange = ref(120);
</script>

<template>
  <div>
     <h1>Slider With Input Component Test</h1>
    <SliderWithInput
      v-model="selectedRange"
      label="Number of days"
      :minRange="30"
      :maxRange="360"
      :step="30"
      :autoMarks="true"
      :debounceDelay="200"
    />
  </div>
</template>
