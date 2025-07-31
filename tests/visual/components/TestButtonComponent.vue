<template>
  <div>
    <h1>Button Component Test</h1>
    
    <ButtonComponent 
      text="Click Me"
      :onClick="handleClick"
    />
    <p v-if="clickMessage">{{ clickMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../../../src/components/ButtonComponent.vue'

const clickMessage = ref('')

const handleClick = () => {
  console.log('Button clicked!')
  clickMessage.value = 'Button was clicked!'
}
</script>