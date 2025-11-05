<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  categories: { type: Array, required: true, },
  colorScale: { type: Function, required: true, },

  // Legend position and layout
  align: {
    type: String,
    default: "center", // left | center | right
    validator: (v) => ["left", "center", "right"].includes(v),
  },
  gap: {
    type: String,
    default: "15px",
  },
  direction: {
    type: String,
    default: "row", // row | column
    validator: (v) => ["row", "column"].includes(v),
  },
   maxLabelWidth: {
    type: String,
    default: "none",
  },
  columns: {
    type: Number,
    default: 1,
  },
  responsiveColumns: {
    type: Object,
    default: () => ({}), // e.g. { 768: 2, 480: 1 }
  },

  // Margins
  marginTop: { type: String, default: "10px" },
  marginBottom: { type: String, default: "5px" },
  marginLeft: { type: String, default: "0" },
  marginRight: { type: String, default: "0" },
  textOverflow: {
    type: String,
    default: "wrap", // wrap | truncate
    validator: (v) => ["wrap", "truncate"].includes(v),
  },
});

// Reactive column count (updates with viewport)
const currentColumns = ref(props.columns);

const updateColumns = () => {
  const width = window.innerWidth;
  const breakpoints = Object.entries(props.responsiveColumns)
    .map(([bp, cols]) => [Number(bp), cols])
    .sort((a, b) => b[0] - a[0]); // sort descending by breakpoint width

  for (const [bp, cols] of breakpoints) {
    if (width <= bp) {
      currentColumns.value = cols;
      return;
    }
  }
  currentColumns.value = props.columns;
};

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateColumns);
});

const legendWrapperStyle = computed(() => {
  const isGrid = currentColumns.value > 1;
  let justifyContent = "center";
  if (props.align === "left") justifyContent = "flex-start";
  else if (props.align === "right") justifyContent = "flex-end";

  const baseStyle = {
    marginTop: props.marginTop,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    marginRight: props.marginRight,
  };

  if (isGrid) {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${currentColumns.value}, auto)`,
      justifyContent,
      alignItems: "center",
      gap: props.gap,
      ...baseStyle,
    };
  } else {
    return {
      display: "flex",
      placeItems: "center",
      justifyContent,
      flexDirection: props.direction,
      flexWrap: props.direction === "row" ? "wrap" : "nowrap",
      columnGap: props.direction === "row" ? props.gap : "0",
      rowGap: props.direction === "column" ? props.gap : "0",
      ...baseStyle,
    };
  }
});

const paragraphStyle = computed(() => ({
  margin: "0",
  fontSize: "13px",
  display: "flex",
  placeItems: "center",
  columnGap: "3px",
  maxWidth: props.maxLabelWidth,
  whiteSpace: props.textOverflow === "truncate" ? "nowrap" : "normal",
  overflow: props.textOverflow === "truncate" ? "hidden" : "visible",
  textOverflow: props.textOverflow === "truncate" ? "ellipsis" : "unset",
  flexShrink: 1,
}));

const spanStyle = {
  width: "15px",
  height: "15px",
  display: "inline-block",
  flexShrink: 0,
};
</script>

<template>
  <div :style="legendWrapperStyle">
    <p
      v-for="(category, index) in categories"
      :key="index"
      :style="paragraphStyle"
      :title="props.textOverflow === 'truncate' ? category : undefined"
    >
      <span :style="{ ...spanStyle, background: colorScale(index) }" />
      {{ category }}
    </p>
  </div>
</template>
