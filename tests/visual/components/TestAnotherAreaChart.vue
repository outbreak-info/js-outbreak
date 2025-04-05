<template>
  <div>
    <h2>Average prevalences</h2>
    <AnotherAreaChart
      :data="alaskaTestData"
      :stacked="true"
      xLabel="last epiweek day"
      yLabel="prevalence (%)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AnotherAreaChart from '../../../src/components/AnotherAreaChart.vue';

const alaskaTestData = ref(
[
    {
        "mean_lineage_prevalence": 100.00000001000001,
        "epiweek": 202443,
        "week_end": "2024-10-26",
        "week_start": "2024-10-20",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 53.672934539999986,
        "epiweek": 202444,
        "week_end": "2024-11-02",
        "week_start": "2024-10-27",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 46.32706543,
        "epiweek": 202444,
        "week_end": "2024-11-02",
        "week_start": "2024-10-27",
        "geo_loc_region": "Alaska",
        "name": "XDY"
    },
    {
        "mean_lineage_prevalence": 1.7735622,
        "epiweek": 202445,
        "week_end": "2024-11-09",
        "week_start": "2024-11-03",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 98.22643779000002,
        "epiweek": 202445,
        "week_end": "2024-11-09",
        "week_start": "2024-11-03",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 91.24029035999997,
        "epiweek": 202446,
        "week_end": "2024-11-16",
        "week_start": "2024-11-10",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 4.15163208,
        "epiweek": 202446,
        "week_end": "2024-11-16",
        "week_start": "2024-11-10",
        "geo_loc_region": "Alaska",
        "name": "XEC.4"
    },
    {
        "mean_lineage_prevalence": 4.6080776100000005,
        "epiweek": 202446,
        "week_end": "2024-11-16",
        "week_start": "2024-11-10",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 100.00000001999997,
        "epiweek": 202447,
        "week_end": "2024-11-23",
        "week_start": "2024-11-17",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 97.4277745,
        "epiweek": 202448,
        "week_end": "2024-11-30",
        "week_start": "2024-11-24",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 0.9507224200000001,
        "epiweek": 202448,
        "week_end": "2024-11-30",
        "week_start": "2024-11-24",
        "geo_loc_region": "Alaska",
        "name": "XEC"
    },
    {
        "mean_lineage_prevalence": 1.62150306,
        "epiweek": 202448,
        "week_end": "2024-11-30",
        "week_start": "2024-11-24",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 90.02600052999999,
        "epiweek": 202450,
        "week_end": "2024-12-14",
        "week_start": "2024-12-08",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 5.01470434,
        "epiweek": 202450,
        "week_end": "2024-12-14",
        "week_start": "2024-12-08",
        "geo_loc_region": "Alaska",
        "name": "XEC"
    },
    {
        "mean_lineage_prevalence": 4.959295139999999,
        "epiweek": 202450,
        "week_end": "2024-12-14",
        "week_start": "2024-12-08",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 96.11622905999994,
        "epiweek": 202501,
        "week_end": "2025-01-04",
        "week_start": "2024-12-29",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 0.00306836,
        "epiweek": 202501,
        "week_end": "2025-01-04",
        "week_start": "2024-12-29",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 0.39612294000000003,
        "epiweek": 202501,
        "week_end": "2025-01-04",
        "week_start": "2024-12-29",
        "geo_loc_region": "Alaska",
        "name": "XEC.4"
    },
    {
        "mean_lineage_prevalence": 3.2388218,
        "epiweek": 202501,
        "week_end": "2025-01-04",
        "week_start": "2024-12-29",
        "geo_loc_region": "Alaska",
        "name": "XEC.8"
    },
    {
        "mean_lineage_prevalence": 0.2457577,
        "epiweek": 202501,
        "week_end": "2025-01-04",
        "week_start": "2024-12-29",
        "geo_loc_region": "Alaska",
        "name": "XEW"
    },
    {
        "mean_lineage_prevalence": 48.66989263000001,
        "epiweek": 202502,
        "week_end": "2025-01-11",
        "week_start": "2025-01-05",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 10.623628740000001,
        "epiweek": 202502,
        "week_end": "2025-01-11",
        "week_start": "2025-01-05",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 40.70647864,
        "epiweek": 202502,
        "week_end": "2025-01-11",
        "week_start": "2025-01-05",
        "geo_loc_region": "Alaska",
        "name": "XEC"
    },
    {
        "mean_lineage_prevalence": 53.01225954,
        "epiweek": 202503,
        "week_end": "2025-01-18",
        "week_start": "2025-01-12",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 41.18193078,
        "epiweek": 202503,
        "week_end": "2025-01-18",
        "week_start": "2025-01-12",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 0.35275126,
        "epiweek": 202503,
        "week_end": "2025-01-18",
        "week_start": "2025-01-12",
        "geo_loc_region": "Alaska",
        "name": "XEC.4"
    },
    {
        "mean_lineage_prevalence": 5.45305839,
        "epiweek": 202503,
        "week_end": "2025-01-18",
        "week_start": "2025-01-12",
        "geo_loc_region": "Alaska",
        "name": "XEC.8"
    },
    {
        "mean_lineage_prevalence": 99.99999998999999,
        "epiweek": 202504,
        "week_end": "2025-01-25",
        "week_start": "2025-01-19",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 46.09762109,
        "epiweek": 202508,
        "week_end": "2025-02-22",
        "week_start": "2025-02-16",
        "geo_loc_region": "Alaska",
        "name": "JN.1*"
    },
    {
        "mean_lineage_prevalence": 0.07958872,
        "epiweek": 202508,
        "week_end": "2025-02-22",
        "week_start": "2025-02-16",
        "geo_loc_region": "Alaska",
        "name": "XEC"
    },
    {
        "mean_lineage_prevalence": 0.007585129999999999,
        "epiweek": 202508,
        "week_end": "2025-02-22",
        "week_start": "2025-02-16",
        "geo_loc_region": "Alaska",
        "name": "Other"
    },
    {
        "mean_lineage_prevalence": 15.25431932,
        "epiweek": 202508,
        "week_end": "2025-02-22",
        "week_start": "2025-02-16",
        "geo_loc_region": "Alaska",
        "name": "XEC.4"
    },
    {
        "mean_lineage_prevalence": 38.560885649999996,
        "epiweek": 202508,
        "week_end": "2025-02-22",
        "week_start": "2025-02-16",
        "geo_loc_region": "Alaska",
        "name": "XEW"
    },
]);
</script>
