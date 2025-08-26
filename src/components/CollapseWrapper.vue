<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-collapse
      v-model:expanded-names="expandedItems"
      :arrow-placement="arrowPlacement"
    >
      <n-collapse-item
        v-for="(item, index) in items"
        :key="index"
        :name="index.toString()"
        :title="item.title"
      >
        <slot 
          :name="item.key || `item-${index}`"
          :item="item"
          :index="index"
        >
          <div>
            <p>No content in "{{ item.title }}"</p>
          </div>
        </slot>
      </n-collapse-item>
    </n-collapse>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NCollapse, NCollapseItem, NConfigProvider } from 'naive-ui'
import { themeOverrides } from '../assets/naiveThemeVariables'

export interface CollapseItemData {
  title: string
  key?: string
}

const props = defineProps({
  items: { type: Array as () => CollapseItemData[], required: true },
  modelValue: { type: Array as () => string[], default: () => [] },
  arrowPlacement: { type: String as () => 'left' | 'right', default: 'left' }
})

const emit = defineEmits(['update:modelValue'])

const expandedItems = ref(props.modelValue)

watch(expandedItems, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  expandedItems.value = newValue
}, { deep: true })
</script>

<style scoped>
</style>