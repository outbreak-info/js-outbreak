<template>
  <div class="test-container">
    <h2>TabsWrapper Component Test</h2>
    
    <div class="test-section">
      <h3>Basic tabs</h3>
      <TabsWrapper :tabs="basicTabs" v-model="activeTab">
        <template #overview>
          <div>
            <h4>Overview tab</h4>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
              <li>HTML renders correctly</li>
            </ul>
            <InfoComponent
                :hoverable="true"
                size="medium"
            >
              <h5>Testing Custom Vue Component</h5>
              <p>This is the InfoComponent</p>
            </InfoComponent>
          </div>
        </template>
        
        <template #details>
          <div>
            <h4>Details Tab</h4>
            <p>Here are some details.</p>
          </div>
        </template>
        
        <template #settings>
          <div>
            <h4>Settings Tab</h4>
            <p>Testing basic CSS <span style="color:rebeccapurple">styling</span>.</p>
          </div>
        </template>
      </TabsWrapper>
      <p>Active Tab: {{ activeTab }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabsWrapper from '../../../src/components/TabsWrapper.vue'
import InfoComponent from '../../../src/components/InfoComponent.vue'

// Reactive state
const activeTab = ref('0')

// Tab names
const basicTabs = [
  { name: 'Overview', key: 'overview' },
  { name: 'Details', key: 'details' },
  { name: 'Settings', key: 'settings' }
]
</script>

<style scoped>

</style>