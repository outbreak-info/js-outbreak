<script setup>
const props = defineProps({
  data: { type: Array, required: true },
});
console.log("data", props.data);
</script>

<template>
  <p>chart goes here</p>
</template>
