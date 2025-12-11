<script setup>
const props = defineProps({
  aggregatedData: { type: Array, required: true },
  
  // Property key configuration
  rowKey: { type: String, default: "rowValue" },
  columnKey: { type: String, default: "columnValue" },
  colorKey: { type: String, default: "colorValue" },
});
console.log("heatmap data", props.aggregatedData);
console.log("test");
</script>

<template>
  <div ref="heatmapContainer">
  <h1>Time-series heatmap</h1>
  </div>
</template>
