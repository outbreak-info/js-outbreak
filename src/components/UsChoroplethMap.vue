<template>
  <div class="choropleth-container" ref="container">
    <svg ref="svgRef" />
    <div class="tooltip" ref="tooltipRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import * as Plot from '@observablehq/plot';
import usGeoJson from '../assets/geo/us_states.json';

const props = defineProps({
  data: Array,
  valueLabel: {
    type: String,
    default: 'Value'
  },
  colorScheme: {
    type: String,
    default: 'blues'
  },
  highlightColor: {
  type: String,
  default: '#fdb863',
  },
});

const container = ref(null);
const svgRef = ref(null);
const tooltipRef = ref(null);
let resizeObserver;
let tooltipTimeout;
let activePath = null;
let originalStrokeStyle = null;

const calculatePlotHeight = width => (width < 768 ? Math.max(300, width * 0.7) : 600);
const calculateLegendMargin = width => (width < 768 ? 40 : 80);

const showTooltip = (event, content) => {
  const tooltip = tooltipRef.value;
  if (!tooltip) return;

  const bounds = container.value.getBoundingClientRect();
  tooltip.innerHTML = content;
  tooltip.style.left = `${event.clientX - bounds.left + 10}px`;
  tooltip.style.top = `${event.clientY - bounds.top + 10}px`;
  tooltip.style.visibility = 'visible';
};

const hideTooltip = () => {
  const tooltip = tooltipRef.value;
  if (tooltip) tooltip.style.visibility = 'hidden';
};

const highlightPath = (path) => {
  if (!path) return;
  originalStrokeStyle = {
    stroke: path.getAttribute('stroke'),
    strokeWidth: path.getAttribute('stroke-width'),
    filter: path.style.filter
  };
  path.setAttribute('stroke', props.highlightColor);
  path.setAttribute('stroke-width', '2.5');
  path.style.filter = `drop-shadow(0 0 4px ${props.highlightColor})`;
};

const unhighlightPath = (path) => {
  if (!path || !originalStrokeStyle) return;
  path.setAttribute('stroke', originalStrokeStyle.stroke || '#000');
  path.setAttribute('stroke-width', originalStrokeStyle.strokeWidth || '0.5');
  path.style.filter = originalStrokeStyle.filter || '';
};

const renderPlot = (width) => {
  if (!usGeoJson || !props.data) return;

  const features = usGeoJson.features;
  const dataMap = new Map(props.data.map(d => [d.state.toLowerCase(), d.value]));
  const plotHeight = calculatePlotHeight(width);
  const legendMargin = calculateLegendMargin(width);

  const plot = Plot.plot({
    width,
    height: plotHeight,
    marginBottom: legendMargin,
    projection: 'albers-usa',
    color: {
      type: 'quantize',
      scheme: props.colorScheme,
      label: props.valueLabel,
      legend: true
    },
    marks: [
      Plot.geo(
        features.filter(d => !dataMap.has(d.properties.NAME?.toLowerCase())),
        {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 0.5,
          ariaLabel: d => `${d.properties.NAME}<br>${props.valueLabel}: No data`
        }
      ),
      Plot.geo(
        features.filter(d => dataMap.has(d.properties.NAME?.toLowerCase())),
        {
          fill: d => dataMap.get(d.properties.NAME?.toLowerCase()),
          stroke: '#000000',
          strokeWidth: 0.5,
          ariaLabel: d => {
            const name = d.properties.NAME;
            const value = dataMap.get(name.toLowerCase());
            return `${name}<br>${props.valueLabel}: ${value}`;
          }
        }
      )
    ]
  });

  if (svgRef.value) {
    svgRef.value.replaceWith(plot);
    svgRef.value = plot;

    const paths = plot.querySelectorAll('path');
    paths.forEach(path => {
      const label = path.getAttribute('aria-label');
      if (!label) return;

      const handleHighlight = (target) => {
        if (activePath && activePath !== target) {
          unhighlightPath(activePath);
        }
        activePath = target;
        highlightPath(activePath);
      };

      // desktop hover
      path.addEventListener('pointerenter', e => {
        showTooltip(e, label);
        handleHighlight(e.currentTarget);
      });

      path.addEventListener('pointerleave', e => {
        hideTooltip();
        if (activePath === e.currentTarget) {
          unhighlightPath(activePath);
          activePath = null;
        }
      });

      // mobile click/tap
      path.addEventListener('click', e => {
        e.stopPropagation();
        showTooltip(e, label);
        handleHighlight(e.currentTarget);

        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          hideTooltip();
          if (activePath) unhighlightPath(activePath);
          activePath = null;
        }, 3000); // auto-hide after 3s
      });
    });

    // hide tooltip when clicking outside on mobile
    plot.addEventListener('click', () => {
      hideTooltip();
      if (activePath) {
        unhighlightPath(activePath);
        activePath = null;
      }
    });
  }
};

const initResponsiveRender = async () => {
  await nextTick();
  if (!container.value) return;

  const resize = () => {
    const width = container.value.clientWidth;
    renderPlot(width);
  };

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container.value);
  resize();
};

onMounted(initResponsiveRender);

watch(() => props.data, () => {
  if (container.value) renderPlot(container.value.clientWidth);
}, { deep: true });

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  clearTimeout(tooltipTimeout);
});
</script>

<style scoped>
.choropleth-container {
  width: 100%;
  position: relative;
}
svg {
  display: block;
  width: 100%;
  height: auto;
}
.tooltip {
  position: absolute;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 10;
  visibility: hidden;
  transition: opacity 0.1s ease;
}
</style>
