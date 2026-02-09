<template>
  <div class="test-container">
    <h1>TimeSeries Component Test</h1>

    <h2>Single Series</h2>
    <TimeSeriesChart
      :data="chartData"
      valueKey="val"
      :lineColor="currentColor"
    />

    <h2>Multi-Series with Default Legend</h2>
    <TimeSeriesChart
      :data="multiSeriesData"
      valueKey="val"
      fill="category"
    />

    <h2>Multi-Series with Custom Colors</h2>
    <TimeSeriesChart
      :data="multiSeriesData"
      valueKey="val"
      fill="category"
      :legendDomain="['Series A', 'Series B', 'Series C']"
      :legendRange="[colorPalette[0], colorPalette[2], colorPalette[4]]"
    />

    <h2>Multi-Series without Legend</h2>
    <TimeSeriesChart
      :data="multiSeriesData"
      valueKey="val"
      fill="category"
      :showLegend="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { colorPalette } from '../../../src/utils/colorSchemes'
import TimeSeriesChart from "../../../src/components/TimeSeriesChart.vue";

const width = ref(800)
const height = ref(400)
const currentColor = colorPalette[3];

const chartData = ref([
  { key: "2023-01-01", val: 42 },
  { key: "2023-01-15", val: 56 },
  { key: "2023-02-01", val: 48 },
  { key: "2023-02-15", val: 65 },
  { key: "2023-03-01", val: 72 },
  { key: "2023-03-15", val: 63 },
  { key: "2023-04-01", val: 80 },
  { key: "2023-04-15", val: 95 },
  { key: "2023-05-01", val: 88 },
  { key: "2023-05-15", val: 105 },
  { key: "2023-06-01", val: 112 },
  { key: "2023-06-15", val: 98 },
  { key: "2023-07-01", val: 120 },
  { key: "2023-07-15", val: 135 },
  { key: "2023-08-01", val: 128 },
  { key: "2023-08-15", val: 145 },
  { key: "2023-09-01", val: 152 },
  { key: "2023-09-15", val: 143 },
  { key: "2023-10-01", val: 163 },
  { key: "2023-10-15", val: 175 }
]);

const multiSeriesData = ref([
  // Series A
  { key: "2023-01-01", val: 42, category: "Series A" },
  { key: "2023-01-15", val: 56, category: "Series A" },
  { key: "2023-02-01", val: 48, category: "Series A" },
  { key: "2023-02-15", val: 65, category: "Series A" },
  { key: "2023-03-01", val: 72, category: "Series A" },
  { key: "2023-03-15", val: 63, category: "Series A" },
  { key: "2023-04-01", val: 80, category: "Series A" },
  { key: "2023-04-15", val: 95, category: "Series A" },
  { key: "2023-05-01", val: 88, category: "Series A" },
  { key: "2023-05-15", val: 105, category: "Series A" },

  // Series B
  { key: "2023-01-01", val: 35, category: "Series B" },
  { key: "2023-01-15", val: 48, category: "Series B" },
  { key: "2023-02-01", val: 40, category: "Series B" },
  { key: "2023-02-15", val: 55, category: "Series B" },
  { key: "2023-03-01", val: 63, category: "Series B" },
  { key: "2023-03-15", val: 58, category: "Series B" },
  { key: "2023-04-01", val: 70, category: "Series B" },
  { key: "2023-04-15", val: 82, category: "Series B" },
  { key: "2023-05-01", val: 76, category: "Series B" },
  { key: "2023-05-15", val: 90, category: "Series B" },

  // Series C
  { key: "2023-01-01", val: 50, category: "Series C" },
  { key: "2023-01-15", val: 65, category: "Series C" },
  { key: "2023-02-01", val: 58, category: "Series C" },
  { key: "2023-02-15", val: 75, category: "Series C" },
  { key: "2023-03-01", val: 85, category: "Series C" },
  { key: "2023-03-15", val: 78, category: "Series C" },
  { key: "2023-04-01", val: 95, category: "Series C" },
  { key: "2023-04-15", val: 110, category: "Series C" },
  { key: "2023-05-01", val: 102, category: "Series C" },
  { key: "2023-05-15", val: 120, category: "Series C" }
]);

</script>