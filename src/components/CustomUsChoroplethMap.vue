<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleThreshold } from "d3-scale";
import { schemeYlGnBu } from "d3-scale-chromatic";
import { format } from "d3-format";
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
const eventPosition = ref(null);
const xPosition = ref(null);
const yPosition = ref(null);

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

const formatPrevalence = (stateName) => {
  const value = dataLookup.value[stateName];
  if (value !== undefined) {
    return format(".2f")(value);
  }
  return "no data";
};

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

const handleMouseEnter = (event, feature) => {
  hoveredState.value = feature.properties.NAME;
  eventPosition.value = { x: event.pageX, y: event.pageY };
  xPosition.value = eventPosition.value.x - 120;
  yPosition.value = eventPosition.value.y + 50;
};

const handleMouseLeave = () => {
  hoveredState.value = null;
  eventPosition.value = null;
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
        @mouseenter="handleMouseEnter($event, feature)"
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
        @mouseenter="handleMouseEnter($event, hoveredStateFeature)"
        @mouseleave="handleMouseLeave"
      />
    </svg>
  </div>
  <!-- Tooltip -->
  <div
    v-if="hoveredState && eventPosition"
    class="tooltip-wrapper"
    :style="{
      left: `${xPosition}px`,
      top: `${yPosition}px`,
      width: '160px',
    }"
  >
    <div class="title">
      {{ hoveredState }}
      <hr class="divider" />
    </div>
    <div class="grid">
      <span>Prevalence (%)</span>
      <span class="data">
        {{ formatPrevalence(hoveredState) }}
      </span>
    </div>
    <div>
      <span
        class="bar"
        :style="{
          background: `${colorScale(dataLookup[hoveredState])}`,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.choropleth-container {
  position: relative;
}
.tooltip-wrapper {
  background: #ffffff;
  box-shadow: 1px 2px 7px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  position: absolute;
  padding: 0.5em;
  text-align: left;
  font-size: 14px;
  line-height: 18px;
  z-index: 1;
  color: #2c3e50;
  pointer-events: none;
}
.title {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
.divider {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 5px;
  margin-bottom: 5px;
}
.grid {
  display: grid;
  row-gap: 1px;
  grid-template-columns: 1fr auto;
  column-gap: 15px;
  font-weight: 400;
  margin-bottom: 10px;
}
.bar {
  position: absolute;
  height: 7px;
  width: 100%;
  bottom: 0;
  left: 0;
}
</style>
