<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from "vue";
import { defaultColor } from "../utils/colorSchemes";
import * as Plot from "@observablehq/plot";

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: "key" },
  valueKey: { type: String, default: "value" },
  lineColor: { type: String, default: defaultColor },
  height: { type: Number, default: 350 },
  xLabel: { type: String, default: "Date" },
  yLabel: { type: String, default: "Count" },

  // Typography
  fontSize: { type: Number, default: 12 },
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
  marginRight: { type: Number, default: 0 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 140 },

  // Axis styling
  xAxisLabelOffset: { type: Number, default: 35 },
  yAxisLabelOffset: { type: Number, default: 45 },
  tickSize: { type: Number, default: 6 },
  tickPadding: { type: Number, default: 8 },

  // Container margins
  containerLeftMargin: { type: Number, default: 50 },
  containerRightMargin: { type: Number, default: 50 },
});

const chartContainer = ref(null);
const width = ref(500);

const margin = computed(() => ({
  top: props.marginTop,
  right: props.marginRight,
  bottom: props.marginBottom,
  left: props.marginLeft,
}));

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  if (window.innerWidth >= 1000) {
    width.value = 1000;
  } else {
    width.value = window.innerWidth;
  }
  renderChart();
};

const innerWidth = computed(
  () => width.value - margin.value.left - margin.value.right
);
const innerHeight = computed(
  () => props.height - margin.value.top - margin.value.bottom
);

// Computed dot color (falls back to line color if not specified)
const effectiveDotColor = computed(() => props.dotColor || props.lineColor);

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

  // Main line
  marks.push(
    Plot.line(processedData, {
      x: props.dateKey,
      y: props.valueKey,
      stroke: props.lineColor,
      strokeWidth: 2,
      curve: props.curve,
    })
  );

  // Data points
  if (props.showDots) {
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

  // Tooltip
  marks.push(
    Plot.tip(
      processedData,
      Plot.pointer({
        x: props.dateKey,
        y: props.valueKey,
        title: (d) =>
          `${d[props.dateKey].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}\n${props.yLabel}: ${d[props.valueKey]}`,
        fontSize: props.fontSize,
        fill: "white",
        stroke: "#ccc",
        strokeWidth: 1,
        r: 4,
      })
    )
  );

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: width.value - props.containerLeftMargin - props.containerRightMargin,
    marginTop: margin.value.top,
    marginRight: margin.value.right,
    marginBottom: margin.value.bottom,
    marginLeft: margin.value.left,
    style: {
      fontSize: `${props.fontSize}px`,
      fontFamily: "inherit",
      background: "transparent",
      color: props.fontColor,
    },
    x: {
      label: props.xLabel,
      type: "time",
      labelOffset: props.xAxisLabelOffset,
      tickSize: props.tickSize,
      tickPadding: props.tickPadding,
    },
    y: {
      label: props.yLabel,
      grid: true,
      labelOffset: props.yAxisLabelOffset,
      tickSize: props.tickSize,
      tickPadding: props.tickPadding,
      nice: true,
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
    props.containerLeftMargin,
    props.containerRightMargin,
    props.xLabel,
    props.yLabel,
  ],
  renderChart
);
</script>

<style scoped>
.chart-container {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  text-align: left;
  margin-top: 15px;
  margin-bottom: 20px;
}
.chart-container :deep(svg) {
  font-family: inherit;
}
.chart-container :deep(.plot-axis text) {
  font-size: v-bind(fontSize + "px");
  fill: v-bind(fontColor);
}
.chart-container :deep(.plot-axis-label) {
  font-size: v-bind((fontSize + 1) + "px");
  font-weight: 500;
  fill: v-bind(fontColor);
}
.chart-container :deep(.plot-tip) {
  font-size: v-bind(fontSize + "px");
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
