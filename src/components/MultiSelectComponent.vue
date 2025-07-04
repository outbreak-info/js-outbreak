<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <n-form-item v-if="label" :label="label">
        <div class="select-button-row">
          <n-select
            v-model:value="selectedValue"
            multiple
            :options="resolvedOptions"
            :placeholder="placeholder"
            :filterable="filterable"
            :clearable="clearable"
            :loading="isLoading"
            :max-tag-count="maxTagCount"
            size="medium"
            :style="{ width: width }"
            @update:value="handleChange"
          />
          <n-button 
            v-if="showButton"
            type="primary"
            size="medium"
            @click="handleButtonClick"
          >
            {{ buttonText }}
          </n-button>
        </div>
      </n-form-item>
      <div v-else class="select-button-row">
        <n-select
          v-model:value="selectedValue"
          multiple
          :options="resolvedOptions"
          :placeholder="placeholder"
          :filterable="filterable"
          :clearable="clearable"
          :loading="isLoading"
          :max-tag-count="maxTagCount"
          size="medium"
          :style="{ width: width }"
          @update:value="handleChange"
        />
        <n-button 
          v-if="showButton"
          type="primary"
          size="medium"
          @click="handleButtonClick"
        >
          {{ buttonText }}
        </n-button>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { NSelect, NFormItem, NConfigProvider, NButton, type SelectOption } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  optionsFunction: { type: Function, default: null },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Select options' },
  filterable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  maxTagCount: { type: Number, default: undefined },
  showButton: { type: Boolean, default: false },
  buttonText: { type: String, default: 'Apply' },
  width: { type: String, default: '300px' },
})

const emit = defineEmits(['update:modelValue', 'optionsLoaded', 'optionsError', 'buttonClick'])

const selectedValue = ref<(string | number)[]>([...(props.modelValue as (string | number)[])])
const isLoading = ref(false)
const dynamicOptions = ref<SelectOption[]>([])

const resolvedOptions = computed((): SelectOption[] => {
  if (props.options && props.options.length > 0) {
    return props.options as SelectOption[]
  }
  return dynamicOptions.value
})

const handleChange = (value: any[]) => {
  selectedValue.value = value
  emit('update:modelValue', value)
}

const handleButtonClick = () => {
  emit('buttonClick', selectedValue.value)
}

const loadOptionsFromFunction = async () => {
  if (!props.optionsFunction) return
  
  isLoading.value = true
  try {
    const result = await props.optionsFunction()
    dynamicOptions.value = result || []
    emit('optionsLoaded', result)
  } catch (error) {
    console.error('Error loading options:', error)
    dynamicOptions.value = []
    emit('optionsError', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.modelValue, (newValue) => {
  selectedValue.value = [...(newValue as (string | number)[])]
}, { deep: true })

watch(() => props.optionsFunction, () => {
  loadOptionsFromFunction()
}, { immediate: true })

onMounted(() => {
  if (props.optionsFunction) {
    loadOptionsFromFunction()
  }
})
</script>

<style scoped>
.select-button-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>