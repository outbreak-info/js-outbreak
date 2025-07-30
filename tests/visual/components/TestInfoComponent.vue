<template>
  <div class="test-container">
    <h2>InfoComponent Test</h2>

    <div class="test-section">
      <h3>Basic Card</h3>
      <InfoComponent>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </InfoComponent>
      <InfoComponent size="small">
        <h4>Small card</h4>
      </InfoComponent>
      <InfoComponent size="huge">
        <h4>Huge card</h4>
      </InfoComponent>
    </div>

    <div class="test-section">
      <h3>Variations</h3>
      <div class="grid-layout">
        <InfoComponent :hoverable="true">
          <h5>Hoverable Card</h5>
          <p>Hover</p>
        </InfoComponent>
        
        <InfoComponent :embedded="true">
          <h5>Embedded Card</h5>
          <p>Embedded card</p>
        </InfoComponent>
        
        <InfoComponent :bordered="false">
          <h5>No Border Card</h5>
          <p>No border.</p>
        </InfoComponent>
      </div>
    </div>

    <div class="test-section">
      <h3>Closable Cards</h3>
      <div class="grid-layout">
        <InfoComponent v-if="showCard" :closable="true" @close="handleClose">
          <h5>Closable Card 1</h5>
          <p>Card can be closed. Will trigger event when closed. Check console log</p>
        </InfoComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InfoComponent from '../../../src/components/InfoComponent.vue'

const showCard = ref(true)

const handleClose = () => {
  showCard.value = false
  console.log('Card closed')
}
</script>

<style scoped>

</style>