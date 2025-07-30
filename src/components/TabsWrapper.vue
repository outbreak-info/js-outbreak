<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-tabs
      v-model:value="activeTab"
      :type="type"
      :size="size"
      :placement="placement"
      :animated="animated"
      :closable="closable"
      :addable="addable"
    >
      <n-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :name="index.toString()"
        :tab="tab.name"
        :closable="tab.closable"
      >
        <slot 
          :name="tab.key || `tab-${index}`"
          :tab="tab"
          :index="index"
        >
          <div>
            <p>No content in "{{ tab.name }}"</p>
          </div>
        </slot>
      </n-tab-pane>
    </n-tabs>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NTabs, NTabPane, NConfigProvider } from 'naive-ui'
import { themeOverrides } from '../assets/naiveThemeVariables'

export interface TabData {
  name: string
  key?: string
  closable?: boolean
}

const props = defineProps({
  tabs: { type: Array as () => TabData[], required: true },
  modelValue: { type: String, default: '0' },
  type: { type: String as () => 'bar' | 'line' | 'card' | 'segment', default: 'line' },
  size: { type: String as () => 'small' | 'medium' | 'large', default: 'medium' },
  placement: { type: String as () => 'top' | 'right' | 'bottom' | 'left', default: 'top' },
  animated: { type: Boolean, default: true },
  closable: { type: Boolean, default: false },
  addable: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue)

watch(activeTab, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue
})
</script>

<style scoped>
</style>