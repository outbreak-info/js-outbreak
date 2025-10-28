<template>
  <div class="scatter-with-search">
    <TextInput
      v-model="searchQuery"
      :placeholder="searchPlaceholder"
      :label="searchLabel"
      :show-button="false"
      :width="searchWidth"
    />
    <ScatterChart
      :data="highlightData"
      :xKey="xKey"
      :yKey="yKey"
      :pointColor="pointColor"
      :colorKey="searchQuery ? '_color' : null"
      :height="height"
      :width="width"
      :marginLeft="marginLeft"
      :marginBottom="marginBottom"
      :xLabel="xLabel"
      :yLabel="yLabel"
      :xGrid="xGrid"
      :yGrid="yGrid"
      :logScale="logScale"
      :tipFormatString="tipFormatString"
      :titleKey="titleKey"
      :additionalAnnotationKeys="additionalAnnotationKeys"
      :showMinMaxXLabels="showMinMaxXLabels"
      :minXLabel="minXLabel"
      :maxXLabel="maxXLabel"
      :xDomain="xDomain"
      :yDomain="yDomain"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import ScatterChart from './ScatterChart.vue';
import TextInput from './TextInput.vue';

const props = defineProps({
  data: { type: Array, required: true },
  xKey: { type: String, default: 'x' },
  yKey: { type: String, default: 'y' },
  pointColor: { type: String, default: defaultColor },
  searchKey: { type: String, default: 'key' },
  highlightColor: { type: String, default: colorPalette[2] },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginLeft: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  xLabel: { type: String, default: 'valueX' },
  yLabel: { type: String, default: 'valueY' },
  xGrid: { type: Boolean, default: true },
  yGrid: { type: Boolean, default: true },
  logScale: { type: Boolean, default: false },
  tipFormatString: { type: String, default: '' },
  titleKey: { type: String, default: 'key' },
  additionalAnnotationKeys: { type: Array, default: () => [] },
  showMinMaxXLabels: { type: Boolean, default: false },
  minXLabel: { type: String, default: 'Decreasing' },
  maxXLabel: { type: String, default: 'Increasing' },
  xDomain: { type: Array, default: undefined },
  yDomain: { type: Array, default: undefined },
  searchPlaceholder: { type: String, default: 'Search for a point...' },
  searchLabel: { type: String, default: 'Search' },
  searchWidth: { type: String, default: '100%' }
});

const searchQuery = ref('');

// Enhance data with color information based on search
const highlightData = computed(() => {
  if (!props.data) return [];
  
  if (!searchQuery.value) {
    // No search query, return original data
    return props.data;
  }
  
  const query = searchQuery.value.toLowerCase();
  
  // Add a color field to each data point based on whether it matches
  return props.data.map((d) => {
    const searchValue = String(d[props.searchKey]).toLowerCase();
    const isMatch = searchValue.includes(query);
    
    return {
      ...d,
      _isHighlighted: isMatch,
      _color: isMatch ? props.highlightColor : props.pointColor
    };
  });
});
</script>

<style scoped>
.scatter-with-search {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

