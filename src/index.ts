// Import components
import BarChart from './components/BarChart.vue'
import ScatterChart from './components/ScatterChart.vue'
import TimeSeriesChart from './components/TimeSeriesChart.vue'
import HistogramChart from './components/HistogramChart.vue'
import BoxPlotChart from './components/BoxPlotChart.vue'
import AreaChart from './components/AreaChart.vue'
import SelectBarChart from './components/SelectBarChart.vue'

// Import utilities
import { colorPalette } from './utils/colorSchemes'

// Export components
export {
    BarChart,
    ScatterChart,
    TimeSeriesChart,
    HistogramChart,
    BoxPlotChart,
    AreaChart,
    SelectBarChart
}

export { colorPalette as outbreakInfoColorPalette }

// Export default object for Vue.use()
export default {
    install: (app: any) => {
        app.component('BarChart', BarChart)
        app.component('ScatterChart', ScatterChart)
        app.component('TimeSeriesChart', TimeSeriesChart)
        app.component('HistogramChart', HistogramChart)
        app.component('BoxPlotChart', BoxPlotChart)
        app.component('AreaChart', AreaChart)
        app.component('SelectBarChart', SelectBarChart)
    }
}