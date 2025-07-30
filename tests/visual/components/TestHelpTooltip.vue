<template>
  <div>
    <h1>Help Tooltip Component Test</h1>
    
    <div>
      <h3>Basic Usage</h3>
      <p>
        <HelpTooltip text="Help text" />
      </p>
      
      <h3>Different Placements</h3>
      <div>
        <span>Top: <HelpTooltip text="Tooltip on top" placement="top" /></span>
        <span>Right: <HelpTooltip text="Tooltip on right" placement="right" /></span>
        <span>Right-start: <HelpTooltip text="Tooltip on right-start" placement="right-start" /></span>
      </div>
      
      <h3>Different Sizes</h3>
      <div>
        <span>Default: <HelpTooltip text="Default size tooltip" /></span>
        <span>Large: <HelpTooltip text="Large tooltip" :size="40" /></span>
      </div>

      <h3>Different Icon Types</h3>
      <div>
        <span>Question: <HelpTooltip text="This explicitly uses question mark icon" iconType="question" /></span>
        <span>Book: <HelpTooltip text="This uses the book question mark icon" iconType="book" /></span>
      </div>

      <h3>HTML in tooltip</h3>
      <p>
        Line break
        <HelpTooltip text="Line 1 <br><strong>Line 2</strong> <br> <em>Line 3</em>" />
      </p>
      <p>
        List with right-start placement
        <HelpTooltip text="Features:<ul><li>Fast performance</li><li>Easy to use</li><li>Fully customizable</li></ul>" iconType="book" placement="right-start" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import HelpTooltip from '../../../src/components/HelpTooltip.vue'
</script>

<style scoped>

</style>