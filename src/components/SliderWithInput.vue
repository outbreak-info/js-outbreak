<script setup>
import { computed } from "vue";
import { NConfigProvider, NFormItem, NSlider, NInputNumber, NSpace } from "naive-ui";
import { themeOverrides } from "../assets/naiveThemeVariables";
import { debounce } from "../utils/helpers";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },

  label: {
    type: String,
    default: ""
  },

  minRange: {
    type: Number,
    required: true
  },

  maxRange: {
    type: Number,
    required: true
  },

  step: {
    type: Number,
    default: 1
  },

  sliderWidth: {
    type: [String, Number],
    default: 250
  },

  inputWidth: {
    type: [String, Number],
    default: 100
  },

  marks: {
    type: Object,
    default: null
  },

  autoMarks: {
    type: Boolean,
    default: false
  },

  debounceDelay: {
    type: Number,
    default: 0
  },

  disabled: {
    type: Boolean,
    default: false
  },

  tooltipFormatter: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(["update:modelValue"]);

const resolveWidth = (value) => {
  return typeof value === "number" ? `${value}px` : value;
}

const emitValue =
  props.debounceDelay > 0
    ? debounce((val) => emit("update:modelValue", val), props.debounceDelay)
    : (val) => emit("update:modelValue", val);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emitValue(val)
});

const computedMarks = computed(() => {
  if (props.marks) return props.marks;

  if (props.autoMarks) {
    return {
      [props.minRange]: String(props.minRange),
      [props.maxRange]: String(props.maxRange)
    };
  }

  return undefined;
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-form-item :label="label">
      <n-space>
        <n-slider
          v-model:value="internalValue"
          :min="minRange"
          :max="maxRange"
          :step="step"
          :marks="computedMarks"
          :disabled="disabled"
          :format-tooltip="tooltipFormatter"
          :style="{ width: resolveWidth(sliderWidth) }"
        />

        <n-input-number
          v-model:value="internalValue"
          :min="minRange"
          :max="maxRange"
          :step="step"
          :disabled="disabled"
          :style="{ width: resolveWidth(inputWidth) }"
        />
      </n-space>
    </n-form-item>
  </n-config-provider>
</template>
