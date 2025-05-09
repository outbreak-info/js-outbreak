<template>
  <div ref="containerRef" class="map-container">
    <svg :width="svgWidth" :height="svgHeight">
      <path
        v-for="(state, idx) in usGeoJson.features"
        :key="state.properties.NAME + '-' + idx"
        :d="pathGenerator(state)"
        :fill="getFill(state)"
        stroke="#000"
        stroke-width="0.5"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { scaleSequential, scaleThreshold } from 'd3-scale';
import usGeoJson from '../assets/geo/us_states.json';

const props = defineProps({
  stateData: {
    type: Object,
    default: () => ({})
  },
  thresholds: {
    type: Array,
    default: () => [10, 20, 30, 40, 50, 60, 70, 80, 90]
  },
  colorScheme: {
    type: Array,
    default: () => ['#fff0a9','#fee087','#fec965','#feab4b','#fd893c',
      '#fa5c2e','#ec3023','#d31121','#af0225','#800026']
  }
})

const containerRef = ref(null);
const svgWidth = ref(0);
const svgHeight = ref(0);

let projection = geoAlbersUsa();
let pathGenerator = geoPath().projection(projection);

const colorScale = computed(() =>
  scaleThreshold()
    .domain(props.thresholds)
    .range(props.colorScheme)
);

const normalizedData = computed(() =>
  Object.fromEntries(
    Object.entries(props.stateData).map(([k, v]) =>
      [k.trim().toLowerCase(), v])
  )
);

const getFill = (feature) => {
  const name = feature.properties.NAME.trim().toLowerCase();
  const raw = normalizedData.value[name];
  const value = typeof raw === 'string' ? parseFloat(raw) : raw;
  return typeof value === 'number' && !isNaN(value) ? colorScale.value(value) : '#eee'
};

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
  resizeObserver = new ResizeObserver(updateSize);

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
