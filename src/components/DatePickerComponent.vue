<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NDatePicker v-model:value="localValue" type="date" clearable/>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import { NDatePicker, NConfigProvider } from 'naive-ui'
import { themeOverrides } from '../assets/naiveThemeVariables'

const props = defineProps({
  modelValue: { type: Number, default: Date.now() },
  formattedModelValue: { type: String, default: null }
});

const emit = defineEmits(['update:modelValue', 'update:formattedModelValue']);

const localValue = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal ?? null;
})

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
  emit(
      'update:formattedModelValue',
  localValue.value === null ? null : (new Date(newVal)).toISOString().split('T')[0]
  )
})
</script>
