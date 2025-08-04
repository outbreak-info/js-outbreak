<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <n-form-item :label=props.label>
        <n-input
          v-model:value="inputValue"
          :placeholder="placeholder"
          :style="{ width: width }"
          size="medium"
        />
        <n-button
          v-if="showButton"
          type="primary"
          size="medium"
          :loading="loading"
          @click="handleButtonClick"
        >
          {{ buttonText }}
        </n-button>
      </n-form-item>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {NInput, NButton, NConfigProvider, NFormItem} from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

const props = defineProps({
  placeholder: { type: String, default: 'Enter text' },
  buttonText: { type: String, default: 'Submit' },
  width: { type: String, default: '300px' },
  modelValue: { type: String || Number, default: 0 },
  loading: { type: Boolean, default: false },
  showButton: { type: Boolean, default: true },
  label: { type: String, default: '' }
})

const emit = defineEmits(['submit', 'update:modelValue'])

const inputValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
}, { deep: true })

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

const handleButtonClick = () => {
  emit('submit', inputValue.value)
}
</script>

<style scoped>

</style>