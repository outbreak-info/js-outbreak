<script setup>
import { computed } from "vue";
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
  marginLeft: { type: Number, default: 0 },
  marginRight: { type: Number, default: 0 },
  marginTop: { type: Number, default: 0 },
  marginBottom: { type: Number, default: 0 },

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
  labelThreshold: { type: Number, default: 0.05 },

  // Center content
  centerLabel: { type: String, default: null },
  centerValue: { type: [String, Number], default: null },

  // Typography
  fontSize: { type: Number, default: defaultFontSize }
});

// Data accessors
const labelAccessor = (d) => d[props.labelKey];
const valueAccessor = (d) => d[props.valueKey];

// Calculate total value
const totalValue = computed(() => sum(props.data, valueAccessor));

// Format functions
const percentFormat = format(".1%");
const valueFormat = format(",");

// Calculate effective dimensions (accounting for margins)
const effectiveWidth = computed(() => props.width - props.marginLeft - props.marginRight);
const effectiveHeight = computed(() => props.height - props.marginTop - props.marginBottom);

// Calculate chart center position
const centerX = computed(() => props.marginLeft + effectiveWidth.value / 2);
const centerY = computed(() => props.marginTop + effectiveHeight.value / 2);

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

const labelArcGenerator = computed(() =>
  arc()
    .innerRadius(outerRadius.value * 1.25)
    .outerRadius(outerRadius.value * 1.25)
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

// Calculate label position
const getLabelPosition = (slice) => {
  const centroid = labelArcGenerator.value.centroid(slice);
  return { x: centroid[0], y: centroid[1] };
};

// Calculate label anchor
const getLabelAnchor = () => {
  return "middle";
};

// Calculate label text (returns array of lines for multi-line support)
const getLabelText = (slice) => {
  const label = labelAccessor(slice.data);
  if (props.showValues) {
    return [label, valueFormat(valueAccessor(slice.data))];
  }
  if (props.showPercentages) {
    return [label, percentFormat(getPercentage(slice))];
  }
  return [label];
};

// Accessibility
const ariaLabel = computed(() => {
  const totalLabel = props.centerLabel || "Total";
  const totalValueStr = props.centerValue || totalValue.value;
  return `Donut chart showing ${props.data.length} segments. ${totalLabel}: ${totalValueStr}.`;
});
</script>

<template>
  <div style="position: relative; display: inline-block">
    <svg
      role="img"
      :aria-label="ariaLabel"
      :width="width"
      :height="height"
    >
      <title>{{ ariaLabel }}</title>
      <g :transform="`translate(${centerX}, ${centerY})`">
        <!-- Donut slices -->
        <g
          v-for="(slice, index) in pieData"
          :key="`slice-${index}`"
          :aria-label="`${labelAccessor(slice.data)}: ${valueFormat(valueAccessor(slice.data))} (${percentFormat(getPercentage(slice))})`"
        >
          <path
            :d="arcGenerator(slice)"
            :fill="colorScale(labelAccessor(slice.data))"
          />

          <!-- Label text -->
          <text
            v-if="shouldShowLabel(slice)"
            :x="getLabelPosition(slice).x"
            :y="getLabelPosition(slice).y"
            :text-anchor="getLabelAnchor(slice)"
            fill="#000000"
            :font-size="`${fontSize}px`"
          >
            <tspan
              v-for="(line, lineIndex) in getLabelText(slice)"
              :key="lineIndex"
              :x="getLabelPosition(slice).x"
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
  </div>
</template>
