<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-card
      :size="size"
      :bordered="bordered"
      :hoverable="hoverable"
      :embedded="embedded"
      :closable="closable"
      @close="handleClose"
    >
      <slot></slot>
    </n-card>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NCard, NConfigProvider } from 'naive-ui'
import { themeOverrides } from '../assets/naiveThemeVariables'

defineProps({
  bordered: { type: Boolean, default: true },
  hoverable: { type: Boolean, default: false },
  embedded: { type: Boolean, default: false },
  closable: { type: Boolean, default: false },
  size: { type: String as () => 'small' | 'medium' | 'large' | 'huge', default: 'medium' }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
</style>