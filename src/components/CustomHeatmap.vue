<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleThreshold, scaleLinear } from "d3-scale";
import {
  rdPuDiscrete11,
  diagonalHatchPatternDef,
} from "../utils/colorSchemes";
import { format } from "d3-format";
import { min, max } from "d3-array";

const props = defineProps({
  hatchPatternString: { type: String, default: "not detected" },

  // Color scale configuration
  colorDomain: {
    type: Array,
    default: () => [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  colorRange: { type: Array, default: () => rdPuDiscrete11 },

  // Legend configuration
  legendTitle: { type: String, default: "mutation prevalence in lineage (%)" },
  showLegend: { type: Boolean, default: true },

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

const actualColorKey = computed(() => props.colorKey || props.valueKey);

const colorScale = computed(() =>
  scaleThreshold().domain(props.colorDomain).range(props.colorRange)
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

// Heatmap container inline styles
const heatmapContainerStyle = computed(() => ({
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
</script>

<template>
  <div class="heatmap-container" :style="choroplethContainerStyle">
    <!-- Legend -->
    <div v-if="showLegend" class="legend-wrapper" :style="legendWrapperStyle">
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
  </div>
</template>
