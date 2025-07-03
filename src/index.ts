// Import components
import BarChart from "./components/BarChart.vue";
import ScatterChart from "./components/ScatterChart.vue";
import TimeSeriesChart from "./components/TimeSeriesChart.vue";
import HeatMapChart from "./components/HeatMapChart.vue";
import HistogramChart from "./components/HistogramChart.vue";
import BoxPlotChart from "./components/BoxPlotChart.vue";
import AreaChart from "./components/AreaChart.vue";
import SelectBarChart from "./components/SelectBarChart.vue";
import SelectBarChartWithBarGraph from "./components/SelectBarChartWithBarGraph.vue";
import TimeSeriesBarChart from "./components/TimeSeriesBarChart.vue";
import PointRangeChart from "./components/PointRangeChart.vue";
import UsChoroplethMap from "./components/UsChoroplethMap.vue";
import CustomLollipopChart from "./components/CustomLollipopChart.vue";

// Import utilities
import { colorPalette } from "./utils/colorSchemes";
import { themeOverrides } from "./assets/naiveThemeVariables";

// Export components
export {
  BarChart,
  ScatterChart,
  TimeSeriesChart,
  HeatMapChart,
  HistogramChart,
  BoxPlotChart,
  AreaChart,
  SelectBarChart,
  SelectBarChartWithBarGraph,
  TimeSeriesBarChart,
  PointRangeChart,
  UsChoroplethMap,
  CustomLollipopChart,
  colorPalette as outbreakInfoColorPalette,
  themeOverrides as outbreakInfoThemeOverrides,
};

// Export default object for Vue.use()
export default {
  install: (app: any) => {
    app.component("BarChart", BarChart);
    app.component("ScatterChart", ScatterChart);
    app.component("TimeSeriesChart", TimeSeriesChart);
    app.component("HeatMapChart", HeatMapChart);
    app.component("HistogramChart", HistogramChart);
    app.component("BoxPlotChart", BoxPlotChart);
    app.component("AreaChart", AreaChart);
    app.component("SelectBarChart", SelectBarChart);
    app.component("SelectBarChartWithBarGraph", SelectBarChartWithBarGraph);
    app.component("TimeSeriesBarChart", TimeSeriesBarChart);
    app.component("PointRangeChart", PointRangeChart);
    app.component("UsChoroplethMap", UsChoroplethMap);
    app.component("CustomLollipopChart", CustomLollipopChart);
  },
};
