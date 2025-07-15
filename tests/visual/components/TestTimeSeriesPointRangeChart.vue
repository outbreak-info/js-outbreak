<template>
  <div class="test-container">
    <h1>Time Series Point Range Chart Test</h1>
    
    <h2>Raw Time Series Data</h2>
    <TimeSeriesPointRangeChart
      :data="rawTimeSeriesData"
      xLabel="Date"
      yLabel="Value"
    />

    <h2>Pre-binned Monthly Data</h2>
    <TimeSeriesPointRangeChart
      :data="preBinnedData"
      medianAttribute="median_test"
      q1Attribute="q1_test"
      q3Attribute="q3_test"
      :isPreBinned="true"
      binInterval="month"
      xLabel="Month"
      yLabel="Value"
    />

    <h2>Pre-binned Monthly Data with Groups</h2>
    <TimeSeriesPointRangeChart
      :data="preBinnedGroupedData"
      :isPreBinned="true"
      binInterval="month"
      xLabel="Month"
      yLabel="Value"
    />

    <h2>With X-axis limits: Jan 2024 to Mar 2024</h2>
    <TimeSeriesPointRangeChart
      :data="rawTimeSeriesData"
      :xTickMin="'2024-01-01'"
      :xTickMax="'2024-03-31'"
      xLabel="Date"
      yLabel="Value"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimeSeriesPointRangeChart from '../../../src/components/TimeSeriesPointRangeChart.vue'

const rawTimeSeriesData = ref([
  { date: '2024-01-15', median: 12.5, q1: 10.2, q3: 15.8, min: 8.1, max: 18.9 },
  { date: '2024-02-15', median: 14.2, q1: 11.8, q3: 17.5, min: 9.3, max: 20.1 },
  { date: '2024-03-15', median: 18.7, q1: 15.4, q3: 22.1, min: 12.8, max: 25.3 },
  { date: '2024-04-15', median: 22.4, q1: 19.2, q3: 26.8, min: 16.5, max: 29.7 },
  { date: '2024-05-15', median: 26.8, q1: 23.1, q3: 30.4, min: 20.2, max: 33.6 },
  { date: '2024-06-15', median: 30.1, q1: 26.7, q3: 33.8, min: 23.4, max: 36.9 }
]);

// In addition to pre-binned data, testing custom median, q1 and q3 attributes
const preBinnedData = ref([
  { date: '2024-02', median_test: 158, q1_test: 138, q3_test: 178, min: 118, max: 198 },
  { date: '2024-03', median_test: 172, q1_test: 152, q3_test: 192, min: 132, max: 212 },
  { date: '2024-01', median_test: 145, q1_test: 125, q3_test: 165, min: 105, max: 185 },
  { date: '2024-04', median_test: 186, q1_test: 166, q3_test: 206, min: 146, max: 226 },
  { date: '2024-05', median_test: 199, q1_test: 179, q3_test: 219, min: 159, max: 239 },
  { date: '2024-06', median_test: 213, q1_test: 193, q3_test: 233, min: 173, max: 253 }
]);

const preBinnedGroupedData = ref([
  { date: '2024-01', median: 250, q1: 220, q3: 280, min: 190, max: 310, group: 'North' },
  { date: '2024-01', median: 230, q1: 200, q3: 260, min: 170, max: 290, group: 'South' },
  { date: '2024-01', median: 210, q1: 180, q3: 240, min: 150, max: 270, group: 'East' },
  { date: '2024-02', median: 270, q1: 240, q3: 300, min: 210, max: 330, group: 'North' },
  { date: '2024-02', median: 245, q1: 215, q3: 275, min: 185, max: 305, group: 'South' },
  { date: '2024-02', median: 225, q1: 195, q3: 255, min: 165, max: 285, group: 'East' },
  { date: '2024-03', median: 290, q1: 260, q3: 320, min: 230, max: 350, group: 'North' },
  { date: '2024-03', median: 265, q1: 235, q3: 295, min: 205, max: 325, group: 'South' },
  { date: '2024-03', median: 240, q1: 210, q3: 270, min: 180, max: 300, group: 'East' }
]);
</script>