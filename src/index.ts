// Import components
import BarChart from './components/BarChart.vue'
import ScatterChart from './components/ScatterChart.vue'
import TimeSeriesChart from './components/TimeSeriesChart.vue'
import HistogramChart from './components/HistogramChart.vue'
import PrevalenceChart from './components/PrevalenceChart.vue'

// Import utilities
import { colorPalette } from './utils/colorSchemes'

// Export components
export {
    BarChart,
    ScatterChart,
    TimeSeriesChart,
    HistogramChart,
    MutationChart,
    PrevalenceChart
}

export { colorPalette as outbreakInfoColorPalette }

// Export default object for Vue.use()
export default {
    install: (app: any) => {
        app.component('BarChart', BarChart)
        app.component('ScatterChart', ScatterChart)
        app.component('TimeSeriesChart', TimeSeriesChart)
        app.component('HistogramChart', HistogramChart)
        app.component('PrevalenceChart', PrevalenceChart)
    }
}