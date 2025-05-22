<template>
  <div class="choropleth-container" ref="container">
    <svg ref="svgRef" />
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
    default: 'YlGnBu'
  },
  highlightColor: {
    type: String,
    default: '#080808',
  },
});

const container = ref(null);
const svgRef = ref(null);
let resizeObserver;
let activePath = null;
let originalStrokeStyle = null;

const calculatePlotHeight = width => (width < 768 ? Math.max(300, width * 0.7) : 600);
const calculateLegendMargin = width => (width < 768 ? 40 : 80);

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
          tip: {
            format: {
              fill: false,
              stroke: false,
              strokeWidth: false
            }
          },
          title: d => `${d.properties.NAME}\n${props.valueLabel}: No data`
        }
      ),
      Plot.geo(
        features.filter(d => dataMap.has(d.properties.NAME?.toLowerCase())),
        {
          fill: d => dataMap.get(d.properties.NAME?.toLowerCase()),
          stroke: '#000000',
          strokeWidth: 0.5,
          tip: {
            format: {
              fill: props.valueLabel,
              stroke: false,
              strokeWidth: false
            }
          },
          title: d => {
            const name = d.properties.NAME;
            const value = dataMap.get(name.toLowerCase());
            return `${name}\n${props.valueLabel}: ${value}`;
          }
        }
      ),
      Plot.tip(
        features.filter(d => dataMap.has(d.properties.NAME?.toLowerCase())),
        Plot.pointer(Plot.geo({
          title: d => {
            const name = d.properties.NAME;
            const value = dataMap.get(name.toLowerCase());
            return `${name}\n${props.valueLabel}: ${value}`;
          }
        }))
      ),
      Plot.tip(
        features.filter(d => !dataMap.has(d.properties.NAME?.toLowerCase())),
        Plot.pointer(Plot.geo({
          title: d => `${d.properties.NAME}\n${props.valueLabel}: No data`
        }))
      )
    ]
  });

  if (svgRef.value) {
    svgRef.value.replaceWith(plot);
    svgRef.value = plot;

    // hover highlighting
    const paths = plot.querySelectorAll('path');
    paths.forEach(path => {
      const handleHighlight = (target) => {
        if (activePath && activePath !== target) {
          unhighlightPath(activePath);
        }
        activePath = target;
        highlightPath(activePath);
      };

      path.addEventListener('pointerenter', e => {
        handleHighlight(e.currentTarget);
      });

      path.addEventListener('pointerleave', e => {
        if (activePath === e.currentTarget) {
          unhighlightPath(activePath);
          activePath = null;
        }
      });
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
</style>
