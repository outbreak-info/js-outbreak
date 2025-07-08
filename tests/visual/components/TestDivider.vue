<template>
  <div>
    <h1>Divider Component Test</h1>
    
    <h2>Left Text</h2>
    <Divider text="Left Aligned" titlePlacement="left" />
    
    <h2>Right Text</h2>
    <Divider text="Right Aligned" titlePlacement="right" />
    
    <h2>Center Text</h2>
    <Divider text="Center Aligned" titlePlacement="center" />
    
    <h2>No Text</h2>
    <Divider />
  </div>
</template>

<script setup lang="ts">
import Divider from '../../../src/components/Divider.vue'
</script>