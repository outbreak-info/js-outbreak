<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import {colorPalette, defaultColor} from "../utils/colorSchemes";
import { defaultFontSize, defaultFontFamily } from "../utils/chartDefaults";
import * as Plot from "@observablehq/plot";

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: "key" },
  valueKey: { type: String, default: "value" },
  lineColor: { type: String, default: defaultColor },
  height: { type: Number, default: 350 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: "Date" },
  yLabel: { type: String, default: "Count" },

  // Typography
  fontSize: { type: Number, default: defaultFontSize },
  fontColor: { type: String, default: "#333" },

  // Dots
  showDots: { type: Boolean, default: true },
  dotRadius: { type: Number, default: 3 },
  dotColor: { type: String, default: null }, // lineColor if null

  // Line styling
  curve: { type: String, default: "linear" },

  // Grid
  showGridX: { type: Boolean, default: true },
  showGridY: { type: Boolean, default: true },
  gridColor: { type: String, default: "#e0e0e0" },

  // Margins
  marginTop: { type: Number, default: 35 },
  marginRight: { type: Number, default: 50 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 50 },

  // Axis styling
  xAxisLabelOffset: { type: Number, default: 35 },
  yAxisLabelOffset: { type: Number, default: 45 },
  tickSize: { type: Number, default: 6 },
  tickPadding: { type: Number, default: 8 },

  // Tooltip decimal places
  tooltipDecimalPlaces: { type: Number, default: 2 },

  // Y-axis domain control
  useCustomYDomain: { type: Boolean, default: false },
  yDomainMin: { type: Number, default: 0 },
  yDomainMax: { type: Number, default: 100 },
  yDomainNice: { type: Boolean, default: true }, // "nice" rounding when not using custom domain

  // Multi-series support
  fill: { type: String, default: null },  // Category field name for multi-series
  legendDomain: { type: Array, default: null },  // Explicit category order
  legendRange: { type: Array, default: null },  // Custom color array
  showLegend: { type: Boolean, default: true },
  hLine: { type: Number, default: null },
  vLine: { type: Number, default: null },
});

const chartContainer = ref(null);

const margin = computed(() => ({
  top: props.marginTop,
  right: props.marginRight,
  bottom: props.marginBottom,
  left: props.marginLeft,
}));

const innerHeight = computed(
  () => props.height - margin.value.top - margin.value.bottom
);

// Computed dot color (falls back to line color if not specified)
const effectiveDotColor = computed(() => props.dotColor || props.lineColor);

// Computed y-axis configuration
const yAxisConfig = computed(() => {
  const config = {
    label: props.yLabel,
    labelAnchor: "center",
    labelArrow: "none",
    grid: true,
    tickSize: props.tickSize,
    tickPadding: props.tickPadding,
  };

  if (props.useCustomYDomain) {
    config.domain = [props.yDomainMin, props.yDomainMax];
  } else {
    config.nice = props.yDomainNice;
  }

  return config;
});

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = "";

  const processedData = props.data.map((d) => ({
    ...d,
    [props.dateKey]:
      d[props.dateKey] instanceof Date
        ? d[props.dateKey]
        : new Date(d[props.dateKey]),
  }));

  processedData.sort((a, b) => a[props.dateKey] - b[props.dateKey]);

  const marks = [];

  // Add grids if enabled
  if (props.showGridY) {
    marks.push(
      Plot.gridY({
        stroke: props.gridColor,
        strokeWidth: 0.5,
        strokeOpacity: 0.7,
      })
    );
  }

  if (props.showGridX) {
    marks.push(
      Plot.gridX({
        stroke: props.gridColor,
        strokeWidth: 0.5,
        strokeOpacity: 0.7,
      })
    );
  }

  // Main line(s)
  if (props.fill) {
    // Multi-series mode: use z channel to split by category
    marks.push(
      Plot.line(processedData, {
        x: props.dateKey,
        y: props.valueKey,
        z: props.fill,  // Split into separate lines
        stroke: props.fill,  // Color by category
        strokeWidth: 2,
        curve: props.curve
      })
    );
  } else {
    // Single-series
    marks.push(
      Plot.line(processedData, {
        x: props.dateKey,
        y: props.valueKey,
        stroke: props.lineColor,
        strokeWidth: 2,
        curve: props.curve
      })
    );
  }

  // Data points
  if (props.showDots) {
    if (props.fill) {
      // Multi-series mode: dots colored by category
      marks.push(
        Plot.dot(processedData, {
          x: props.dateKey,
          y: props.valueKey,
          fill: props.fill,  // Color dots by category
          r: props.dotRadius,
          fillOpacity: 0.8,
        })
      );
    } else {
      // Single-series
      marks.push(
        Plot.dot(processedData, {
          x: props.dateKey,
          y: props.valueKey,
          fill: effectiveDotColor.value,
          r: props.dotRadius,
          fillOpacity: 0.8,
        })
      );
    }
  }

  // Tooltip
  marks.push(
    Plot.tip(
      processedData,
      Plot.pointer({
        x: props.dateKey,
        y: props.valueKey,
        title: (d) => {
          const date = d[props.dateKey];
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = months[date.getUTCMonth()];
          const day = date.getUTCDate();
          const year = date.getUTCFullYear();

          // Add category info if in multi-series mode
          const categoryInfo = props.fill ? `${d[props.fill]}\n` : '';

          return `${categoryInfo}${month} ${day}, ${year}\n${props.yLabel}: ${Number(d[props.valueKey]).toFixed(props.tooltipDecimalPlaces)}`;
        },
        fontSize: props.fontSize,
        fill: "white",
        stroke: "#ccc",
        strokeWidth: 1,
        r: 4,
      })
    )
  );

  if (props.hLine !== null) marks.push(Plot.ruleY([props.hLine], { stroke: colorPalette[6], strokeDasharray: "6,4", strokeWidth: 2 }));
  if (props.vLine !== null) marks.push(Plot.ruleX([props.vLine], { stroke: colorPalette[6], strokeDasharray: "6,4", strokeWidth: 2 }));

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    marginTop: margin.value.top,
    marginRight: margin.value.right,
    marginBottom: margin.value.bottom,
    marginLeft: margin.value.left,
    style: {
      fontSize: `${props.fontSize}px`,
      fontFamily: defaultFontFamily,
      background: "transparent",
      color: props.fontColor,
    },
    x: {
      label: props.xLabel,
      labelAnchor: "center",
      labelArrow: "none",
      type: "time",
      tickFormat: "%b %d '%y",
      tickRotate: -45,
      interval: "day",
      tickSize: props.tickSize,
      tickPadding: props.tickPadding,
    },
    y: yAxisConfig.value,
    color: props.fill ? {
      legend: props.showLegend,
      style: { fontSize: `${props.fontSize}px` },
      ...(props.legendDomain && { domain: props.legendDomain }),
      range: props.legendRange || colorPalette
    } : {
      legend: false,
      range: colorPalette
    },
    marks,
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
watch(
  () => [
    props.fontSize,
    props.fontColor,
    props.lineColor,
    props.showDots,
    props.dotRadius,
    props.dotColor,
    props.curve,
    props.showGridX,
    props.showGridY,
    props.gridColor,
    props.marginTop,
    props.marginRight,
    props.marginBottom,
    props.marginLeft,
    props.xAxisLabelOffset,
    props.yAxisLabelOffset,
    props.tickSize,
    props.tickPadding,
    props.xLabel,
    props.yLabel,
    props.tooltipDecimalPlaces,
    props.useCustomYDomain,
    props.yDomainMin,
    props.yDomainMax,
    props.yDomainNice,
    props.width,
    props.fill,
    props.legendDomain,
    props.legendRange,
    props.showLegend,
    props.hLine,
    props.vLine,
  ],
  renderChart
);
</script>

<style scoped>

</style>
