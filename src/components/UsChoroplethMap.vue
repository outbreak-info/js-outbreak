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
  data: {
    type: Array,
    required: true
  },
  colorScheme: {
    type: String,
    default: 'blues'
  },
  valueLabel: {
    type: String,
    default: 'Value'
  }
});

const container = ref(null);
const svgRef = ref(null);
const tooltipRef = ref(null);
let resizeObserver;
let tooltipTimeout;

const calculatePlotHeight = (width) => {
  const baseHeight = 600;
  return width < 768 ? Math.max(300, width * 0.7) : baseHeight;
};

const calculateLegendMargin = (width) => (width < 768 ? 40 : 80);

const showTooltip = (event, content) => {
  const tooltip = tooltipRef.value;
  if (!tooltip) return;

  tooltip.innerHTML = content;

  const offsetX = event.offsetX || event.layerX || 0;
  const offsetY = event.offsetY || event.layerY || 0;

  tooltip.style.left = `${offsetX + 10}px`;
  tooltip.style.top = `${offsetY + 10}px`;
  tooltip.style.visibility = 'visible';
};

const hideTooltip = () => {
  if (tooltipRef.value) {
    tooltipRef.value.style.visibility = 'hidden';
  }
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

      // desktop hover
      path.addEventListener('pointerenter', e => showTooltip(e, label));
      path.addEventListener('pointerleave', hideTooltip);

      // mobile click/tap
      path.addEventListener('click', e => {
        e.stopPropagation();
        showTooltip(e, label);

        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          hideTooltip();
        }, 3000); // auto-hide after 3s
      });
    });

    // hide tooltip when clicking outside on mobile
    plot.addEventListener('click', hideTooltip);
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

onMounted(() => {
  initResponsiveRender();
});

watch(() => props.data, () => {
  if (container.value) {
    renderPlot(container.value.clientWidth);
  }
}, { deep: true });

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
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
  max-width: 100%;
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
