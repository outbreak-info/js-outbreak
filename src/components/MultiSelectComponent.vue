<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <n-form-item :label=props.label>
        <div style="display: flex;">
          <n-select
            v-model:value="selectedPrimitiveValues"
            :multiple="multiple"
            :options="primitiveValueOptions"
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
            style="margin-left: 10px;"
          >
            {{ buttonText }}
          </n-button>
        </div>
      </n-form-item>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted, type PropType} from 'vue'
import { NSelect, NFormItem, NConfigProvider, NButton } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

interface ExtendedSelectOption<T=any> {
  label: string,
  value: T
}

const props = defineProps({
  modelValue: { type: [Array, Object] as PropType<ExtendedSelectOption[] | ExtendedSelectOption>, default: () => [] },
  options: { type: Array as PropType<ExtendedSelectOption[]>, default: () => [] },
  optionsFunction: { type: Function, default: null },
  placeholder: { type: String, default: 'Select options' },
  filterable: { type: Boolean, default: true },
  clearable: { type: Boolean, default: true },
  maxTagCount: { type: Number, default: undefined },
  buttonText: { type: String, default: 'Apply' },
  width: { type: String, default: '300px' },
  multiple: { type: Boolean, default: true },
  showButton: { type: Boolean, default: true },
  label: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'optionsLoaded', 'optionsError', 'buttonClick'])

const selectedValue = ref<ExtendedSelectOption[] | ExtendedSelectOption | null>([])
const dynamicOptions = ref<ExtendedSelectOption[]>([])

const isLoading = ref(false)

const resolvedOptions = computed((): ExtendedSelectOption[] => {
  if (props.options && props.options.length > 0) {
    return props.options as ExtendedSelectOption[]
  }
  return dynamicOptions.value
})

const primitiveValueOptions = computed(() => {
  return resolvedOptions.value.map((option, index) => ({
    label: option.label,
    value: index
  }))
})

const selectedPrimitiveValues = computed({
  get: () => {
    if (!selectedValue.value) return props.multiple ? [] : null

    if (props.multiple) {
      return (selectedValue.value as ExtendedSelectOption[]).map(selected =>
          resolvedOptions.value.findIndex(option =>
              JSON.stringify(option.value) === JSON.stringify(selected.value)
          )
      )
    } else {
      const selected = selectedValue.value as ExtendedSelectOption
      if (!selected.value || !selected.label || selected.value === null || selected.label === "" || resolvedOptions.value.length === 0) {
        return null // If n-select is cleared, this will ensure label is null
      }
      return resolvedOptions.value.findIndex(option =>
          JSON.stringify(option.value) === JSON.stringify(selected.value)
      )
    }
  },
  set: (primitiveValues) => {
    if (!primitiveValues) {
      selectedValue.value = props.multiple ? [] : null
      return
    }

    if (props.multiple) {
      // Map indices back to values
      selectedValue.value = (primitiveValues as number[]).map(index =>
          resolvedOptions.value[index]
      )
    } else {
      // Map single index back to ExtendedSelectOption object
      selectedValue.value = resolvedOptions.value[primitiveValues as number]
    }
  }
})


const handleChange = (value: any) => {
  if (value === null || value === undefined) {
    if (props.multiple) {
      selectedValue.value = [] as ExtendedSelectOption[];
    } else {
      selectedValue.value = {
        label: "",
        value: null
      } as ExtendedSelectOption
    }
  } else if (props.multiple) {
    selectedValue.value = (value as number[]).map(index => resolvedOptions.value[index])
  } else {
    const index = value as number
    selectedValue.value = (index >= 0 && index < resolvedOptions.value.length)
        ? resolvedOptions.value[index]
        : { label: "", value: null } as ExtendedSelectOption
  }
  emit('update:modelValue', selectedValue.value)
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
  if(props.modelValue !== null)
    selectedValue.value = newValue
}, { deep: true, immediate: true })

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

</style>