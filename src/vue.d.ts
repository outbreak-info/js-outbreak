declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Add a new module declaration for your library
declare module "outbreakInfo" {
  import { DefineComponent } from "vue";

  export const BarChart: DefineComponent<{}, {}, any>;
  export const ScatterChart: DefineComponent<{}, {}, any>;
  export const TimeSeriesChart: DefineComponent<{}, {}, any>;
  export const HeatMapChart: DefineComponent<{}, {}, any>;
  export const HistogramChart: DefineComponent<{}, {}, any>;
  export const BoxPlotChart: DefineComponent<{}, {}, any>;
  export const AreaChart: DefineComponent<{}, {}, any>;
  export const SelectBarChart: DefineComponent<{}, {}, any>;
  export const SelectBarChartWithBarGraph: DefineComponent<{}, {}, any>;
  export const MonthlyBarChart: DefineComponent<{}, {}, any>;
  export const PointRangeChart: DefineComponent<{}, {}, any>;
  export const UsChoroplethMap: DefineComponent<{}, {}, any>;
  export const CustomLollipopChart: DefineComponent<{}, {}, any>;
  export const CustomTimeSeriesChart: DefineComponent<{}, {}, any>;
  export const CustomUsChoroplethMap: DefineComponent<{}, {}, any>;
  export const CustomScatterChart: DefineComponent<{}, {}, any>;
  export const CustomHeatmap: DefineComponent<{}, {}, any>;
  export const HelpTooltip: DefineComponent<{}, {}, any>;
  export const TabsWrapper: DefineComponent<{}, {}, any>;
  export const InfoComponent: DefineComponent<{}, {}, any>;
  export const ButtonComponent: DefineComponent<{}, {}, any>;
  export const CheckBox: DefineComponent<{}, {}, any>;
}
