<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <n-form-item>
        <n-checkbox
          v-model:checked="checkboxValue"
          size="medium"
        >
          {{ text }}
        </n-checkbox>
      </n-form-item>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NCheckbox, NConfigProvider, NFormItem } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

const props = defineProps({
  text: { type: String, required: true },
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const checkboxValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  checkboxValue.value = newValue
})

watch(checkboxValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
</style>