<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { defaultColor, colorPalette } from '../utils/colorSchemes';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

const props = defineProps({
  data: { type: Array, required: true },
  dateKey: { type: String, default: 'key' },
  valueKey: { type: String, default: 'value' },
  barColor: { type: String, default: defaultColor },
  lineColor: { type: String, default: colorPalette[1] },
  height: { type: Number, default: 500 },
  width: { type: Number, default: 800 },
  xLabel: { type: String, default: 'Month' },
  yLabel: { type: String, default: 'Count' },
  showCumulativeLine: { type: Boolean, default: true }
});

const chartContainer = ref(null);

function renderChart() {
  if (!props.data || props.data.length === 0 || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';

  const processedData = props.data.map(d => ({
    ...d,
    [props.dateKey]: d[props.dateKey] instanceof Date ? d[props.dateKey] : new Date(d[props.dateKey])
  }));

  processedData.sort((a, b) => a[props.dateKey] - b[props.dateKey]);

  // Calculate monthly sums by binning
  const monthlySums = d3.rollup(processedData,
      v => d3.sum(v, d => d[props.valueKey]), // Sum values in each bin
      d => d3.utcFormat("%Y-%m")(d[props.dateKey]) // Group by YYYY-MM
  );

  // Convert rollup map to array and sort by month
  const sortedMonthlySums = Array.from(monthlySums.entries())
      .map(([key, value]) => ({ month: key, sum: value }))
      .sort((a, b) => a.month.localeCompare(b.month));

  // Calculate cumulative sums based on monthly bins
  let binCumulative = 0;
  const binnedCumulativeData = sortedMonthlySums.map(d => {
      binCumulative += d.sum;
      const [year, month] = d.month.split('-').map(Number); // month is 1-based

      // Use the current month's date for both the x-coordinate and label
      const currentMonthDate = new Date(Date.UTC(year, month - 1, 1)); // month needs to be 0-based
      const monthLabel = d3.utcFormat("%b '%y")(currentMonthDate);

      return {
          [props.dateKey]: currentMonthDate,
          cumulative: binCumulative,
          monthLabel: monthLabel
      };
  });

  const allProcessedDates = processedData.map(d => d[props.dateKey]);
  // Use min/max from processedData for threshold calculation consistency
  const minDate = new Date(Math.min.apply(null, allProcessedDates));
  const maxDate = new Date(Math.max.apply(null, allProcessedDates));
  // Ensure thresholds cover the full range needed for bars
  const monthThresholds = d3.utcMonths(
    new Date(Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth(), 1)), // Start of first month with data
    new Date(Date.UTC(maxDate.getUTCFullYear(), maxDate.getUTCMonth() + 1, 1)), // Start of month *after* last data
    1
  );

  const marks = [
    Plot.rectY(processedData, Plot.binX({ y: "sum" }, { x: props.dateKey, y: props.valueKey, thresholds: monthThresholds, fill: props.barColor })),
    Plot.ruleY([0])
  ];

  if (props.showCumulativeLine) {
    // Use the binned cumulative data for the line and tooltip
    marks.push(
      Plot.line(binnedCumulativeData, { x: props.dateKey, y: "cumulative", stroke: props.lineColor, strokeWidth: 1.5, marker: "dot" }),
      Plot.tip(binnedCumulativeData, Plot.pointer({
        x: props.dateKey,
        y: "cumulative",
        title: d => `Month: ${d.monthLabel}\nCumulative: ${d.cumulative}` // Use the pre-calculated monthLabel
      }))
    );
  }

  // Create chart
  const chart = Plot.plot({
    height: props.height,
    width: props.width,
    x: {
      label: props.xLabel,
      type: "time",
      tickFormat: "%b '%y"
    },
    y: {
      label: props.yLabel,
      grid: true
    },
    marks
  });

  chartContainer.value.appendChild(chart);
}

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });

onBeforeUnmount(() => {
  if (chartContainer.value) {
    chartContainer.value.innerHTML = '';
  }
});
</script>