<template>
  <div class="test-container">
    <h1>Time Series Bar Chart Component Test</h1>
    <TimeSeriesBarChart
        :data="chartData"
        :showProportion="true"
    />
    With cumulative sum
    <TimeSeriesBarChart
      :data="chartData"
      :showCumulativeLine="true"
    />

    Pre-binned data with group
    <TimeSeriesBarChart
        :data="chartGroupedData"
        :isPreBinned="true"
    />

    Pre-binned by year
    <TimeSeriesBarChart
        :data="chartGroupedData"
        :isPreBinned="true"
        binInterval="year"
    />

    With X-axis limits - only 2024
    <TimeSeriesBarChart
      :data="chartData"
      :xTickMin="'2024-01-01'"
      :xTickMax="'2024-12-31'"
      :showCumulativeLine="true"
    />

    Testing legendDomain - order: Yes, No
    <TimeSeriesBarChart
        :data="chartGroupedPreBinnedData"
        :isPreBinned="true"
        :legendDomain="['Yes', 'No']"
    />

    Testing reversed legendDomain - order: No, Yes
    <TimeSeriesBarChart
        :data="chartGroupedPreBinnedData"
        :isPreBinned="true"
        :legendDomain="['No', 'Yes']"
    />

    Testing legendDomain (non preBinned data) - order: Yes, No
    <TimeSeriesBarChart
        :data="chartGroupedPreBinnedData"
        :isPreBinned="false"
        :legendDomain="['Yes', 'No']"
    />

    Testing legendDomain (none preBinned data) - order: No, Yes
    <TimeSeriesBarChart
        :data="chartGroupedPreBinnedData"
        :isPreBinned="false"
        :legendDomain="['No', 'Yes']"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimeSeriesBarChart from '../../../src/components/TimeSeriesBarChart.vue'

const chartData = ref([
  { key: '2024-04-01', value: 300 },
  { key: '2024-05-01', value: 250 },
  { key: '2024-06-01', value: 320 },
  { key: '2024-07-01', value: 280 },
  { key: '2024-08-01', value: 200 },
  { key: '2024-08-01', value: 180 },
  { key: '2024-10-01', value: 150 },
  { key: '2024-11-01', value: 350 },
  { key: '2024-12-01', value: 1200 },
  { key: '2025-05-01', value: 500 },
  { key: '2025-02-01', value: 100 }
]);

const chartGroupedData = ref([
  { key: '2024-04', value: 300, group: "A" },
  { key: '2024-04', value: 250, group: "B" },
  { key: '2024-04', value: 320, group: "C" },
  { key: '2024-05', value: 280, group: "C" },
  { key: '2024-06', value: 200, group: "A" },
  { key: '2024-06', value: 180, group: "B" },
  { key: '2024-06', value: 150, group: "A" },
  { key: '2024-07', value: 350, group: "C" },
  { key: '2024-07', value: 1200, group: "A" },
  { key: '2025-07', value: 500, group: "B" },
  { key: '2025-07', value: 100, group: "A" },
  { key: '2025-05', value: 500, group: "D" },
  { key: '2025-02', value: 100, group: "D" }
]);

const chartGroupedPreBinnedData = ref([
  { key: '2024-09-14', value: 300, group: "Yes" },
  { key: '2024-09-14', value: 100, group: "No" },
  { key: '2024-09-21', value: 300, group: "Yes" },
  { key: '2024-09-21', value: 120, group: "No" },
  { key: '2024-09-28', value: 100, group: "Yes" },
  { key: '2024-09-28', value: 20, group: "No" }
]);

</script> 