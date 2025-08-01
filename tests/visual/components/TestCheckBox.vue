<template>
  <div class="test-container">
    <h1>CheckBox Component Test</h1>
    
    <div>
      <h2>Basic CheckBox</h2>
      <CheckBox v-model="isChecked" text="Check me!" />
      <p>Value: {{ isChecked }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CheckBox from '../../../src/components/CheckBox.vue'

const isChecked = ref(false);
</script>

<style scoped>

</style>