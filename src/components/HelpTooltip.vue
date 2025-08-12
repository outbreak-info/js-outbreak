<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :style="{
      display: 'inline-flex',
      verticalAlign: verticalAlign,
    }"
  >
    <n-tooltip :placement="placement" trigger="hover">
      <template #trigger>
        <n-icon
          role="img"
          tabindex="0"
          :size="size"
          :style="{ cursor: 'pointer', color: iconColor }"
          :aria-label="text.replace(/<[^>]*>/g, '')"
        >
          <QuestionCircle24Filled v-if="iconType === 'question'" />
          <BookQuestionMark24Filled v-else-if="iconType === 'book'" />
        </n-icon>
      </template>
      <div v-html="text"></div>
    </n-tooltip>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NTooltip, NIcon, NConfigProvider } from "naive-ui";
import {
  QuestionCircle24Filled,
  BookQuestionMark24Filled,
} from "@vicons/fluent";
import { themeOverrides } from "../assets/naiveThemeVariables";

defineProps({
  text: {
    type: String,
    required: true,
  },
  placement: {
    type: String as () =>
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "top-start"
      | "top-end"
      | "bottom-start"
      | "bottom-end"
      | "left-start"
      | "left-end"
      | "right-start"
      | "right-end",
    default: "top",
  },
  verticalAlign: {
    type: String as () => "top" | "middle" | "bottom" | "baseline",
    default: "baseline", // baseline somehow aligns in the middle with bootstrap
  },
  size: {
    type: [String, Number],
    default: 30,
  },
  iconColor: {
    type: String,
    default: "#999",
  },
  iconType: {
    type: String as () => "question" | "book",
    default: "question",
  },
});
</script>

<style scoped></style>
