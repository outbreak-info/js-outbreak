<script setup>
import { computed } from "vue"
import { NConfigProvider, NFormItem, NRadioGroup, NRadio, NSpace } from "naive-ui";
import { themeOverrides } from "../assets/naiveThemeVariables";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: true
  },

  label: {
    type: String,
    default: ""
  },

  options: {
    type: Array,
    required: true
  },

  direction: {
    type: String,
    default: "horizontal" // horizontal | vertical
  },

  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
  <n-form-item :label="label">
    <n-radio-group v-model:value="internalValue" :disabled="disabled">
      <n-space :vertical="direction === 'vertical'">
        <n-radio
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </n-radio>
      </n-space>
    </n-radio-group>
  </n-form-item>
  </n-config-provider>
</template>
