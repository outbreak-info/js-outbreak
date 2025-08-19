<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-tag
        :type="type as any"
        :bordered="bordered"
    >
      {{ text }}
    </n-tag>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NTag, NConfigProvider } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

defineProps({
  type: { type: String as () => 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error', default: 'default' },
  text: { type: String, required: true },
  bordered: { type: Boolean, default: false }
})
</script>

<style scoped>
</style>