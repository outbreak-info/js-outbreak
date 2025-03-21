// Import components
import BarChart from './components/BarChart.vue'

// Export components
export {
    BarChart
}

// Export default object for Vue.use()
export default {
    install: (app: any) => {
        app.component('BarChart', BarChart)
    }
}