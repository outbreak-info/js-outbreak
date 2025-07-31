<template>
  <div>
    <h1>Text Input Component Test</h1>
    
    <TextInput 
      placeholder="Enter your message..."
      buttonText="Submit"
      :modelValue="inputValue"
      @update:modelValue="inputValue = $event"
      @submit="handleSubmit"
    />
    <p v-if="submittedValue">{{ submittedValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '../../../src/components/TextInput.vue'

const submittedValue = ref('')
const inputValue = ref('Initial value')

const handleSubmit = (value: string) => {
  console.log(inputValue.value);
  submittedValue.value = `You entered: ${value}`
}
</script>