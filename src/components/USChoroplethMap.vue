<template>
  <div ref="containerRef" class="map-container">
    <svg :width="svgWidth" :height="svgHeight">
      <path 
        v-for="(state, index) in usGeoJson.features" 
        :key="'state' + index"
        :d="pathGenerator(state)"
        fill="#e6e6fa"
        stroke="#000"
        stroke-width="0.5"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import usGeoJson from '../assets/geo/us_states.json';

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
.map-container {
  width: 100%;
}
svg {
  display: block;
}
</style>
