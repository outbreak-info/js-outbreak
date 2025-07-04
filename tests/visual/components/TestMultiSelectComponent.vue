<template>
  <div class="test-container">
    <h1>Multi Select Component Test</h1>
    
    <div class="test-section">
      <h2>Static Options</h2>
      <MultiSelectComponent 
        v-model="staticSelected" 
        :options="staticOptions"
        label="Select Categories"
        :showButton="true"
        buttonText="Apply Selection"
        @buttonClick="handleButtonClick"
      />
    </div>

    <div class="test-section">
      <h2>Async Function Options</h2>
      <MultiSelectComponent 
        v-model="asyncSelected" 
        :optionsFunction="loadAsyncOptions"
        label="Select Async Items"
        :showButton="true"
        @buttonClick="handleAsyncButtonClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MultiSelectComponent from '../../../src/components/MultiSelectComponent.vue'

const staticSelected = ref([])
const asyncSelected = ref([])

const staticOptions = [
  { label: "Category A", value: "cat_a" },
  { label: "Category B", value: "cat_b" },
  { label: "Category C", value: "cat_c" },
  { label: "Category D", value: "cat_d" },
]

const handleButtonClick = (selectedValues: any[]) => {
  console.log('Static button clicked with values:', selectedValues)
}

const handleAsyncButtonClick = (selectedValues: any[]) => {
  console.log('Async button clicked with values:', selectedValues)
}

const loadAsyncOptions = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: "Async Item 1", value: "async1" },
        { label: "Async Item 2", value: "async2" },
        { label: "Async Item 3", value: "async3" },
        { label: "Async Item 4", value: "async4" },
      ])
    }, 2000)
  })
}
</script>

