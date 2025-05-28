<template>
  <div class="choropleth-container" ref="containerRef">
    <svg :width="svgWidth" :height="svgHeight">
      <path 
        v-for="(state, index) in usGeoJson.features" 
        :key="state.properties.NAME || index"
        :d="pathGenerator(state)"
        :fill="fillColor"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import usGeoJson from '../assets/geo/us_states.json';

defineProps({
  fillColor: {
    type: String,
    default: '#e6e6fa',
  },
  strokeColor: {
    type: String,
    default: '#000',
  },
  strokeWidth: {
    type: Number,
    default: 0.5,
  }
});

const containerRef = ref(null);
const svgWidth = ref(0);
const svgHeight = ref(0);

let projection = geoAlbersUsa();
let pathGenerator = geoPath().projection(projection);

const updateSize = () => {
  const el = containerRef.value;
  if (!el) return;

  const width = el.clientWidth;
  const height = (width / 960) * 600;

  svgWidth.value = width;
  svgHeight.value = height;

  projection = geoAlbersUsa()
    .scale(width * 1.2)
    .translate([width / 2, height / 2]);

  pathGenerator = geoPath().projection(projection);
}

let resizeObserver;

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    updateSize();
  })

  const tryObserve = () => {
    const el = containerRef.value;
    if (el instanceof Element) {
      updateSize();
      resizeObserver.observe(el);
    } else {
      requestAnimationFrame(tryObserve);
    }
  }

  tryObserve();
})

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }
})
</script>

<style scoped>
.choropleth-container {
  width: 100%;
}
svg {
  display: block;
}
</style>
