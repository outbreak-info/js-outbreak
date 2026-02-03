<script setup>
import { computed } from "vue";
import { timeParse, timeFormat } from 'd3-time-format';
import { format } from "d3-format";
import CustomLineChartWithHighlightedPoint from "./CustomLineChartWithHighlightedPoint.vue";

const props = defineProps({
  id: { type: String, required: true },
  width: { type: Number, required: true },
  hoveredCell: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  tooltipData: {
    type: Array,
    default: () => [],
  },
  tooltipTitle: {
    type: String,
    default: "",
  },
  xScale: { type: Function, required: true },
  xScaleDomain: { type: Array, required: true },
  yScale: { type: Function, required: true },
  xAccessor: { type: Function, required: true },
  yAccessor: { type: Function, required: true },
  rowAccessor: { type: Function, required: true },
  colorScale: { type: Function, required: true },
  sraAccessor: { type: Function, default: null },
  populationAccessor: { type: Function, default: null},
  viralLoadAccessor: { type: Function, default: null},
  marginLeft: { type: Number, default: 70 },
  marginTop: { type: Number, default: 5 },
  axisHeight: { type: Number, default: 25 },
  containerMarginLeft: { type: Number, default: 10 },
  containerMarginRight: { type: Number, default: 10 },
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');
const formatPrevalence = format(',.2f');
const formatPopulation = format(',.0f');
const formatViralLoad = format(',.0f');

const hovered = computed(() => props.hoveredCell ?? {});

const sraIds = computed(() => {
  if (!props.sraAccessor) return [];
  const value = props.sraAccessor(hovered.value);
  return Array.isArray(value) ? [...value].sort() : [];
});

const sraIdString = computed(() => sraIds.value.join(", "));

const sampleRowTitle = computed(() =>
  sraIds.value.length > 1 ? "Samples" : "Sample"
);

const populationValue = computed(() => {
  return props.populationAccessor
    ? props.populationAccessor(hovered.value)
    : null;
});

const viralLoadValue = computed(() => {
  if (!props.viralLoadAccessor) return null;
  const value = props.viralLoadAccessor(hovered.value);
  return value === -1 ? null : value;
});

const tooltipWidth = computed(() => (props.width > 400 ? 215 : 185));

const shouldRenderGrid = computed(() => {
  return (
    sraIds.value.length > 0 ||
    populationValue.value !== null ||
    viralLoadValue.value !== null ||
    props.yAccessor(hovered.value) !== null
  );
});

// Tooltip positioning
const cellWidth = computed(() => props.xScale.bandwidth());
const cellHeight = computed(() => props.yScale.bandwidth());

const availableWidth = computed(() => 
  props.width - props.containerMarginLeft - props.containerMarginRight
);

const tooltipPosition = computed(() => {
  const cellX = props.xScale(props.xAccessor(hovered.value));
  const cellY = props.yScale(props.rowAccessor(hovered.value));
  
  const cellAbsoluteTop = props.axisHeight + props.marginTop + cellY;
  const cellAbsoluteBottom = cellAbsoluteTop + cellHeight.value;
  
  const gap = 110;
  const yPos = cellAbsoluteBottom + gap;
  
  const absoluteCellX = props.marginLeft + cellX;
  const cellCenterX = absoluteCellX + (cellWidth.value / 2);
  const tooltipHalfWidth = tooltipWidth.value / 2;
  
  let xPos = cellCenterX - tooltipHalfWidth;
  
  const minX = props.marginLeft / 2;
  const maxX = availableWidth.value - tooltipWidth.value - (props.marginLeft / 2);
  
  if (xPos < minX) {
    xPos = minX;
  }
  
  if (xPos > maxX) {
    xPos = maxX;
  }
  
  return { x: xPos, y: yPos };
});

// Tooltip inline styles
const tooltipWrapperStyle = computed(() => ({
  top: `${tooltipPosition.value.y}px`,
  left: `${tooltipPosition.value.x}px`,
  width: `${tooltipWidth.value}px`,
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

const tooltipDateStyle = {
  fontSize: "12px",
  textTransform: "uppercase",
};

const tooltipDividerStyle = {
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
  marginTop: "5px",
  marginBottom: "5px",
};

const tooltipGridStyle = {
  display: "grid",
  rowGap: "1px",
  gridTemplateColumns: "1fr auto",
  columnGap: "10px",
  fontWeight: "400",
  marginBottom: "10px", 
}

const dtStyle = {
  margin: "0",
};

const ddStyle = {
  margin: "0",
  textAlign: "right",
};

const tooltipBarStyle = computed(() => ({
  position: "absolute",
  height: "7px",
  width: "100%",
  bottom: "0",
  left: "0",
  background: `${props.colorScale(props.yAccessor(hovered.value))}`,
}));
</script>

<template>
  <div
    :id="id"
    role="tooltip"
    :style="tooltipWrapperStyle"
  >
    <div v-if="tooltipData" :style="tooltipTitleStyle">
      {{ tooltipTitle }}
    </div>
    <div :style="tooltipDateStyle">
      {{ formatTime(parseTime(xAccessor(hovered))) }}
    </div>
    <hr
      aria-hidden="true"
      :style="tooltipDividerStyle"
    />
    <dl
      v-if="shouldRenderGrid"
      :style="tooltipGridStyle"
    >
      <template v-if="sraIds.length">
        <dt :style="dtStyle">{{ sampleRowTitle }}</dt>
        <dd :style="ddStyle">{{ sraIdString }}</dd>
      </template>

      <template v-if="populationValue !== null">
        <dt :style="dtStyle">Population</dt>
        <dd :style="ddStyle">
          {{ formatPopulation(populationValue) }}
        </dd>
      </template>

      <template v-if="viralLoadValue !== null">
        <dt :style="dtStyle">Viral load</dt>
        <dd :style="ddStyle">
          {{ formatViralLoad(viralLoadValue) }} copies/L
        </dd>
      </template>

      <dt :style="dtStyle">Prevalence</dt>
      <dd :style="ddStyle">
        {{ formatPrevalence(yAccessor(hovered)) }}%
      </dd>
    </dl>

    <div v-if="tooltipData.length > 1 && width > 400">
      <CustomLineChartWithHighlightedPoint
        :width="width"
        :lineChartWidth="tooltipWidth"
        :data="tooltipData"
        :xAccessor="xAccessor"
        :xScaleDomain="xScaleDomain"
        :yAccessor="yAccessor"
        yAxisTitle="prevalence (%)"
        :hoveredCell="hoveredCell"
      />
    </div>
    <div>
      <span
        aria-hidden="true"
        :style="tooltipBarStyle"
      />
    </div>
  </div>
</template>
