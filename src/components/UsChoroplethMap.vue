<template>
  <div class="choropleth-container" ref="container">
    <svg ref="svgRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue';
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
let resizeObserver;

// calculate plot height based on screen size
const calculatePlotHeight = (width) => {
  const baseHeight = 600;
  if (width < 768) {
    return Math.max(300, width * 0.7);
  }
  return baseHeight;
};

// calculate legend margin based on screen size
const calculateLegendMargin = (width) => {
  if (width < 768) {
    return 40;
  }
  return 80;
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
      // no-data states in white
      Plot.geo(
        features.filter(d => {
          const name = d.properties.NAME?.toLowerCase();
          return !dataMap.has(name);
        }),
        {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 0.5,
          title: d => `${d.properties.NAME}\n${props.valueLabel}: No data`
        }
      ),

      // states with data using color scale
      Plot.geo(
        features.filter(d => {
          const name = d.properties.NAME?.toLowerCase();
          return dataMap.has(name);
        }),
        {
          fill: d => {
            const name = d.properties.NAME?.toLowerCase();
            return dataMap.get(name);
          },
          stroke: '#000000',
          strokeWidth: 0.5,
          title: d => {
            const name = d.properties.NAME;
            const value = dataMap.get(name?.toLowerCase());
            return `${name}\n${props.valueLabel}: ${value}`;
          }
        }
      )
    ]
  });

  if (svgRef.value) {
    svgRef.value.replaceWith(plot);
    svgRef.value = plot;
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
</style>
