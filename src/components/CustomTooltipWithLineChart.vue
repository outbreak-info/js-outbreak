<script setup>
import { computed } from "vue";
import { scaleLinear, scaleBand } from 'd3-scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { max } from "d3-array";
import { format } from "d3-format";
import { line, curveBundle } from "d3-shape";
import CustomLineChartWithHighlightedPoint from "./CustomLineChartWithHighlightedPoint.vue";

const props = defineProps({
  width: { type: Number, required: true },
  hoveredCell: { type: Object, required: true },
  tooltipData: { type: Array, required: true },
  xScale: { type: Function, required: true },
  xScaleDomain: { type: Array, required: true },
  xAccessor: { type: Function, required: true },
  yAccessor: { type: Function, required: true },
  colorScale: { type: Function, required: true },
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');
const formatPrevalence = format(',.2f');
const formatPopulation = format(',.0f');
const formatViralLoad = format(',.0f');

const sraIds = computed(() => props.hoveredCell.sra_accession.sort());
const sraIdString = computed(() => sraIds.value.join(', '));
const sampleRowTitle = computed(() => sraIds.value.length > 1 ? 'Samples' : 'Sample' );

const tooltipWidth = computed(() => (props.width > 400 ? 215 : 185));

const fontSize = computed(() => (props.width > 400 ? '14px' : '13px'));

const dateIndex = computed(() =>
  props.xScaleDomain.indexOf(props.hoveredCell.collection_date),
);
const dateArrayLength = props.xScaleDomain.length;
const midPoint = Math.floor(dateArrayLength / 2);

const xNudge = computed(() => setXNudge());

const yNudge = computed(() => setYNudge());

const xPosition = computed(
  () => props.xScale(props.xAccessor(props.hoveredCell)) + xNudge.value,
);

const yPosition = computed(
  () => props.yScale(props.hoveredCelll.name) + yNudge.value,
);

const setXNudge = () => {
  let xPos;
  if (props.width > 400) {
    xPos = dateIndex.value >= midPoint ? -50 : 140;
  } else {
    xPos = dateIndex.value >= midPoint ? -20 : 90;
  }
  return xPos;
};

const setYNudge = () => {
  let yPos;
  if (props.data.length > 1 && props.width > 400) {
    yPos = -120;
  } else {
    yPos = -10;
  }
  return yPos;
}

// Tooltip inline styles
const tooltipWrapperStyle = computed(() => ({
  transform: `translate(${xPosition.value}px, 0px)`,
  width: `${tooltipWidth}px`,
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
  columnGap: "20px",
  fontWeight: "400",
  marginBottom: "10px", 
}

const tooltipBarStyle = computed(() => ({
  position: "absolute",
  height: "7px",
  width: "100%",
  bottom: "0",
  left: "0",
  background: `${props.colorScale(props.hoveredCell.prevalence)}`,
}));
</script>

<template>
  <div :style="tooltipWrapperStyle">
    <div :style="tooltipTitleStyle"> 
      {{ hoveredCell.name }} &#183; {{ hoveredCell.collection_site_id }}   
    </div>
    <div :style="tooltipDateStyle">
      {{ formatTime(parseTime(hoveredCell.collection_date)) }}
    </div>
    <hr :style="tooltipDividerStyle" />
    <div :style="tooltipGridStyle">
      <span>{{ sampleRowTitle }}</span>
      <span class="data">{{ sraIdString }}</span>
      <span>Population</span>
      <span class="data">
        {{ formatPopulation(hoveredCell.ww_population) }}
      </span>
      <span
        v-if="hoveredCell.viral_load != -1.0"
      >
        Viral load
      </span>
      <span
        v-if="hoveredCell.viral_load != -1.0"
        class="data"
      >
        {{ `${formatViralLoad(hoveredCell.viral_load)} copies/L` }}</span
      >
      <span>Prevalence</span>
      <span class="data">
        {{ `${formatPrevalence(hoveredCell.prevalence)}%` }}</span
      >
    </div>
    <div v-if="tooltipData.length > 1 && width > 400">
      <CustomLineChartWithHighlightedPoint
        :width="lineChartWidth"
        :data="tooltipData"
        :xAccessor="xAccessor"
        :xScaleDomain="xScaleDomain"
        :yAccessor="yAccessor"
        :hoveredCell="hoveredCell"
      />
    </div>
    <div>
      <span
        :style="tooltipBarStyle"
      />
    </div>
  </div>
</template>
