<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <n-form-item>
        <div class="select-button-row">
          <n-select
            v-model:value="selectedPrimitiveValues"
            :multiple="multiple"
            :options="resolvedOptions"
            :placeholder="placeholder"
            :filterable="filterable"
            :clearable="clearable"
            :loading="isLoading"
            :max-tag-count="multiple ? maxTagCount : undefined"
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
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { NSelect, NFormItem, NConfigProvider, NButton, type SelectOption } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

const props = defineProps({
  modelValue: { type: [Array, String, Number], default: () => [] },
  options: { type: Array, default: () => [] },
  optionsFunction: { type: Function, default: null },
  placeholder: { type: String, default: 'Select options' },
  filterable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  maxTagCount: { type: Number, default: undefined },
  buttonText: { type: String, default: 'Apply' },
  width: { type: String, default: '300px' },
  multiple: { type: Boolean, default: true },
  showButton: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'optionsLoaded', 'optionsError', 'buttonClick'])

const selectedValue = ref<SelectOption[] | SelectOption | null>([])

const isLoading = ref(false)
const dynamicOptions = ref<SelectOption[]>([])

const resolvedOptions = computed((): SelectOption[] => {
  if (props.options && props.options.length > 0) {
    return props.options as SelectOption[]
  }
  return dynamicOptions.value
})

const selectedPrimitiveValues = ref<(string | number)[] | string | number>(props.multiple ? [...(props.modelValue as (string | number)[])] : (props.modelValue as string | number))


const handleChange = (value: any[] | any, option: SelectOption[] | SelectOption | null) => {
  selectedPrimitiveValues.value = value
  selectedValue.value = option
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
  selectedPrimitiveValues.value = props.multiple ? [...(newValue as (string | number)[])] : (newValue as string | number)
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