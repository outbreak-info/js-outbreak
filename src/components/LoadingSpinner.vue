<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-spin size="medium" :description="props.description" />
  </n-config-provider>
</template>

<script setup lang="ts">
import { NSpin, NConfigProvider } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

const props = defineProps({
  description: { type: String, default: 'Loading ...' },
});

</script>

<style scoped>
</style>