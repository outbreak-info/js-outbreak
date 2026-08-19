<template>
  <div class="test-container">
    <h1>Time Series Bar + Line Chart Component Test</h1>

    <TimeSeriesBarLineChart
        :barData="enrolledData"
        :lineData="positivityData"
    />

    With binInterval day
    <TimeSeriesBarLineChart
        :barData="enrolledData"
        :lineData="positivityData"
        binInterval="day"
    />

    No dots, custom curve
    <TimeSeriesBarLineChart
        :barData="enrolledData"
        :lineData="positivityData"
        :showDots="false"
        curve="monotone-x"
        :lineStrokeWidth="4"
        barColor="#d8d8d8"
        yTickSuffix="%"
        yRightTickSuffix="%"
    />

    Lines only (no bars, no right axis)
    <TimeSeriesBarLineChart
        :lineData="positivityData"
    />

    Bars only (no lines)
    <TimeSeriesBarLineChart
        :barData="enrolledData"
        yLabel="Count of Enrolled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimeSeriesBarLineChart from '../../../src/components/TimeSeriesBarLineChart.vue'

// 12 monthly bins of counts
const enrolledData = ref([
  { key: '2024-04-01', value: 410 },
  { key: '2024-05-15', value: 380 },
  { key: '2024-06-23', value: 250 },
  { key: '2024-07-04', value: 190 },
  { key: '2024-08-09', value: 210 },
  { key: '2024-09-13', value: 320 },
  { key: '2024-10-25', value: 360 },
  { key: '2024-11-23', value: 430 },
  { key: '2024-12-21', value: 470 },
  { key: '2025-01-08', value: 450 },
  { key: '2025-02-06', value: 500 },
  { key: '2025-03-02', value: 400 },
])

// % positive by virus, one row per (month, group)
const makeSeries = (group: string, values: number[]) =>
  values.map((value, i) => ({
    key: enrolledData.value[i].key,
    value,
    group,
  }))

const positivityData = ref([
  ...makeSeries('Influenza', [2, 1, 1, 1, 2, 4, 8, 14, 22, 18, 10, 5]),
  ...makeSeries('RSV', [1, 1, 1, 2, 5, 12, 28, 41, 30, 16, 6, 2]),
  ...makeSeries('SARS-CoV-2', [10, 8, 6, 5, 7, 9, 12, 15, 18, 14, 11, 9]),
  ...makeSeries('Adenovirus', [6, 5, 4, 3, 4, 5, 6, 7, 8, 7, 6, 5]),
])
</script>
