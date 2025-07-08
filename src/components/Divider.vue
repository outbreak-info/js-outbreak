<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-divider
      v-if="text"
      :title-placement="titlePlacement"
      :vertical="vertical"
    >
      {{ text }}
    </n-divider>
    <n-divider
      v-else
      :vertical="vertical"
    />
  </n-config-provider>
</template>

<script setup lang="ts">
import { NDivider, NConfigProvider } from 'naive-ui'
import { themeOverrides } from "../assets/naiveThemeVariables"

defineProps({
  text: { type: String, default: '' },
  titlePlacement: { type: String as () => 'left' | 'right' | 'center', default: 'center' },
  vertical: { type: Boolean, default: false }
})
</script>