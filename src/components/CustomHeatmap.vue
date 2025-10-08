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
  
  // Property key configuration
  rowKey: { type: String, default: "rowValue" },
  columnKey: { type: String, default: "columnValue" },
  colorKey: { type: String, default: "colorValue" },
  
  // Color scale configuration
  colorDomain: {
    type: Array,
    default: () => [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  colorRange: { type: Array, default: () => rdPuDiscrete11 },

  // Legend configuration
  showLegend: { type: Boolean, default: true },
  legendTitle: { type: String, default: "(%)" },
  hatchPatternString: { type: String, default: "not detected" },

   // Chart margins
  marginTop: { type: Number, default: 5 },
  marginRight: { type: Number, default: 45 },
  marginBottom: { type: Number, default: 5 },
  marginLeft: { type: Number, default: 90 },

  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 10 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 10 },
});

const margin = computed(() => ({
  top: props.marginTop,
  right: props.marginRight,
  bottom: props.marginBottom,
  left: props.marginLeft,
}));

const containerMargins = computed(() => ({
  marginTop: props.containerMarginTop + "px",
  marginRight: props.containerMarginRight + "px",
  marginBottom: props.containerMarginBottom + "px",
  marginLeft: props.containerMarginLeft + "px",
}));

const containerWidth = ref(500);

const maxCellWidth = 20;
const cellHeight = 20;
const cellPadding = 0.15;

const hoveredCell = ref(null);
const xPosition = ref(null);
const yPosition = ref(null);

const formatColorKey = format(',.2f');

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

const colorAccessor = (d) => d[props.colorKey];
const xAccessor = (d) => d[props.columnKey];
const yAccessor = (d) => d[props.rowKey];

const columnLabels = computed(() =>
  [...new Set(props.data.map(xAccessor))]
  .sort((a, b) => {
    return a.localeCompare(b);
  }),
);

const rowLabels = computed(() =>
  [...new Set(props.data.map(yAccessor))]
  .sort((a, b) => {
    return a.localeCompare(b);
  }),
);

const generateDataToBeRendered = (columnLabels, rowLabels, data) => {
  const lookup = new Map(
    data.map(d => [`${d[props.columnKey]}-${d[props.rowKey]}`, d])
  );

  const result = [];

  for (const columnLabel of columnLabels) {
    for (const rowLabel of rowLabels) {
      const key = `${columnLabel}-${rowLabel}`;
      if (lookup.has(key)) {
        result.push(lookup.get(key));
      } else {
        result.push({
          [props.colorKey]: -1,
          [props.columnKey]: columnLabel,
          [props.rowKey]: rowLabel,
        });
      }
    }
  }
  return result.sort((a, b) => {
    return a[props.columnKey].localeCompare(b[props.columnKey]);
  });
}

const dataToBeRendered = computed(() => generateDataToBeRendered(columnLabels.value, rowLabels.value, props.data));

// Calculate available width for cells
const availableWidth = computed(() =>
  containerWidth.value - margin.value.left - margin.value.right - props.containerMarginLeft - props.containerMarginRight
);

// Calculate cell width based on available space and max constraint
const cellWidth = computed(() => {
  const numColumns = columnLabels.value.length;
  if (numColumns === 0) return maxCellWidth;
  
  // Calculate space needed if max width is used
  const maxWidthNeeded = numColumns * maxCellWidth + (numColumns - 1) * maxCellWidth * cellPadding;
  
  // If max width fits, use it; otherwise scale down proportionally to fit
  if (maxWidthNeeded <= availableWidth.value) {
    return maxCellWidth;
  } else {
    return availableWidth.value / (numColumns + (numColumns - 1) * cellPadding);
  }
});

const innerWidth = computed(() => availableWidth.value);

const width = computed(() =>
  containerWidth.value
);

const xScale = computed(() => {
  const numColumns = columnLabels.value.length;
  const actualCellWidth = Math.min(cellWidth.value, maxCellWidth);
  const padding = actualCellWidth * cellPadding;
  const totalWidth = numColumns * actualCellWidth + (numColumns - 1) * padding;
  
  return scaleBand()
    .domain(columnLabels.value)
    .range([0, totalWidth])
    .paddingInner(cellPadding);
});

const height = computed(() =>
  rowLabels.value.length > 2
    ? cellHeight * rowLabels.value.length + (5 * rowLabels.value.length - 1)
    : cellHeight * rowLabels.value.length + 15,
);

const innerHeight = computed(() => height.value - margin.value.top - margin.value.bottom);

const yScale = computed(() =>
  scaleBand()
    .domain(rowLabels.value)
    .range([0, innerHeight.value])
    .paddingInner(0),
);

const legendWidth = 300;
const legendHeight = 45;
const rectWidth = 25;
const rectHeight = 15;
const rangeMin = 12;
const rangeMax = 288;

const axisHeight = 50;

const legendScale = scaleLinear()
  .domain([min(colorScale.value.domain()), max(colorScale.value.domain())])
  .rangeRound([rangeMin, rangeMax]);

const colorBands = colorScale.value.range().map((color) => {
  const d = colorScale.value.invertExtent(color);

  if (d[0] == null) d[0] = legendScale.domain()[0];
  if (d[1] == null) d[1] = legendScale.domain()[1];

  return d;
});

const legendTicks = colorScale.value.domain();

const formatLegendValue = format(".2s");

const allXTicks = computed(() => xScale.value.domain());

const handleMouseEnter = (d) => {
  hoveredCell.value = d;
  xPosition.value = xScale.value(xAccessor(hoveredCell.value));
  yPosition.value = yScale.value(yAccessor(hoveredCell.value));
};

const handleMouseLeave = () => {
  hoveredCell.value = null;
  xPosition.value = null;
  yPosition.value = null;
};

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

// Tooltip inline styles
const tooltipWrapperStyle = computed(() => ({
  transform: `translate(${xPosition.value}px, ${yPosition.value}px)`,
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

const tooltipDataStyle = {
  textAlign: "right",
};

const tooltipBarStyle = computed(() => {
  return {
    position: "absolute",
    height: "7px",
    width: "100%",
    bottom: "0",
    left: "0",
    background: hoveredCell.value !== null ? colorScale.value(colorAccessor(hoveredCell.value)) 
        : "transparent",
  };
});
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
              v-for="legendTick in legendTicks"
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
    <!-- x axis -->
    <div class="axis-wrapper">
      <svg
        role="img"
        class="axis"
        :width="width"
        :height="axisHeight"
      >
        <g :transform="`translate(${margin.left}, 50)`">
          <g
            v-for="(xTick, index) in allXTicks"
            :key="'xtick-' + index"
            :transform="`translate(${xScale(xTick) + xScale.bandwidth() / 2}, 0)`"
          >
            <text
              x="0"
              y="0"
              text-anchor="start"
              :fill="(hoveredCell && xTick === hoveredCell.columnValue) ?'#000dcb' : '#2c3e50'"
              :font-size="(hoveredCell && xTick === hoveredCell.columnValue) ? '13px' : '12px'"
              :font-weight="(hoveredCell && xTick === hoveredCell.columnValue) ? '700' : '400'"
              transform="rotate(-45)"
            >
              {{ xTick }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <!-- Grid -->
    <div class="grid-wrapper">
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
          <g v-for="rowLabel in rowLabels">
            <text
              class="row-label"
              text-anchor="end"
              x="-10"
              :y="yScale(rowLabel) + yScale.bandwidth() / 2"
              dy=".30em"
              :fill="(hoveredCell && rowLabel === hoveredCell.rowValue) ? '#000dcb' : '#2c3e50'"
              font-size="14px"
              :font-weight="(hoveredCell && rowLabel === hoveredCell.rowValue) ? '700' : '400'"
            >
              {{ rowLabel }}
            </text>
            <g v-for="(dataPoint, index) in dataToBeRendered.filter((element) => element[props.rowKey] == rowLabel)">
              <rect 
                v-if="dataPoint[props.colorKey] > 0"
                class="cell detected"
                :key="'row-' + index"
                :aria-label="`${props.rowKey}: ${rowLabel}, ${props.columnKey}: ${dataPoint[props.columnKey]}, ${props.colorKey}: ${dataPoint[props.colorKey]}%`"
                :x="xScale(xAccessor(dataPoint))"
                :y="yScale(rowLabel)"
                :width="xScale.bandwidth()"
                :height="cellHeight"
                :fill="(hoveredCell === dataPoint) ? '#000dcb' : colorScale(colorAccessor(dataPoint))"
                stroke="#a9a9a9"
                @mouseenter="handleMouseEnter(dataPoint)"
                @mouseleave="handleMouseLeave"
              />
              <rect 
                v-else
                class="cell"
                :x="xScale(xAccessor(dataPoint))"
                :y="yScale(rowLabel)"
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
  <!-- Tooltip -->
  <div v-if="hoveredCell" :style="tooltipWrapperStyle">
    <div :style="tooltipTitleStyle">
      {{ hoveredCell.rowValue }} &#183; {{ hoveredCell.columnValue }} 
      <hr :style="tooltipDividerStyle" />
    </div>
    <div :style="tooltipGridStyle">
      <span>{{ colorKey }}</span>
      <span class="data">{{ formatColorKey(hoveredCell.colorValue) }}</span>
    </div>
    <div>
      <span :style="tooltipBarStyle" />
    </div>
  </div>
</template>
