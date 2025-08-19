<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <div class="chart-header">
        <div class="chart-controls">
          <n-button type="primary" class="remove-filter-btn" @click="removeFilter">
            Remove {{props.fieldName}} Filter
          </n-button>
        </div>
      </div>
      <div ref="chartContainer" class="bar-chart-container"></div>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import { colorPalette } from "../utils/colorSchemes";
import { themeOverrides } from '../assets/naiveThemeVariables.js'
import { NButton, NConfigProvider } from 'naive-ui'

const props = defineProps({
  data: { type: Array, required: true }, // Expecting [{key: string, value: number}, ...]
  horizontal: { type: Boolean, default: true },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  marginBottom: { type: Number, default: 50 },
  marginLeft: { type: Number, default: 50 },
  barColor: { type: String, default: colorPalette[0] },
  xLabel: { type: String, default: 'value' },
  yLabel: { type: String, default: 'key' },
  hoverBarColor: { type: String, default: colorPalette[1] },
  selectBarColor: { type: String, default: colorPalette[2] },
  fieldName: { type: String, default: null },
  selectedBarKey: { type: Object, default: () => ({key: null, value: null}) },
  xTickFrequency: { type: Number, default: null }
});

const emit = defineEmits(['bar-selected']);

const chartContainer = ref(null);
const selectedBarKey = ref(props.selectedBarKey);
let svg = null;

const removeFilter = () => {
  selectedBarKey.value = {
    key: null,
    value: null
  };
  updateBarColors();
  emit('bar-selected', selectedBarKey.value);
};

const selectBar = (d) => {
  selectedBarKey.value = {
    key: d.key,
    value: d.value
  };
  updateBarColors();
  emit('bar-selected', d);
};

const updateBarColors = () => {
  if (!svg) return;

  svg.selectAll('.bar')
      .attr('fill', d => d.key === selectedBarKey.value.key ? props.selectBarColor : props.barColor)
      .on('mouseover', function(event, d) {
        if (d.key !== selectedBarKey.value.key) {
          d3.select(this).attr('fill', props.hoverBarColor);
        }
      })
      .on('mouseout', function(event, d) {
        if (d.key !== selectedBarKey.value.key) {
          d3.select(this).attr('fill', props.barColor);
        }
      });
};

// Render the chart
const renderChart = () => {
  if (!chartContainer.value || !props.data || props.data.length === 0) return;

  // Clear previous chart if any
  d3.select(chartContainer.value).selectAll('*').remove();

  // Sort data in descending order by value
  const sortedData = [...props.data].sort((a, b) => b.value - a.value);

  // Create the SVG container
  svg = d3.select(chartContainer.value)
      .append('svg')
      .attr('width', props.width)
      .attr('height', props.height);

  // Define dimensions
  const width = props.width - props.marginLeft;
  const height = props.height - props.marginBottom;

  // Create a group for the chart content
  const g = svg.append('g')
      .attr('transform', `translate(${props.marginLeft},10)`);

  if (props.horizontal) {
    // For horizontal bar chart
    // Create scales
    const y = d3.scaleBand()
        .domain(sortedData.map(d => d.key))
        .range([0, height])
        .padding(0.1);

    const x = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.value)])
        .nice()
        .range([0, width]);

    // Add the bars
    g.selectAll('.bar')
        .data(sortedData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', d => y(d.key))
        .attr('x', 0)
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.value))
        .attr('fill', d => d.key === selectedBarKey.value.key ? props.selectBarColor : props.barColor)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          if (d.key !== selectedBarKey.value.key) {
            d3.select(this).attr('fill', props.hoverBarColor);
          }
        })
        .on('mouseout', function(event, d) {
          if (d.key !== selectedBarKey.value.key) {
            d3.select(this).attr('fill', props.barColor);
          }
        })
        .on('click', (event, d) => {
          selectBar(d);
        });

    // Add X axis
    const xAxis = props.xTickFrequency ? d3.axisBottom(x).ticks(props.xTickFrequency) : d3.axisBottom(x);
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    // Add Y axis
    g.append('g')
        .call(d3.axisLeft(y));

  } else {
    // For vertical bar chart
    // Create scales
    const x = d3.scaleBand()
        .domain(sortedData.map(d => d.key))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.value)])
        .nice()
        .range([height, 0]);

    // Add the bars
    g.selectAll('.bar')
        .data(sortedData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', d => d.key === selectedBarKey.value.key ? props.selectBarColor : props.barColor)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          if (d.key !== selectedBarKey.value.key) {
            d3.select(this).attr('fill', props.hoverBarColor);
          }
        })
        .on('mouseout', function(event, d) {
          if (d.key !== selectedBarKey.value.key) {
            d3.select(this).attr('fill', props.barColor);
          }
        })
        .on('click', (event, d) => {
          selectBar(d);
        });

    // Add X axis
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('display', (d, i) => {
          // Show every nth label based on xTickFrequency, or show all if not specified
          return props.xTickFrequency && i % props.xTickFrequency !== 0 ? 'none' : 'block';
        });

    // Add Y axis
    g.append('g')
        .call(d3.axisLeft(y));
  }
};

// Initial render
onMounted(() => {
  renderChart();
});

// Re-render when data changes
watch(() => props.data, () => {
  renderChart();
}, { deep: true });
watch(() => props.selectedBarKey, (newVal) => {
  selectedBarKey.value = newVal;
  updateBarColors();
}, { deep: true });
</script>

<style scoped>

</style>