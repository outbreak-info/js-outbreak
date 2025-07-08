<template>
  <div>
    <h1>Text Input Component Test</h1>
    
    <TextInput 
      placeholder="Enter your message..."
      buttonText="Submit"
      @submit="handleSubmit"
    />
    <p v-if="submittedValue">{{ submittedValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '../../../src/components/TextInput.vue'

const submittedValue = ref('')

const handleSubmit = (value: string) => {
  console.log('Submitted value:', value)
  submittedValue.value = `You entered: ${value}`
}
</script>