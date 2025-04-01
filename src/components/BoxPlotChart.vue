<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import * as Plot from '@observablehq/plot'
import { defaultColor } from '../utils/colorSchemes'

interface DataPoint {
  category: string
  value: number
}

const props = defineProps({
  data: { type: Array as () => DataPoint[], required: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 500 },
  marginLeft: { type: Number, default: 120 },
  marginBottom: { type: Number, default: 50 },
  boxColor: { type: String, default: defaultColor },
  xLabel: { type: String, default: 'Value' },
  yLabel: { type: String, default: 'Category' }
})

const chartContainer = ref<HTMLDivElement>()

function calculateMedian(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

function processData() {
  // Group data by category
  const groupedData = props.data.reduce((acc, { category, value }) => {
    acc[category] = acc[category] || []
    acc[category].push(value)
    return acc
  }, {} as Record<string, number[]>)

  // Calculate median for sorting
  const medianValues = Object.entries(groupedData).map(([category, values]) => ({
    category,
    median: calculateMedian(values) || 0
  }))

  // Sort categories by median
  const sortedCategories = medianValues
    .sort((a, b) => b.median - a.median)
    .map(d => d.category)

  return {
    groupedData,
    sortedCategories
  }
}

const processedData = computed(() => processData())

function renderBoxPlot() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return

  chartContainer.value.innerHTML = ''

  const boxPlot = Plot.plot({
    marginLeft: props.marginLeft,
    marginBottom: props.marginBottom,
    height: props.height,
    width: props.width,
    x: {
      label: props.xLabel,
      grid: true
    },
    y: {
      label: props.yLabel,
      domain: processedData.value.sortedCategories
    },
    style: {
      fontSize: "12px"
    },
    marks: [
      Plot.boxX(props.data, {
        y: "category",
        x: "value",
        fill: props.boxColor,
        stroke: "black",
        r: 0
      })
    ]
  })

  chartContainer.value.appendChild(boxPlot)
}

onMounted(renderBoxPlot)
watch(() => props.data, renderBoxPlot, { deep: true })
watch(() => props.boxColor, renderBoxPlot)

onBeforeUnmount(() => {
  if (chartContainer.value) chartContainer.value.innerHTML = ''
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style> 