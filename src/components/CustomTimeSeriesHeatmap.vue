<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleThreshold, scaleLinear, scaleBand } from "d3-scale";
import { format } from "d3-format";
import { min, max } from "d3-array";
import { timeFormat, timeParse } from "d3-time-format";
import {
  ylOrRdDiscrete11,
  diagonalHatchPatternDef,
} from "../utils/colorSchemes";
import { createDateArray } from "../utils/arrays";
import { filterXTicks } from "../utils/tickFilters";

const props = defineProps({
  aggregatedData: { type: Array, required: true },
  dateRange: { type: Number, default: 30 },
  
  // Property key configuration
  rowKey: { type: String, default: "name" },
  columnKey: { type: String, default: "collection_date" },
  colorKey: { type: String, default: "prevalence" },

   // Color scale configuration
  colorDomain: {
    type: Array,
    default: () => [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  colorRange: { type: Array, default: () => ylOrRdDiscrete11 },

  // Legend configuration
  showLegend: { type: Boolean, default: true },
  legendTitle: { type: String, default: "prevalence (%)" },
  hatchPatternString: { type: String, default: "not detected" },

  // Chart margins
  marginTop: { type: Number, default: 5 },
  marginRight: { type: Number, default: 130 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 70 },

  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 10 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 10 },

  // Heatmap appearance
  createCellsWithRoundedCorners: { type: Boolean, default: true },
  rowPadding: { type: Number, default: 0.1 },
});

const width = ref(500);
const axisHeight = 25;
const cellHeight = 25;
const cellPadding = 0.15;

console.log("data", props.aggregatedData);

const parseTime = timeParse("%Y-%m-%d");
const formatTime = timeFormat("%b %e");

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  width.value = window.innerWidth >= 1000 ? 1000 : window.innerWidth;
};

const colorAccessor = (d) => d[props.colorKey];
const xAccessor = (d) => d[props.columnKey];
const yAccessor = (d) => d[props.rowKey];

const containerMargins = computed(() => ({
  marginTop: props.containerMarginTop + "px",
  marginRight: props.containerMarginRight + "px",
  marginBottom: props.containerMarginBottom + "px",
  marginLeft: props.containerMarginLeft + "px",
}));

const marginTop = props.marginTop;
const marginRight = props.marginRight;
const marginBottom = props.marginBottom;
const marginLeft = props.marginLeft;

// Legend dimensions
const legendWidth = 300;
const legendHeight = 45;
const rectWidth = 25;
const rectHeight = 15;
const rangeMin = 12;
const rangeMax = 288;

const colorScale = computed(() =>
  scaleThreshold().domain(props.colorDomain).range(props.colorRange)
);

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

const rowLabels = computed(() =>
  [...new Set(props.aggregatedData.map(yAccessor))]
    .sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    }),
);

const minMaxDates = computed(() => {
  const dates = props.aggregatedData.map(xAccessor).sort();
  return [dates[0], dates[dates.length - 1]];
});

const xScaleDomain = computed(() =>
  createDateArray(minMaxDates.value[0], minMaxDates.value[1], props.dateRange),
);

const height = computed(() =>
  rowLabels.value.length * cellHeight + marginTop + marginBottom
);

const innerWidth = computed(() => width.value - marginLeft - marginRight);
const innerHeight = computed(() => rowLabels.value.length * cellHeight);

const xScale = computed(() =>
  scaleBand()
    .domain(xScaleDomain.value)
    .range([0, innerWidth.value])
    .paddingInner(cellPadding)
);

const yScale = computed(() =>
  scaleBand()
    .domain(rowLabels.value)
    .range([0, rowLabels.value.length * cellHeight])
    .paddingInner(props.rowPadding) 
);

const datesWithData = computed(() => {
  const dates = [...new Set(props.aggregatedData.map(xAccessor))];
  return dates.sort((a, b) => new Date(a) - new Date(b));
});

const allXTicks = computed(() => xScale.value.domain());

const xTicksToBeRendered = computed(() =>
  filterXTicks(allXTicks.value, innerWidth.value)
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
          [props.colorKey]: "hatching",
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

const dataToBeRendered = computed(() => generateDataToBeRendered(datesWithData.value, rowLabels.value, props.aggregatedData));

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
  marginTop: "15px",
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
  <div :style="heatmapContainerStyle">
    <!-- Legend -->
    <div v-if="showLegend" :style="legendWrapperStyle">
      <div :style="legendStyle">
        <div :style="titleStyle">
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
      <div :style="noDataStyle">
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
    <!-- x-axis -->
    <div>
      <svg
        role="img"
        :width="width - containerMarginLeft - containerMarginRight"
        :height="axisHeight"
      >
        <g :transform="`translate(${marginLeft}, 5)`">
          <g
            v-for="(xtick, index) in xTicksToBeRendered"
            :key="'xtick-' + index"
            :transform="`translate(${xScale(xtick) + xScale.bandwidth() / 2}, 0)`"
          >
            <text
              y="0"
              dy="0.8em"
              text-anchor="middle"
              fill="#2c3e50"
              font-size="14px"
            >
              {{ formatTime(parseTime(xtick)) }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <!-- Grid -->
    <div>
      <svg
        role="img"
        :width="width - containerMarginLeft - containerMarginRight"
        :height="height"
      >
        <g :transform="`translate(${marginLeft}, ${marginTop})`">
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
              text-anchor="end"
              x="-10"
              :y="yScale(rowLabel) + yScale.bandwidth() / 2"
              dy=".30em"
              fill="2c3e50"
              font-size="14px"
              font-weight="400"
            >
              {{ rowLabel }}
            </text>
            <g v-for="(dataPoint, index) in dataToBeRendered.filter((element) => element[props.rowKey] == rowLabel)">
              <rect 
                v-if="dataPoint[props.colorKey] !== 'hatching'"
                class="cell detected"
                :key="'row-' + index"
                :x="xScale(xAccessor(dataPoint))"
                :y="yScale(rowLabel)"
                :width="xScale.bandwidth()"
                :height="yScale.bandwidth()"
                :fill=colorScale(colorAccessor(dataPoint)) 
                 stroke="#a9a9a9"
                :rx="createCellsWithRoundedCorners ? '4' : '0'"
              />
              <rect 
                v-else
                class="cell"
                :x="xScale(xAccessor(dataPoint))"
                :y="yScale(rowLabel)"
                :width="xScale.bandwidth()"
                :height="yScale.bandwidth()"
                fill="url(#diagonalHatch)"
                stroke="#a9a9a9"
                :rx="createCellsWithRoundedCorners ? '4' : '0'"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>
