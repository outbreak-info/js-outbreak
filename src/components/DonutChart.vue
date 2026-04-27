<script setup>
import { computed, ref } from "vue";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { sum } from "d3-array";
import { format } from "d3-format";
import { colorPalette as defaultColorPalette } from "../utils/colorSchemes";
import { defaultFontSize } from "../utils/chartDefaults";

const props = defineProps({
  // Data
  data: { type: Array, required: true },
  labelKey: { type: String, default: "label" },
  valueKey: { type: String, default: "value" },

  // Dimensions
  width: { type: Number, default: 400 },
  height: { type: Number, default: 400 },
  marginLeft: { type: Number, default: null },
  marginRight: { type: Number, default: null },
  marginTop: { type: Number, default: null },
  marginBottom: { type: Number, default: null },

  // Donut configuration
  innerRadiusRatio: { type: Number, default: 0.6 },
  outerRadiusRatio: { type: Number, default: 0.9 },
  padAngle: { type: Number, default: 0.02 },
  cornerRadius: { type: Number, default: 0 },

  // Colors
  colorPalette: { type: Array, default: null },

  // Labels
  showLabels: { type: Boolean, default: true },
  showPercentages: { type: Boolean, default: true },
  showValues: { type: Boolean, default: false },
  labelThreshold: { type: Number, default: 0 },
  showLabelLines: { type: Boolean, default: true },

  // Tooltip
  showProportions: { type: Boolean, default: false },

  // Center content
  centerLabel: { type: String, default: null },
  centerValue: { type: [String, Number], default: null },

  // Typography
  fontSize: { type: Number, default: defaultFontSize },

  percentDecimalPlaces: { type: Number, default: 1 }
});

// Data accessors
const labelAccessor = (d) => d[props.labelKey];
const valueAccessor = (d) => d[props.valueKey];

// Calculate total value
const totalValue = computed(() => sum(props.data, valueAccessor));

// Format functions
const percentFormat = computed(() => format(`.${props.percentDecimalPlaces}%`));
const valueFormat = format(",");

// Estimate text width for auto-margin calculation
const estimatedLabelWidth = computed(() => {
  if (!props.data.length) return 60;
  const maxLabelChars = Math.max(...props.data.map(d => String(d[props.labelKey] || '').length));
  const secondLineChars = props.showValues ? 8 : props.showPercentages ? 6 : 0;
  return Math.max(maxLabelChars, secondLineChars) * props.fontSize * 0.6;
});

// Provisional outer radius (no margins) for auto-margin estimation
const provisionalOuterRadius = computed(() =>
  Math.min(props.width, props.height) / 2 * props.outerRadiusRatio
);

// Auto-margins to prevent label clipping
const autoHorizontalMargin = computed(() => {
  if (!props.showLabels) return 0;
  const labelReach = provisionalOuterRadius.value * 1.4 + 4 + estimatedLabelWidth.value;
  return Math.max(0, labelReach - props.width / 2);
});

const autoVerticalMargin = computed(() => {
  if (!props.showLabels) return 0;
  const lineHeight = props.fontSize * (props.showPercentages || props.showValues ? 2.5 : 1.5);
  const labelReach = provisionalOuterRadius.value * 1.1 + lineHeight;
  return Math.max(0, labelReach - props.height / 2);
});

// Effective margins: use explicit prop if provided, otherwise use auto
const effectiveMarginLeft = computed(() => props.marginLeft ?? autoHorizontalMargin.value);
const effectiveMarginRight = computed(() => props.marginRight ?? autoHorizontalMargin.value);
const effectiveMarginTop = computed(() => props.marginTop ?? autoVerticalMargin.value);
const effectiveMarginBottom = computed(() => props.marginBottom ?? autoVerticalMargin.value);

// Calculate effective dimensions (accounting for margins)
const effectiveWidth = computed(() => props.width - effectiveMarginLeft.value - effectiveMarginRight.value);
const effectiveHeight = computed(() => props.height - effectiveMarginTop.value - effectiveMarginBottom.value);

// Calculate chart center position
const centerX = computed(() => effectiveMarginLeft.value + effectiveWidth.value / 2);
const centerY = computed(() => effectiveMarginTop.value + effectiveHeight.value / 2);

// Calculate radius
const radius = computed(() => Math.min(effectiveWidth.value, effectiveHeight.value) / 2);
const outerRadius = computed(() => radius.value * props.outerRadiusRatio);
const innerRadius = computed(() => radius.value * props.innerRadiusRatio);

// Color scale
const colorScale = computed(() => {
  const colors = props.colorPalette || defaultColorPalette;
  return scaleOrdinal()
    .domain(props.data.map(labelAccessor))
    .range(colors);
});

// Pie generator
const pieGenerator = computed(() =>
  pie()
    .value(valueAccessor)
    .padAngle(props.padAngle)
    .sort(null)
);

// Arc generators
const arcGenerator = computed(() =>
  arc()
    .innerRadius(innerRadius.value)
    .outerRadius(outerRadius.value)
    .cornerRadius(props.cornerRadius)
);

// Transform data
const pieData = computed(() => pieGenerator.value(props.data));

// Calculate percentage for a slice
const getPercentage = (slice) => {
  return slice.value / totalValue.value;
};

// Determine if label should be shown
const shouldShowLabel = (slice) => {
  if (!props.showLabels) return false;
  return getPercentage(slice) >= props.labelThreshold;
};

// Calculate elbow label layout with leader line points
const getLabelLayout = (slice) => {
  const midAngle = (slice.startAngle + slice.endAngle) / 2;
  const isRight = Math.sin(midAngle) >= 0;

  const outerEdgeArc = arc().innerRadius(outerRadius.value).outerRadius(outerRadius.value);
  const [ax, ay] = outerEdgeArc.centroid(slice);

  const midArc = arc().innerRadius(outerRadius.value * 1.1).outerRadius(outerRadius.value * 1.1);
  const [bx, by] = midArc.centroid(slice);

  const elbowX = isRight ? outerRadius.value * 1.4 : -outerRadius.value * 1.4;
  const labelX = isRight ? elbowX + 4 : elbowX - 4;

  return {
    linePoints: `${ax},${ay} ${bx},${by} ${elbowX},${by}`,
    labelX,
    labelY: by,
    anchor: isRight ? "start" : "end"
  };
};

// Calculate label text (returns array of lines for multi-line support)
const getLabelText = (slice) => {
  const label = labelAccessor(slice.data);
  if (props.showValues) {
    return [label + " " + valueFormat(valueAccessor(slice.data))];
  }
  if (props.showPercentages) {
    return [label + " " + percentFormat.value(getPercentage(slice))];
  }
  return [label];
};

// Tooltip state
const tooltip = ref(null); // { x, y, label, proportion }

const onSliceMouseover = (event, slice) => {
  const rect = event.currentTarget.closest('svg').getBoundingClientRect();
  tooltip.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    label: labelAccessor(slice.data),
    proportion: getPercentage(slice)
  };
};

const onSliceMousemove = (event) => {
  if (!tooltip.value) return;
  const rect = event.currentTarget.closest('svg').getBoundingClientRect();
  tooltip.value = { ...tooltip.value, x: event.clientX - rect.left, y: event.clientY - rect.top };
};

const onSliceMouseout = () => {
  tooltip.value = null;
};
</script>

<template>
  <div style="position: relative; display: inline-block">
    <svg
      role="img"
      :width="width"
      :height="height"
    >
      <g :transform="`translate(${centerX}, ${centerY})`">
        <!-- Donut slices -->
        <g
          v-for="(slice, index) in pieData"
          :key="`slice-${index}`"
          @mouseover="showProportions ? onSliceMouseover($event, slice) : null"
          @mousemove="showProportions ? onSliceMousemove($event) : null"
          @mouseout="showProportions ? onSliceMouseout() : null"
          :style="showProportions ? 'cursor: pointer' : ''"
        >
          <path
            :d="arcGenerator(slice)"
            :fill="colorScale(labelAccessor(slice.data))"
          />

          <!-- Leader line -->
          <polyline
            v-if="showLabelLines && shouldShowLabel(slice)"
            :points="getLabelLayout(slice).linePoints"
            fill="none"
            stroke="#aaa"
            stroke-width="1"
          />

          <!-- Label text -->
          <text
            v-if="shouldShowLabel(slice)"
            :x="getLabelLayout(slice).labelX"
            :y="getLabelLayout(slice).labelY"
            :text-anchor="getLabelLayout(slice).anchor"
            fill="#000000"
            :font-size="`${fontSize}px`"
          >
            <tspan
              v-for="(line, lineIndex) in getLabelText(slice)"
              :key="lineIndex"
              :x="getLabelLayout(slice).labelX"
              :dy="lineIndex === 0 ? '0.35em' : '1.2em'"
            >
              {{ line }}
            </tspan>
          </text>
        </g>

        <!-- Center circle background -->
        <circle
          v-if="centerLabel || centerValue"
          :r="innerRadius"
          fill="white"
          opacity="0.9"
        />

        <!-- Center label -->
        <text
          v-if="centerLabel"
          text-anchor="middle"
          dy="-0.3em"
          fill="#000000"
          :font-size="`${fontSize}px`"
          font-weight="600"
        >
          {{ centerLabel }}
        </text>

        <!-- Center value -->
        <text
          v-if="centerValue"
          text-anchor="middle"
          :dy="centerLabel ? '1.2em' : '0.35em'"
          fill="#000000"
          :font-size="`${fontSize}px`"
          font-weight="700"
        >
          {{ centerValue }}
        </text>
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="showProportions && tooltip"
      :style="{
        position: 'absolute',
        left: `${tooltip.x + 12}px`,
        top: `${tooltip.y - 8}px`,
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        padding: '5px 9px',
        borderRadius: '4px',
        fontSize: `${fontSize}px`,
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
      }"
    >
      <div>{{ tooltip.label }}</div>
      <div>{{ percentFormat(tooltip.proportion) }}</div>
    </div>
  </div>
</template>
