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
      <n-icon size="25" style="display: inline;vertical-align: middle">
        <BookInformation24Regular />
      </n-icon>
      <slot></slot>
    </n-card>
  </n-config-provider>
</template>

<script setup lang="ts">
import {NCard, NConfigProvider, NIcon} from 'naive-ui'
import { themeOverrides } from '../assets/naiveThemeVariables'
import { BookInformation24Regular } from "@vicons/fluent";

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