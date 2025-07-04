<template>
  <div class="test-container">
    <h1>Loading Spinner Test</h1>

    <h2>Default Loading</h2>
    <LoadingSpinner />

    <h2>Custom  Description</h2>
    <LoadingSpinner description="Loading data..." />
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '../../../src/components/LoadingSpinner.vue'
</script>

