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
import TimeSeriesPointRangeChart from "./components/TimeSeriesPointRangeChart.vue";
import UsChoroplethMap from "./components/UsChoroplethMap.vue";
import CustomLollipopChart from "./components/CustomLollipopChart.vue";
import LoadingSpinner from "./components/LoadingSpinner.vue";
import MultiSelectComponent from "./components/MultiSelectComponent.vue";
import DumbbellChart from "./components/DumbbellChart.vue";
import CustomTimeSeriesChart from "./components/CustomTimeSeriesChart.vue";
import TextInput from "./components/TextInput.vue";
import Divider from "./components/Divider.vue";
import CustomUsChoroplethMap from "./components/CustomUsChoroplethMap.vue";
import HelpTooltip from "./components/HelpTooltip.vue";

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
  TimeSeriesPointRangeChart,
  UsChoroplethMap,
  CustomLollipopChart,
  LoadingSpinner,
  MultiSelectComponent,
  DumbbellChart,
  CustomTimeSeriesChart,
  TextInput,
  Divider,
  CustomUsChoroplethMap,
  HelpTooltip,
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
    app.component("TimeSeriesPointRangeChart", TimeSeriesPointRangeChart);
    app.component("UsChoroplethMap", UsChoroplethMap);
    app.component("CustomLollipopChart", CustomLollipopChart);
    app.component("LoadingSpinner", LoadingSpinner);
    app.component("MultiSelectComponent", MultiSelectComponent);
    app.component("DumbbellChart", DumbbellChart);
    app.component("CustomTimeSeriesChart", CustomTimeSeriesChart);
    app.component("TextInput", TextInput);
    app.component("Divider", Divider);
    app.component("CustomUsChoroplethMap", CustomUsChoroplethMap);
    app.component("HelpTooltip", HelpTooltip);
  },
};
