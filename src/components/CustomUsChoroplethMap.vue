<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { scaleThreshold, scaleLinear } from "d3-scale";
import {
  ylGnBuDiscrete11,
  diagonalHatchPatternDef,
} from "../utils/colorSchemes";
import { format } from "d3-format";
import { min, max } from "d3-array";
import usGeoJson from "../assets/geo/us_states.json";

const props = defineProps({
  data: { type: Array, required: true },
  valueKey: { type: String, default: "value" },
  colorKey: { type: String, default: null }, // Defaults to valueKey if not provided
  secondaryValue: { type: String },
  hatchPatternString: { type: String, default: "no data" },

  // Color scale configuration
  colorDomain: {
    type: Array,
    default: () => [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  colorRange: { type: Array, default: () => ylGnBuDiscrete11 },

  // Tooltip configuration
  tooltipFields: {
    type: Array,
    default: () => [
      { label: "Prevalence", key: "prevalence", formatter: ".2f", suffix: "%" },
      { label: "Samples", key: "num_samples", formatter: ",.0f" },
    ],
  },

  // Legend configuration
  legendTitle: { type: String, default: "prevalence (%)" },

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

const formatLegendValue = format(".2s");

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

const actualColorKey = computed(() => props.colorKey || props.valueKey);

const colorScale = computed(() =>
  scaleThreshold().domain(props.colorDomain).range(props.colorRange)
);

// Create data lookup map
const dataLookup = computed(() => {
  const lookup = {};
  props.data.forEach((item) => {
    if (item.state) {
      lookup[item.state] = item;
    }
  });
  return lookup;
});

const getStateFill = (stateName) => {
  const stateData = dataLookup.value[stateName];
  if (stateData && stateData[actualColorKey.value] !== undefined) {
    return colorScale.value(stateData[actualColorKey.value]);
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

const formatFieldValue = (value, formatter, suffix = "") => {
  if (value === undefined || value === null) {
    return props.hatchPatternString;
  }

  let formattedValue;

  if (formatter) {
    try {
      formattedValue = format(formatter)(value);
    } catch (e) {
      formattedValue = value.toString();
    }
  } else {
    formattedValue = value.toString();
  }

  return formattedValue + suffix;
};

const tooltipData = computed(() => {
  if (!hoveredState.value) return [];

  const stateData = dataLookup.value[hoveredState.value];
  if (!stateData) return [];

  return props.tooltipFields.map((field) => ({
    label: field.label,
    value: formatFieldValue(
      stateData[field.key],
      field.formatter,
      field.suffix || ""
    ),
  }));
});

const handleMouseEnter = (event, feature) => {
  hoveredState.value = feature.properties.NAME;
  eventPosition.value = { x: event.pageX, y: event.pageY };
  if (width.value >= 800) {
    xPosition.value =
      eventPosition.value.x >= 400
        ? eventPosition.value.x - 150
        : eventPosition.value.x - 20;
  } else {
    xPosition.value =
      eventPosition.value.x >= 250
        ? eventPosition.value.x - 100
        : eventPosition.value.x - 10;
  }
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

const legendWidth = 300;
const legendHeight = 45;
const rectWidth = 25;
const rectHeight = 15;

const rangeMin = 12;
const rangeMax = 288;

const legendScale = scaleLinear()
  .domain([min(colorScale.value.domain()), max(colorScale.value.domain())])
  .rangeRound([rangeMin, rangeMax]);

const colorBands = colorScale.value.range().map((color) => {
  const d = colorScale.value.invertExtent(color);

  if (d[0] == null) d[0] = legendScale.domain()[0];
  if (d[1] == null) d[1] = legendScale.domain()[1];

  return d;
});

const ticks = colorScale.value.domain();

const mapAriaLabel = computed(
  () =>
    `Interactive choropleth map showing ${props.valueKey} data across the United States. Hover over states to see detailed information.`
);

console.log("test", mapAriaLabel.value);

// Choropleth container inline styles
const choroplethContainerStyle = computed(() => ({
  position: "relative",
  ...containerMargins.value,
}));

// Legend inline styles
const legendWrapperStyle = {
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  marginBottom: "0px",
};

const legendStyle = {
  marginLeft: "0px",
  marginRight: "0px",
};

const titleStyle = {
  marginBottom: "5px",
  textAlign: "left",
  fontSize: "14px",
  marginLeft: "10px",
};

const noDataStyle = {
  marginLeft: "7px",
};

// Tooltip inline styles
const tooltipWrapperStyle = computed(() => ({
  left: xPosition.value + "px",
  top: yPosition.value + "px",
  width: "140px",
  background: "#ffffff",
  boxShadow: "1px 2px 7px rgba(0, 0, 0, 0.2)",
  borderRadius: "3px",
  position: "absolute",
  padding: "0.5em",
  textAlign: "left",
  fontSize: "13px",
  lineHeight: "18px",
  zIndex: 1,
  color: "#2c3e50",
  pointerEvents: "none",
}));

const tooltipTitleStyle = {
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "16px",
};

const tooltipDividerStyle = {
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  marginTop: "5px",
  marginBottom: "5px",
};

const tooltipGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  fontWeight: "400",
  marginBottom: "5px",
};

const tooltipBarStyle = computed(() => {
  const stateData = dataLookup.value[hoveredState.value];
  const value = stateData ? stateData[actualColorKey.value] : null;

  return {
    position: "absolute",
    height: "7px",
    width: "100%",
    bottom: "0",
    left: "0",
    background:
      value !== null && value !== undefined
        ? colorScale.value(value)
        : "transparent",
  };
});
</script>

<template>
  <div class="choropleth-container" :style="choroplethContainerStyle">
    <!-- Legend -->
    <div class="legend-wrapper" :style="legendWrapperStyle">
      <div class="legend" :style="legendStyle">
        <div class="title" :style="titleStyle">
          <span>{{ legendTitle }}</span>
        </div>
        <svg role="img" :width="legendWidth" :height="legendHeight">
          <defs v-html="diagonalHatchPatternDef('legendDiagonalHatch')"></defs>
          <g>
            <rect
              v-for="band in colorBands"
              :x="legendScale(band[0])"
              :width="legendScale(band[1]) - legendScale(band[0])"
              :height="rectHeight"
              :fill="colorScale(band[0])"
            />
            <g
              v-for="tick in ticks"
              :transform="`translate(${legendScale(tick)}, 0)`"
            >
              <text
                y="18"
                dy="0.8em"
                text-anchor="middle"
                fill="#2c3e50"
                font-size="14px"
              >
                {{ tick == 0 ? tick : formatLegendValue(tick) }}
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div class="no-data" :style="noDataStyle">
        <svg width="125" height="24">
          <defs v-html="diagonalHatchPatternDef('legendDiagonalHatch')"></defs>
          <rect
            x="5"
            y="2"
            :width="rectWidth"
            :height="rectHeight"
            fill="url(#legendDiagonalHatch)"
            stroke="#888"
            stroke-width="0.5"
          />
          <text x="40" y="12" dy="0.1em" fill="#2c3e50" font-size="14px">
            {{ hatchPatternString }}
          </text>
        </svg>
      </div>
    </div>

    <!-- Map -->
    <svg
      :width="renderedWidth"
      :height="renderedHeight"
      :aria-label="mapAriaLabel"
    >
      <defs v-html="diagonalHatchPatternDef('diagonalHatch')"></defs>

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
  <div v-if="hoveredState && eventPosition" :style="tooltipWrapperStyle">
    <div :style="tooltipTitleStyle">
      {{ hoveredState }}
      <hr :style="tooltipDividerStyle" />
    </div>
    <div :style="tooltipGridStyle">
      <template v-for="field in tooltipData" :key="field.label">
        <span>{{ field.label }}</span>
        <span>{{ field.value }}</span>
      </template>
    </div>
    <div>
      <span :style="tooltipBarStyle" />
    </div>
  </div>
</template>
