<template>
  <div class="test-container">
    <h1>Custom Heatmap Component Test</h1>
    <CustomHeatmap :data="chartData"/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomHeatmap from "../../../src/components/CustomHeatmap.vue";

const chartData = ref(
[
  {
    "prevalence": 0.010995,
    "collection_date": "2025-09-01",
    "name": "JN.1.8",
  },
  {
    "prevalence": 99.89755299999999,
    "collection_date": "2025-09-01",
    "name": "KP.3.1*",
  },
  {
    "prevalence": 5.182987,
    "collection_date": "2025-09-02",
    "name": "XEC",
  },
  {
    "prevalence": 6.947622000000001,
    "collection_date": "2025-09-02",
    "name": "LR.1",
  },
  {
    "prevalence": 8.895161,
    "collection_date": "2025-09-02",
    "name": "JN.1.8",
  },
  {
    "prevalence": 69.70905099999999,
    "collection_date": "2025-09-02",
    "name": "KP.3.1*",
  },
  {
    "prevalence": 8.955891000000001,
    "collection_date": "2025-09-02",
    "name": "KP.3",
  },
  {
    "prevalence": 0.041045,
    "collection_date": "2025-09-02",
    "name": "KP.1.1*",
  },
  {
    "prevalence": 13.982907,
    "collection_date": "2025-09-03",
    "name": "XEC",
  },
  {
    "prevalence": 31.690435,
    "collection_date": "2025-09-03",
    "name": "LB.1.2*",
  },
  {
    "prevalence": 34.061048,
    "collection_date": "2025-09-03",
    "name": "KP.3.1*",
  },
  {
    "prevalence": 19.161313999999997,
    "collection_date": "2025-09-03",
    "name": "KP.3",
},
  {
    "prevalence": 0.8597880000000001,
    "collection_date": "2025-09-03",
    "name": "JN.1.8",
  },
  {
    "prevalence": 63.898799000000004,
    "collection_date": "2025-09-04",
    "name": "KP.3.1*",
  },
  {
    "prevalence": 36.033939,
    "collection_date": "2025-09-04",
    "name": "KP.1.1*",
  },
  {
    "prevalence": 0.030489000000000002,
    "collection_date": "2025-09-05",
    "name": "JN.1.8",
  },
  {
    "prevalence": 6.06001,
    "collection_date": "2025-09-05",
    "name": "KP.3.6",
  },
  {
    "prevalence": 87.748908,
    "collection_date": "2025-09-05",
    "name": "KP.3.1*",
  },
  {
    "prevalence": 6.06001,
    "collection_date": "2025-09-05",
    "name": "KP.3",
  }
]);
</script>
