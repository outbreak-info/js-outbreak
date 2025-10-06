<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleThreshold, scaleLinear, scaleBand } from "d3-scale";
import {
  rdPuDiscrete11,
  diagonalHatchPatternDef,
} from "../utils/colorSchemes";
import { format } from "d3-format";
import { min, max } from "d3-array";

const props = defineProps({
  data: { type: Array, required: true },
  
  // Color scale configuration
  colorDomain: {
    type: Array,
    default: () => [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  colorRange: { type: Array, default: () => rdPuDiscrete11 },

  // Legend configuration
  showLegend: { type: Boolean, default: true },
  legendTitle: { type: String, default: "mutation prevalence in lineage (%)" },
  hatchPatternString: { type: String, default: "not detected" },

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

const margin = {
  top: 5,
  right: 45,
  bottom: 5,
  left: 90,
};

const containerWidth = ref(500);

const maxCellWidth = 20;
const cellHeight = 20;
const cellPadding = 0.15;

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.innerWidth >= 1000) {
    containerWidth.value = 1000;
  } else {
    containerWidth.value = window.innerWidth;
  }
};

const colorScale = computed(() =>
  scaleThreshold().domain(props.colorDomain).range(props.colorRange)
);

const colorAccessor = (d) => d.prevalence;
const xAccessor = (d) => d.collection_date;
const yAccessor = (d) => d.name;

const dates = computed(() =>
  [...new Set(props.data.map(xAccessor))]
  .sort((a, b) => {
    return a.localeCompare(b);
  }),
);

const lineages = computed(() =>
  [...new Set(props.data.map(yAccessor))]
  .sort((a, b) => {
    return a.localeCompare(b);
  }),
);

const generateDataToBeRendered = (dates, lineages, data) => {
  const lookup = new Map(
    data.map(d => [`${d.collection_date}-${d.name}`, d])
  );

  const result = [];

  for (const date of dates) {
    for (const lineage of lineages) {
      const key = `${date}-${lineage}`;
      if (lookup.has(key)) {
        result.push(lookup.get(key));
      } else {
        result.push({
          prevalence: -1,
          collection_date: date,
          name: lineage,
        });
      }
    }
  }
  return result.sort((a, b) => {
    a.collection_date.localeCompare(b.collection_date)
  });
}

const dataToBeRendered = computed(() => generateDataToBeRendered(dates.value, lineages.value, props.data));

// Calculate available width for cells
const availableWidth = computed(() =>
  containerWidth.value - margin.left - margin.right - props.containerMarginLeft - props.containerMarginRight
);

// Calculate cell width based on available space and max constraint
const cellWidth = computed(() => {
  const numDates = dates.value.length;
  if (numDates === 0) return maxCellWidth;
  
  // Calculate space needed if max width is used
  const maxWidthNeeded = numDates * maxCellWidth + (numDates - 1) * maxCellWidth * cellPadding;
  
  // If max width fits, use it; otherwise scale down proportionally to fit
  if (maxWidthNeeded <= availableWidth.value) {
    return maxCellWidth;
  } else {
    return availableWidth.value / (numDates + (numDates - 1) * cellPadding);
  }
});

const innerWidth = computed(() => availableWidth.value);

const width = computed(() =>
  containerWidth.value
);

const xScale = computed(() => {
  const numDates = dates.value.length;
  const actualCellWidth = Math.min(cellWidth.value, maxCellWidth);
  const padding = actualCellWidth * cellPadding;
  const totalWidth = numDates * actualCellWidth + (numDates - 1) * padding;
  
  return scaleBand()
    .domain(dates.value)
    .range([0, totalWidth])
    .paddingInner(cellPadding);
});

const height = computed(() =>
  lineages.value.length > 2
    ? cellHeight * lineages.value.length + (5 * lineages.value.length - 1)
    : cellHeight * lineages.value.length + 15,
);

const innerHeight = computed(() => height.value - margin.top - margin.bottom);

const yScale = computed(() =>
  scaleBand()
    .domain(lineages.value)
    .range([0, innerHeight.value])
    .paddingInner(0),
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

const formatLegendValue = format(".2s");

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
  <div class="heatmap-container" :style="heatmapContainerStyle">
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
    <!-- Grid -->
    <div class="grid-wrapper" :style="gridWrapperStyle">
      <svg
        class="grid"
        :width="width"
        :height="height"
      >
        <g :transform="`translate(${margin.left}, ${margin.top})`">
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
          <g v-for="lineage in lineages">
            <text
              class="lineage-label"
              text-anchor="end"
              x="-10"
              :y="yScale(lineage) + yScale.bandwidth() / 2"
              dy=".30em"
              fill="#2c3e50"
              font-size="14px"
              font-weight="'s400"
            >
              {{ lineage }}
            </text>
            <g v-for="(dataPoint, index) in dataToBeRendered.filter((element) => element.name == lineage)">
              <rect 
                v-if="dataPoint.prevalence > 0"
                class="cell detected"
                :key="'lineage-' + index"
                :aria-label="`date: ${dataPoint.collection_date}, prevalence: ${dataPoint.prevalence}%`"
                :x="xScale(xAccessor(dataPoint))"
                :y="yScale(lineage)"
                :width="xScale.bandwidth()"
                :height="cellHeight"
                :fill=colorScale(colorAccessor(dataPoint)) 
                stroke="#a9a9a9"
              />
              <rect 
                v-else
                class="cell"
                :x="xScale(xAccessor(dataPoint))"
                :y="yScale(lineage)"
                :width="xScale.bandwidth()"
                :height="cellHeight"
                fill="url(#diagonalHatch)"
                stroke="#a9a9a9"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>
