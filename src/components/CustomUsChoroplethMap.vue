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
</script>

<template>
  <div class="choropleth-container" :style="containerMargins">
    <svg :width="renderedWidth" :height="renderedHeight">
      <path
        v-for="(state, index) in usGeoJson.features"
        :key="state.properties.NAME || index"
        :d="pathGenerator(state)"
        fill="#ffffff"
        stroke="#000000"
      />
    </svg>
  </div>
</template>

<style scoped>
.choropleth-container {
  position: relative;
}
</style>
