<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-form-item :label="'Filter by ' + props.fieldName">
      <n-select
          filterable
          :options="selectOptions"
          v-model:value="selectedValue" />
    </n-form-item>
    <br />
    <SelectBarChart @bar-selected="hostBarSelected" :xTickFrequency="props.xTickFrequency" :selectedBarKey="localSelectedItem" :data="chartData.slice(0, props.nItems)" :fieldName="props.fieldName" v-bind="$attrs" />
  </n-config-provider>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import SelectBarChart from './SelectBarChart.vue';
import { NSelect, NFormItem, NConfigProvider } from 'naive-ui'
import {themeOverrides} from "../assets/naiveThemeVariables.js"; //TODO: Override config in template

const chartData = ref([]);
const selectOptions = computed(() => {
  return [
    { label: "All", value: null }, // Add "All" option
    ...chartData.value.map(item => ({
      label: `${item.key} (${item.value})`,
      value: item.key
    }))
  ];
});

const localSelectedItem = ref({key: null, value: null});
const selectedValue = computed({
  get: () => localSelectedItem.value.key,
  set: (newKey) => {
    if (newKey === null) {
      localSelectedItem.value = { key: null, value: null };
    } else {
      const selectedOption = chartData.value.find(item => item.key === newKey);
      if (selectedOption) {
        localSelectedItem.value = {
          key: selectedOption.key,
          value: selectedOption.value
        };
      }
    }

    emit('item-selected', localSelectedItem.value);
  }
});

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  fieldName: { type: String, default: "Field" },
  data: { type: Array, default: () => [] },
  selectedItem: { type: Object, default: () => ({ key: null, value: null }) },
  xTickFrequency: { type: Number, default: null },
  nItems: { type: Number, default: 10 }
})

const emit = defineEmits(['item-selected']);

const hostBarSelected = (item) => {
  localSelectedItem.value = item;
};

async function loadData() {
    chartData.value = props.data.sort((a, b) => b.value - a.value);
}

onMounted(loadData);
watch(() => props.data, loadData);

watch(() => props.selectedItem, (newVal) => {
  if (newVal && (newVal.key !== localSelectedItem.value.key || newVal.value !== localSelectedItem.value.value)) {
    localSelectedItem.value = newVal;
  }
}, { immediate: true, deep: true });

watch(() => localSelectedItem.value, (newVal) => {
  emit('item-selected', newVal);
}, { deep: true });

</script>

<style scoped>

</style>