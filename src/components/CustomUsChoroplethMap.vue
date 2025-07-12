<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { geoAlbersUsa, geoPath } from "d3-geo";
import usGeoJson from "../assets/geo/us_states.json";

const props = defineProps({
  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 10 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 10 },
});

const containerMargins = computed(() => ({
  marginTop: props.containerMarginTop + "px",
  marginRight: props.containerMarginRight + "px",
  marginBottom: props.containerMarginBottom + "px",
  marginLeft: props.containerMarginLeft + "px",
}));

const width = ref(500);
const height = computed(() => (width.value / 960) * 600);
const hoveredState = ref(null);

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.innerWidth >= 1000) {
    width.value = 1000;
  } else {
    width.value = window.innerWidth;
  }
};

const renderedWidth = computed(
  () => width.value - props.containerMarginLeft - props.containerMarginRight
);
const renderedHeight = computed(() => height.value);

const projection = computed(() =>
  geoAlbersUsa()
    .scale(renderedWidth.value * 1.2)
    .translate([renderedWidth.value / 2, renderedHeight.value / 2])
);

const pathGenerator = computed(() => geoPath().projection(projection.value));

const handleMouseEnter = (feature) => {
  hoveredState.value = feature.properties.NAME;
};

const handleMouseLeave = () => {
  hoveredState.value = null;
};

const nonHoveredStatesFeatures = computed(() =>
  usGeoJson.features.filter(
    (state) => state.properties.NAME !== hoveredState.value
  )
);

const hoveredStateFeature = computed(() =>
  usGeoJson.features.find(
    (state) => state.properties.NAME === hoveredState.value
  )
);
</script>

<template>
  <div class="choropleth-container" :style="containerMargins">
    <svg :width="renderedWidth" :height="renderedHeight">
      <!-- Non-hovered states -->
      <path
        v-for="(feature, index) in nonHoveredStatesFeatures"
        :key="feature.properties.NAME || index"
        :d="pathGenerator(feature)"
        fill="#ffffff"
        stroke="#000000"
        stroke-width="1"
        style="cursor: pointer"
        @mouseenter="handleMouseEnter(feature)"
        @mouseleave="handleMouseLeave"
      />
      <!-- Hovered state -->
      <path
        v-if="hoveredStateFeature"
        :key="hoveredStateFeature.properties.NAME + '-hovered'"
        :d="pathGenerator(hoveredStateFeature)"
        fill="#fff5ee"
        stroke="#ff6347"
        stroke-width="3"
        style="cursor: pointer"
        @mouseenter="handleMouseEnter(hoveredStateFeature)"
        @mouseleave="handleMouseLeave"
      />
    </svg>
  </div>
</template>

<style scoped>
.choropleth-container {
  position: relative;
}
</style>
