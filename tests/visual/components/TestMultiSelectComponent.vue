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

    <div class="test-section">
      <h2>Single Select Mode</h2>
      <MultiSelectComponent 
        v-model="singleSelected" 
        :options="staticOptions"
        label="Select Single Item"
        :multiple="false"
        :showButton="true"
        buttonText="Apply Single Selection"
        @buttonClick="handleSingleButtonClick"
        @update:modelValue="handleSingleUpdate"
      />
    </div>

    <div class="test-section">
      <h2>Single Select Mode without button</h2>
      <MultiSelectComponent
          v-model="singleSelectedNoButton"
          :options="staticOptions"
          label="Select Single Item"
          :multiple="false"
          :showButton="false"
          @update:modelValue="handleSingleUpdate"
      />
    </div>

    <div class="test-section">
      <h2>Single Object Select Mode without button</h2>
      <MultiSelectComponent
          v-model="staticSelectedObject"
          :options="staticOptionsObjects"
          label="Select Single Item"
          :multiple="false"
          :showButton="false"
          @update:modelValue="handleSingleUpdate"
      />

      {{ JSON.stringify(staticSelectedObject) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MultiSelectComponent from '../../../src/components/MultiSelectComponent.vue'

const staticSelected = ref([])
const asyncSelected = ref([])
const singleSelected = ref('')
const singleSelectedNoButton = ref('')
const staticSelectedObject = ref(null)
// { label: "Category A", value: {"attr1": "a", "attr2": "1"} }
const staticSelectedObjects = ref([
  {"attr1": "a", "attr2": "1"},
  {"attr1": "b", "attr2": "2"}
])

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

const handleSingleButtonClick = (selectedValue: any) => {
  console.log('Single button clicked with value:', selectedValue)
}

const handleSingleUpdate = (selectedValue: any) => {
  console.log('Single update with value:', selectedValue)
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

const staticOptionsObjects = [
  { label: "Category A", value: {"attr1": "a", "attr2": "1"} },
  { label: "Category B", value: {"attr1": "b", "attr2": "2"} },
  { label: "Category C", value: {"attr1": "c", "attr2": "3"} },
  { label: "Category D", value: {"attr1": "d", "attr2": "4"} },
]

</script>

