<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { quadtree } from "d3-quadtree";

const props = defineProps({
  data: { type: Array, required: true },
  xKey: { type: String, default: "xValue" },
  yKey: { type: String, default: "yValue" },
  xAxisLabel: { type: String, default: "x value" },
  yAxisLabel: { type: String, default: "y value" },
  callToAction: { type: String, default: "Click to learn more" },
  height: { type: Number, default: 300 },

  // X-scale domain props
  xDomainType: {
    type: String,
    default: "auto",
    validator: (value) => ["auto", "custom"].includes(value),
  },
  xDomainMin: { type: Number, default: null },
  xDomainMax: { type: Number, default: null },

  // Y-scale domain props
  yDomainType: {
    type: String,
    default: "auto",
    validator: (value) => ["auto", "custom"].includes(value),
  },
  yDomainMin: { type: Number, default: null },
  yDomainMax: { type: Number, default: null },

  // Margins
  marginTop: { type: Number, default: 35 },
  marginRight: { type: Number, default: 130 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 40 },

  // Container margins
  containerMarginTop: { type: Number, default: 0 },
  containerMarginRight: { type: Number, default: 10 },
  containerMarginBottom: { type: Number, default: 0 },
  containerMarginLeft: { type: Number, default: 10 },

  // Color props
  pointColor: { type: String, default: "#d13b62" },
  hoverColor: { type: String, default: "#000dcb" },
});

const width = ref(500);
const hoveredPoint = ref(null);
const xPosition = ref(null);
const yPosition = ref(null);
const tooltipXPosition = ref(null);
const tooltipYPosition = ref(null);
const isTouchDevice = ref(false);
const showRipple = ref(false);
const rippleX = ref(0);
const rippleY = ref(0);

const containerMargins = computed(() => ({
  marginTop: props.containerMarginTop + "px",
  marginRight: props.containerMarginRight + "px",
  marginBottom: props.containerMarginBottom + "px",
  marginLeft: props.containerMarginLeft + "px",
}));

// Device detection
const detectTouchDevice = () => {
  // Check for coarse pointer (touch devices)
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  // Check for touch support
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // Consider small screens as mobile
  const isSmallScreen = window.innerWidth < 768;
  
  return hasCoarsePointer || (hasTouchSupport && isSmallScreen);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleOutsideClick);
  handleResize();
  isTouchDevice.value = detectTouchDevice();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleOutsideClick);
});

const handleResize = () => {
  width.value = window.innerWidth >= 1000 ? 1000 : window.innerWidth;
  isTouchDevice.value = detectTouchDevice();
};

// Handle clicks outside the chart to close tooltip on mobile
const handleOutsideClick = (e) => {
  if (isTouchDevice.value && hoveredPoint.value) {
    const chartContainer = e.target.closest('.chart-container');
    if (!chartContainer) {
      hoveredPoint.value = null;
    }
  }
};

const xAccessor = (d) => d[props.xKey];
const yAccessor = (d) => d[props.yKey];

const marginTop = props.marginTop;
const marginRight = props.marginRight;
const marginBottom = props.marginBottom;
const marginLeft = props.marginLeft;

const innerWidth = computed(() => width.value - marginLeft - marginRight);
const innerHeight = computed(() => props.height - marginTop - marginBottom);

const xScaleDomain = computed(() => {
  if (props.xDomainType === "custom") {
    const minVal =
      props.xDomainMin !== null ? props.xDomainMin : min(props.data, xAccessor);
    const maxVal =
      props.xDomainMax !== null ? props.xDomainMax : max(props.data, xAccessor);
    return [minVal, maxVal];
  } else {
    return [min(props.data, xAccessor), max(props.data, xAccessor)];
  }
});

const xScale = computed(() =>
  scaleLinear().domain(xScaleDomain.value).range([0, innerWidth.value]).nice()
);

const yScaleDomain = computed(() => {
  if (props.yDomainType === "custom") {
    const minVal =
      props.yDomainMin !== null ? props.yDomainMin : min(props.data, yAccessor);
    const maxVal =
      props.yDomainMax !== null ? props.yDomainMax : max(props.data, yAccessor);
    return [minVal, maxVal];
  } else {
    return [min(props.data, yAccessor), max(props.data, yAccessor)];
  }
});

const yScale = computed(() =>
  scaleLinear().domain(yScaleDomain.value).range([innerHeight.value, 0]).nice()
);

const xAccessorScaled = computed(() => (d) => xScale.value(xAccessor(d)));
const yAccessorScaled = computed(() => (d) => yScale.value(yAccessor(d)));

const quadtreeInstance = computed(() =>
  quadtree()
    .x((d) => xScale.value(xAccessor(d)))
    .y((d) => yScale.value(yAccessor(d)))
    .addAll(props.data)
);

const xTicks = computed(() => {
  const numberOfXTicks = Math.floor(innerWidth.value / 80);
  return xScale.value.ticks(numberOfXTicks);
});

const yTicks = computed(() => {
  const numberOfYTicks = Math.floor(innerHeight.value / 40);
  return yScale.value.ticks(numberOfYTicks);
});

const showRippleEffect = (pageX, pageY) => {
  rippleX.value = pageX;
  rippleY.value = pageY;
  showRipple.value = true;
  
  setTimeout(() => {
    showRipple.value = false;
  }, 300);
};

const findPointFromEvent = (e) => {
  const offsetX = e.offsetX - marginLeft;
  const offsetY = e.offsetY - marginTop;
  
  return quadtreeInstance.value.find(offsetX, offsetY);
};

const updateTooltipPosition = (pageX, pageY) => {
  if (width.value >= 800) {
    tooltipXPosition.value = pageX >= 400 ? pageX - 150 : pageX - 20;
  } else {
    tooltipXPosition.value = pageX >= 250 ? pageX - 100 : pageX - 10;
  }
  tooltipYPosition.value = pageY + 20;
};

const handleMouseMove = (e) => {
  if (isTouchDevice.value) return;
  
  const foundPoint = findPointFromEvent(e);
  
  if (foundPoint) {
    hoveredPoint.value = foundPoint;
    updateTooltipPosition(e.pageX, e.pageY);
  }
};

const handleMouseLeave = () => {
  if (!isTouchDevice.value) {
    hoveredPoint.value = null;
  }
};

const handlePointClick = (e) => {
  if (isTouchDevice.value) {
    // Touch device behavior: show tooltip
    e.preventDefault();
    
    const foundPoint = findPointFromEvent(e);
    
    if (foundPoint) {
      // If same point is already selected, hide tooltip
      if (hoveredPoint.value === foundPoint) {
        hoveredPoint.value = null;
      } else {
        hoveredPoint.value = foundPoint;
        updateTooltipPosition(e.pageX, e.pageY);
        showRippleEffect(e.pageX, e.pageY);
      }
    } else {
      hoveredPoint.value = null;
    }
  } else {
    // Desktop behavior: open link
    if (hoveredPoint.value?.link) {
      window.open(hoveredPoint.value.link, "_blank");
    }
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && hoveredPoint.value?.link && !isTouchDevice.value) {
    window.open(hoveredPoint.value.link, "_blank");
  }
  
  if (e.key === "Escape" && hoveredPoint.value) {
    hoveredPoint.value = null;
  }
};

// Chart container inline styles
const chartContainerStyle = computed(() => ({
  position: "relative",
  cursor: isTouchDevice.value ? "pointer" : "default",
  ...containerMargins.value,
}));

// Tooltip inline styles
const tooltipWrapperStyle = computed(() => ({
  left: tooltipXPosition.value + "px",
  top: tooltipYPosition.value + "px",
  width: "140px",
  background: "#ffffff",
  boxShadow: "1px 2px 7px rgba(0, 0, 0, 0.2)",
  borderRadius: "3px",
  position: "absolute",
  padding: "0.5em",
  textAlign: "left",
  fontSize: "13px",
  lineHeight: "18px",
  zIndex: 1000,
  color: "#2c3e50",
}));

const tooltipTitleStyle = {
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "16px",
};

const tooltipDividerStyle = {
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  marginTop: "5px",
  marginBottom: "5px",
};

const tooltipGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  fontWeight: "400",
};

const tooltipDataStyle = { textAlign: "right" };

const tooltipCallToActionStyle = {
  fontSize: "12px",
  marginTop: "5px",
};

// Ripple effect styles
const rippleStyle = computed(() => ({
  position: "fixed",
  left: rippleX.value - 25 + "px",
  top: rippleY.value - 25 + "px",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "rgba(0, 13, 203, 0.3)",
  transform: showRipple.value ? "scale(1)" : "scale(0)",
  transition: "transform 0.3s ease-out",
  pointerEvents: "none",
  zIndex: 999,
}));

const ariaLabel = computed(
  () => `Scatter plot showing ${props.yAxisLabel} versus ${props.xAxisLabel}. ${
    isTouchDevice.value ? "Tap points to see details." : "Hover over points for details, click to visit links."
  }`
);
</script>

<template>
  <div
    class="chart-container"
    :style="chartContainerStyle"
    @keydown="handleKeyDown"
    tabindex="0"
  >
    <svg
      role="img"
      :aria-label="ariaLabel"
      :width="width - containerMarginLeft - containerMarginRight"
      :height="height"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @click="handlePointClick"
    >
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <!-- y-axis -->
        <g>
          <line
            x1="0"
            x2="0"
            :y1="0"
            :y2="innerHeight"
            stroke="#bdc3c7"
            stroke-width="1"
          />
          <text
            x="-12"
            y="-25"
            text-anchor="middle"
            fill="#2c3e50"
            font-size="14px"
            font-weight="700"
          >
            {{ yAxisLabel }}
          </text>
          <g
            v-for="tick in yTicks"
            :key="tick"
            :transform="`translate(0, ${yScale(tick)})`"
          >
            <line x1="0" x2="-6" stroke="#bdc3c7" stroke-width="1" />
            <text
              x="-10"
              dy="0.32em"
              text-anchor="end"
              fill="#2c3e50"
              font-size="14px"
            >
              {{ tick === 0 ? 0 : tick }}
            </text>
          </g>
        </g>

        <!-- x-axis -->
        <g :transform="`translate(0, ${innerHeight})`">
          <line x1="0" :x2="innerWidth" stroke="#bdc3c7" />
          <text
            :x="innerWidth / 2"
            text-anchor="middle"
            y="45"
            fill="#2c3e50"
            font-size="14px"
            font-weight="700"
          >
            {{ xAxisLabel }}
          </text>
          <g
            v-for="(tick, index) in xTicks"
            :key="'tick-' + index"
            :transform="`translate(${xScale(tick)}, 0)`"
          >
            <line :y1="0" :y2="6" stroke="#bdc3c7" />
            <text
              y="10"
              dy="0.8em"
              text-anchor="middle"
              fill="#2c3e50"
              font-size="14px"
            >
              {{ tick === 0 ? 0 : tick }}
            </text>
          </g>
        </g>

        <!-- points -->
        <g>
          <circle
            v-for="(dataPoint, index) in data"
            :key="'point-' + index"
            :r="width > 600 ? 4 : 3"
            :cx="xAccessorScaled(dataPoint)"
            :cy="yAccessorScaled(dataPoint)"
            :fill="pointColor"
          />
        </g>

        <!-- hover effects -->
        <circle
          v-if="hoveredPoint"
          :r="width > 600 ? 6 : 5"
          :cx="xAccessorScaled(hoveredPoint)"
          :cy="yAccessorScaled(hoveredPoint)"
          :fill="hoverColor"
        />
      </g>
    </svg>

    <!-- ripple effect for touch feedback -->
    <div v-if="showRipple && isTouchDevice" :style="rippleStyle"></div>
  </div>

  <!-- tooltip -->
  <div v-if="hoveredPoint" :style="tooltipWrapperStyle">
    <div :style="tooltipTitleStyle">{{ hoveredPoint.name ? hoveredPoint.name : 'Point info' }}</div>
    <hr :style="tooltipDividerStyle" />
    <div :style="tooltipGridStyle">
      <span>{{ xAxisLabel }}</span>
      <span :style="tooltipDataStyle">{{ xAccessor(hoveredPoint) }}</span>
      <span>{{ yAxisLabel }}</span>
      <span :style="tooltipDataStyle">{{ yAccessor(hoveredPoint) }}</span>
    </div>
    <div v-if="hoveredPoint.link && !isTouchDevice" :style="tooltipCallToActionStyle">
      {{ callToAction }}
    </div>
  </div>
</template>
