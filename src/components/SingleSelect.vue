<script setup>
import { computed } from "vue";
import { NConfigProvider, NFormItem, NSelect } from "naive-ui";
import HelpTooltip from "./HelpTooltip.vue";
import { themeOverrides } from "../assets/naiveThemeVariables";

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },

  label: {
    type: String,
    default: "",
  },

  options: {
    type: Array,
    default: () => [],
  },

  placeholder: {
    type: String,
    default: "Type to search",
  },

  helpTooltipText: {
    type: String,
    default: null,
  },

  filterable: {
    type: Boolean,
    default: true,
  },

  clearable: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  width: {
    type: [String, Number],
    default: 250,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const resolveWidth = (value) => {
  return typeof value === "number" ? `${value}px` : value;
};

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-form-item>
      <template #label>
        <span>
          {{ label }}
          <HelpTooltip
            v-if="helpTooltipText"
            :text="helpTooltipText"
            :size="25"
          />
        </span>
      </template>

      <n-select
        v-model:value="internalValue"
        :options="options"
        :placeholder="placeholder"
        :filterable="filterable"
        :clearable="clearable"
        :loading="loading"
        :disabled="disabled"
        :reset-menu-on-options-change="false"
        :style="{ width: resolveWidth(width) }"
      />
    </n-form-item>
  </n-config-provider>
</template>
