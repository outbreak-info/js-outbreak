<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-button
      type="primary"
      size="medium"
      @click="handleClick"
    >
      {{ text }}
    </n-button>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NButton, NConfigProvider } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

const props = defineProps({
  text: { type: String, required: true },
  onClick: { type: Function, required: true }
})

const handleClick = () => {
  props.onClick()
}
</script>

<style scoped>
</style>