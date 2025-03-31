<template>
  <div>
    <h2>Monthly Cases by Disease Type</h2>
    <AreaChart
        :data="testData"
        :stacked="true"
        curve="curveBasis"
        yLabel="Cases"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AreaChart from '../../../src/components/AreaChart.vue';

const testData = ref([
  { date: new Date('2023-01-01'), category: 'A', value: 100 },
  { date: new Date('2023-01-01'), category: 'B', value: 180 },
  { date: new Date('2023-01-01'), category: 'C', value: 80 },
  { date: new Date('2023-01-01'), category: 'D', value: 120 },
  { date: new Date('2023-01-01'), category: 'E', value: 90 },
  { date: new Date('2023-01-01'), category: 'F', value: 150 },

  { date: new Date('2023-01-02'), category: 'A', value: 110 },
  { date: new Date('2023-01-02'), category: 'B', value: 190 },
  { date: new Date('2023-01-02'), category: 'C', value: 85 },
  { date: new Date('2023-01-02'), category: 'D', value: 130 },
  { date: new Date('2023-01-02'), category: 'E', value: 95 },
  { date: new Date('2023-01-02'), category: 'F', value: 155 },

  { date: new Date('2023-01-03'), category: 'A', value: 105 },
  { date: new Date('2023-01-03'), category: 'B', value: 185 },
  { date: new Date('2023-01-03'), category: 'C', value: 90 },
  { date: new Date('2023-01-03'), category: 'D', value: 125 },
  { date: new Date('2023-01-03'), category: 'E', value: 100 },
  { date: new Date('2023-01-03'), category: 'F', value: 160 },

  { date: new Date('2023-01-04'), category: 'A', value: 115 },
  { date: new Date('2023-01-04'), category: 'B', value: 175 },
  { date: new Date('2023-01-04'), category: 'C', value: 95 },
  { date: new Date('2023-01-04'), category: 'D', value: 140 },
  { date: new Date('2023-01-04'), category: 'E', value: 105 },
  { date: new Date('2023-01-04'), category: 'F', value: 145 },

  { date: new Date('2023-01-05'), category: 'A', value: 120 },
  { date: new Date('2023-01-05'), category: 'B', value: 170 },
  { date: new Date('2023-01-05'), category: 'C', value: 100 },
  { date: new Date('2023-01-05'), category: 'D', value: 135 },
  { date: new Date('2023-01-05'), category: 'E', value: 110 },
  { date: new Date('2023-01-05'), category: 'F', value: 140 },

  { date: new Date('2023-01-06'), category: 'A', value: 125 },
  { date: new Date('2023-01-06'), category: 'B', value: 175 },
  { date: new Date('2023-01-06'), category: 'C', value: 105 },
  { date: new Date('2023-01-06'), category: 'D', value: 145 },
  { date: new Date('2023-01-06'), category: 'E', value: 115 },
  { date: new Date('2023-01-06'), category: 'F', value: 150 },

  { date: new Date('2023-01-07'), category: 'A', value: 130 },
  { date: new Date('2023-01-07'), category: 'B', value: 180 },
  { date: new Date('2023-01-07'), category: 'C', value: 110 },
  { date: new Date('2023-01-07'), category: 'D', value: 150 },
  { date: new Date('2023-01-07'), category: 'E', value: 120 },
  { date: new Date('2023-01-07'), category: 'F', value: 155 },

  { date: new Date('2023-01-08'), category: 'A', value: 135 },
  { date: new Date('2023-01-08'), category: 'B', value: 185 },
  { date: new Date('2023-01-08'), category: 'C', value: 105 },
  { date: new Date('2023-01-08'), category: 'D', value: 155 },
  { date: new Date('2023-01-08'), category: 'E', value: 125 },
  { date: new Date('2023-01-08'), category: 'F', value: 160 },

  { date: new Date('2023-01-09'), category: 'A', value: 140 },
  { date: new Date('2023-01-09'), category: 'B', value: 190 },
  { date: new Date('2023-01-09'), category: 'C', value: 100 },
  { date: new Date('2023-01-09'), category: 'D', value: 145 },
  { date: new Date('2023-01-09'), category: 'E', value: 130 },
  { date: new Date('2023-01-09'), category: 'F', value: 165 },

  { date: new Date('2023-01-10'), category: 'A', value: 145 },
  { date: new Date('2023-01-10'), category: 'B', value: 195 },
  { date: new Date('2023-01-10'), category: 'C', value: 95 },
  { date: new Date('2023-01-10'), category: 'D', value: 140 },
  { date: new Date('2023-01-10'), category: 'E', value: 135 },
  { date: new Date('2023-01-10'), category: 'F', value: 170 }
]);
</script>