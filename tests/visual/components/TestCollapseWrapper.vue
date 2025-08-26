<template>
  <div class="test-container">
    <h2>CollapseWrapper Component Test</h2>
    
    <div class="test-section">
      <CollapseWrapper :items="basicItems" v-model="expandedItems">
        <template #overview>
          <div>
            <p>This is overview</p>
          </div>
        </template>
        
        <template #details>
          <div>
            <b>Here are some detailed information with bold HTML.</b>
          </div>
        </template>

        <template #filters>
          <div>
            <ul>
              <li>Filter 1</li>
              <li>Filter 2</li>
            </ul>
          </div>
        </template>
      </CollapseWrapper>
      <p>Expanded Items: {{ expandedItems }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CollapseWrapper from '../../../src/components/CollapseWrapper.vue'

// Reactive state
const expandedItems = ref(['0'])

// Collapse items
const basicItems = [
  { title: 'Overview', key: 'overview' },
  { title: 'Details', key: 'details' },
  { title: 'Filters', key: 'filters' }
]
</script>

<style scoped>

</style>