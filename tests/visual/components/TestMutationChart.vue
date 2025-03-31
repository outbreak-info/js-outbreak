<template>
  <div class="test-container">
    <h1>Mutation Chart Component Test</h1>
    
    <div class="chart-wrapper">
      <MutationChart
        :data=mutationData
        :columns="columns"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MutationChart from '../../../src/components/MutationChart.vue'
import { colorPalette } from '../../../src/utils/colorSchemes'

// Define the columns for the mutation table
const columns = [
  { key: 'id', label: 'SRA', format: 'text' },
  { key: 'frequency', label: 'Frequency', format: 'decimal', class: 'numeric' }
];

// Sample mutation data
const mutationData = ref([
  { id: 'SRR28834957', mutation: 'HA:Q238R', frequency: 0.043478 },
  { id: 'SRR29455627', mutation: 'HA:Q238R', frequency: 0.020619 },
  { id: 'SRR31347721', mutation: 'HA:Q238R', frequency: 0.015748 },
  { id: 'SRR31596965', mutation: 'HA:Q238R', frequency: 0.015748 },
  { id: 'SRR28834903', mutation: 'HA:Q238R', frequency: 0.014925 },
  { id: 'SRR28834954', mutation: 'HA:Q238R', frequency: 0.014634 },
  { id: 'SRR31820865', mutation: 'HA:Q238R', frequency: 0.013513 }
]);

</script>

<style scoped>
.test-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  margin-bottom: 16px;
}

.search-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  background-color: #f28e2b; /* Matching colorPalette[3] - orange */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #e07d1a;
}

.chart-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-top: 1rem;
}
</style>