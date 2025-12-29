<script setup>
import { computed } from "vue";
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";
import { min, max } from "d3-array";
import { diagonalHatchPatternDef } from "../utils/colorSchemes";

const props = defineProps({
  colorScale: { type: Function, required: true },
  legendTitle: { type: String, default: "prevalence (%)" },
  hatchPatternString: { type: String, default: "not detected" },

  // Toggle hatch legend visibility
  showHatchLegend: { type: Boolean, default: true },

  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 0 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 0 },
});

// Legend dimensions
const legendWidth = 300;
const legendHeight = 45;
const rectWidth = 25;
const rectHeight = 15;
const rangeMin = 12;
const rangeMax = 288;
const colorBandGap = 1;

const containerMargins = computed(() => ({
  marginTop: props.containerMarginTop + "px",
  marginRight: props.containerMarginRight + "px",
  marginBottom: props.containerMarginBottom + "px",
  marginLeft: props.containerMarginLeft + "px",
}));

const legendScale = scaleLinear()
  .domain([min(props.colorScale.domain()), max(props.colorScale.domain())])
  .rangeRound([rangeMin, rangeMax]);

const colorBands = props.colorScale.range().map((color) => {
  const d = props.colorScale.invertExtent(color);

  if (d[0] == null) d[0] = legendScale.domain()[0];
  if (d[1] == null) d[1] = legendScale.domain()[1];

  return d;
});

const legendTicks = props.colorScale.domain();
const formatLegendValue = format(".2s");

const legendContainerStyle = computed(() => ({
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  ...containerMargins.value,
}));

const titleStyle = {
  marginBottom: "5px",
  textAlign: "left",
  fontSize: "14px",
  marginLeft: "10px",
};

const noDataStyle = {
  marginLeft: "10px",
};
</script>

<template>
  <div :style="legendContainerStyle">
    <div>
      <div :style="titleStyle">
        <span>{{ legendTitle }}</span>
      </div>

      <svg role="img" :width="legendWidth" :height="legendHeight">
        <defs v-html="diagonalHatchPatternDef('heatmapDiagonalHatch')" />

        <g>
          <!-- Color bands with transparent gaps -->
          <rect
            v-for="band in colorBands"
            :key="band[0]"
            :x="legendScale(band[0]) + colorBandGap / 2"
            :width="
              Math.max(
                0,
                legendScale(band[1]) - legendScale(band[0]) - colorBandGap
              )
            "
            :height="rectHeight"
            :fill="colorScale(band[0])"
            shape-rendering="crispEdges"
          />

          <!-- Ticks -->
          <g
            v-for="legendTick in legendTicks"
            :key="legendTick"
            :transform="`translate(${legendScale(legendTick)}, 0)`"
          >
            <text
              y="18"
              dy="0.8em"
              text-anchor="middle"
              fill="#2c3e50"
              font-size="14px"
            >
              {{ legendTick == 0 ? legendTick : formatLegendValue(legendTick) }}
            </text>
          </g>
        </g>
      </svg>
    </div>

    <!-- Hatch legend -->
    <div v-if="showHatchLegend" :style="noDataStyle">
      <svg width="125" height="24">
        <rect
          x="5"
          y="2"
          :width="rectWidth"
          :height="rectHeight"
          fill="url(#heatmapDiagonalHatch)"
          stroke="#888"
          stroke-width="0.5"
        />
        <text x="40" y="12" dy="0.1em" fill="#2c3e50" font-size="14px">
          {{ hatchPatternString }}
        </text>
      </svg>
    </div>
  </div>
</template>
