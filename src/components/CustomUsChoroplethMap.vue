<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleThreshold } from "d3-scale";
import { schemeYlGnBu } from "d3-scale-chromatic";
import usGeoJson from "../assets/geo/us_states.json";

const props = defineProps({
  data: { type: Array, required: true },
  valueKey: { type: String, default: "value" },

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

const colorScale = computed(() =>
  scaleThreshold()
    .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
    .range(schemeYlGnBu[9])
);

// Create data lookup map
const dataLookup = computed(() => {
  const lookup = {};
  props.data.forEach((item) => {
    if (item.state && item[props.valueKey] !== undefined) {
      lookup[item.state] = item[props.valueKey];
    }
  });
  return lookup;
});

const getStateFill = (stateName) => {
  const value = dataLookup.value[stateName];
  if (value !== undefined) {
    return colorScale.value(value);
  }
  return "url(#diagonalHatch)";
};

const getStateStroke = (stateName) => {
  if (hoveredState.value === stateName) {
    return "#ff6347";
  }
  return "#000000";
};

const getStateStrokeWidth = (stateName) => {
  if (hoveredState.value === stateName) {
    return 4;
  }
  return 1;
};

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
      <defs>
        <pattern
          id="diagonalHatch"
          width="5"
          height="5"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            :style="`stroke:#a9a9a9; stroke-width:2`"
          />
        </pattern>
      </defs>

      <!-- Non-hovered states -->
      <path
        v-for="(feature, index) in nonHoveredStatesFeatures"
        :key="feature.properties.NAME || index"
        :d="pathGenerator(feature)"
        :fill="getStateFill(feature.properties.NAME)"
        :stroke="getStateStroke(feature.properties.NAME)"
        :stroke-width="getStateStrokeWidth(feature.properties.NAME)"
        style="cursor: pointer"
        @mouseenter="handleMouseEnter(feature)"
        @mouseleave="handleMouseLeave"
      />

      <!-- Hovered state -->
      <path
        v-if="hoveredStateFeature"
        :key="hoveredStateFeature.properties.NAME + '-hovered'"
        :d="pathGenerator(hoveredStateFeature)"
        :fill="getStateFill(hoveredStateFeature.properties.NAME)"
        :stroke="getStateStroke(hoveredStateFeature.properties.NAME)"
        :stroke-width="getStateStrokeWidth(hoveredStateFeature.properties.NAME)"
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
