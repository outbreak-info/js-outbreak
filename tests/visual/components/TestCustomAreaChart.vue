<template>
  <div class="test-container">
    <h1>Custom Area Chart Component Test</h1>
    <CustomAreaChart 
      :aggregatedData="mockData" 
      :firstWeek="firstWeek" 
      :lastWeek="lastWeek"
      :areaChartRange="areaChartRange"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomAreaChart from "../../../src/components/CustomAreaChart.vue";

const firstWeek = 202515;
const lastWeek = 202532;
const areaChartRange = 120;

const mockData = ref([
  {
    "mean_lineage_prevalence": 46.32334355,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 6.542085259999999,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 31.474617980000005,
    "epiweek": 202517,
    "week_end": "2025-04-26",
    "week_start": "2025-04-20",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 12.639901959999994,
    "epiweek": 202517,
    "week_end": "2025-04-26",
    "week_start": "2025-04-20",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 49.87710245,
    "epiweek": 202517,
    "week_end": "2025-04-26",
    "week_start": "2025-04-20",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 3.88461072,
    "epiweek": 202517,
    "week_end": "2025-04-26",
    "week_start": "2025-04-20",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 0.24889036,
    "epiweek": 202517,
    "week_end": "2025-04-26",
    "week_start": "2025-04-20",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 1.8748765899999997,
    "epiweek": 202517,
    "week_end": "2025-04-26",
    "week_start": "2025-04-20",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 8.090149049999999,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 9.017752869999999,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 3.8401016599999998,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 8.844746630000001,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 21.97732459,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 5.00547821,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 25.54654817,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 24.7495936,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 2.24460307,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 26.071682829999993,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 6.135637099999999,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 25.56297429,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 8.05643434,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 19.835675240000004,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 5.03330853,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 9.30428762,
    "epiweek": 202522,
    "week_end": "2025-05-31",
    "week_start": "2025-05-25",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 8.73131805,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 24.05779855,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 0.33061343,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 10.63813199,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 19.058617570000003,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 37.0617105,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 0.12180995,
    "epiweek": 202529,
    "week_end": "2025-07-19",
    "week_start": "2025-07-13",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 8.603102349999999,
    "epiweek": 202528,
    "week_end": "2025-07-12",
    "week_start": "2025-07-06",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 17.836776650000004,
    "epiweek": 202528,
    "week_end": "2025-07-12",
    "week_start": "2025-07-06",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 1.63545375,
    "epiweek": 202528,
    "week_end": "2025-07-12",
    "week_start": "2025-07-06",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 15.484616980000002,
    "epiweek": 202528,
    "week_end": "2025-07-12",
    "week_start": "2025-07-06",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 24.99521619,
    "epiweek": 202528,
    "week_end": "2025-07-12",
    "week_start": "2025-07-06",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 31.444834050000004,
    "epiweek": 202528,
    "week_end": "2025-07-12",
    "week_start": "2025-07-06",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 13.204129969999999,
    "epiweek": 202531,
    "week_end": "2025-08-02",
    "week_start": "2025-07-27",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 8.239556739999998,
    "epiweek": 202531,
    "week_end": "2025-08-02",
    "week_start": "2025-07-27",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 60.66072658999999,
    "epiweek": 202531,
    "week_end": "2025-08-02",
    "week_start": "2025-07-27",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 6.594825080000001,
    "epiweek": 202531,
    "week_end": "2025-08-02",
    "week_start": "2025-07-27",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 4.43702558,
    "epiweek": 202515,
    "week_end": "2025-04-12",
    "week_start": "2025-04-06",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 11.11638694,
    "epiweek": 202515,
    "week_end": "2025-04-12",
    "week_start": "2025-04-06",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 44.78836888,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 1.6794275399999998,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 0.37140267000000005,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 0.22641011,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 0.06896202,
    "epiweek": 202518,
    "week_end": "2025-05-03",
    "week_start": "2025-04-27",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 14.670150749999994,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 11.328832999999998,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 1.9925626399999998,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 47.482073509999985,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 19.34690758,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 0.35404614000000006,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 4.825426360000001,
    "epiweek": 202524,
    "week_end": "2025-06-14",
    "week_start": "2025-06-08",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 28.26946002,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 33.67075251999999,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 4.4950994,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 15.833118259999999,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 9.269168669999999,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 0.25918529,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 8.2032159,
    "epiweek": 202525,
    "week_end": "2025-06-21",
    "week_start": "2025-06-15",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 13.96409423,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 16.80615183,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 7.6227544,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 20.478189589999996,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 14.99967869,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 1.9139712999999998,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 24.215159949999997,
    "epiweek": 202527,
    "week_end": "2025-07-05",
    "week_start": "2025-06-29",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 0.07051752,
    "epiweek": 202531,
    "week_end": "2025-08-02",
    "week_start": "2025-07-27",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 11.230244150000003,
    "epiweek": 202531,
    "week_end": "2025-08-02",
    "week_start": "2025-07-27",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 12.487547389999998,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 16.023889139999994,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 0.031673839999999995,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 8.31866015,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 10.088139509999998,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 0.07436279,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 52.975727179999986,
    "epiweek": 202532,
    "week_end": "2025-08-09",
    "week_start": "2025-08-03",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 23.03405064999992,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 8.049724949999995,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 48.58813456000001,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 17.395023049999995,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 0.88306047,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 1.8547291799999999,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 0.19527741,
    "epiweek": 202519,
    "week_end": "2025-05-10",
    "week_start": "2025-05-04",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 24.061572140000067,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 24.99173986,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 4.40343518,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 41.77530402,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 7.881517339999999,
    "epiweek": 202521,
    "week_end": "2025-05-24",
    "week_start": "2025-05-18",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 14.51284931,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 24.218697940000002,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 41.77732421999999,
    "epiweek": 202515,
    "week_end": "2025-04-12",
    "week_start": "2025-04-06",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 2.3799833500000003,
    "epiweek": 202515,
    "week_end": "2025-04-12",
    "week_start": "2025-04-06",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 40.08071652,
    "epiweek": 202515,
    "week_end": "2025-04-12",
    "week_start": "2025-04-06",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 0.20856356999999998,
    "epiweek": 202515,
    "week_end": "2025-04-12",
    "week_start": "2025-04-06",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 15.270813989999997,
    "epiweek": 202516,
    "week_end": "2025-04-19",
    "week_start": "2025-04-13",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 25.899858860000045,
    "epiweek": 202516,
    "week_end": "2025-04-19",
    "week_start": "2025-04-13",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 55.06276972,
    "epiweek": 202516,
    "week_end": "2025-04-19",
    "week_start": "2025-04-13",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 3.0386187399999995,
    "epiweek": 202516,
    "week_end": "2025-04-19",
    "week_start": "2025-04-13",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 0.7277536700000001,
    "epiweek": 202516,
    "week_end": "2025-04-19",
    "week_start": "2025-04-13",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 0.000185,
    "epiweek": 202516,
    "week_end": "2025-04-19",
    "week_start": "2025-04-13",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 9.333719890000001,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 53.99361365000002,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 7.68227777,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 0.7230909799999998,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 1.2465885300000004,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 2.95913674,
    "epiweek": 202520,
    "week_end": "2025-05-17",
    "week_start": "2025-05-11",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 11.63170575,
    "epiweek": 202523,
    "week_end": "2025-06-07",
    "week_start": "2025-06-01",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 13.37459976,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "Other"
  },
  {
    "mean_lineage_prevalence": 12.391648169999998,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 0.20334317,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 8.63261244,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 11.434639180000003,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 53.61371516,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "XFG*"
  },
  {
    "mean_lineage_prevalence": 0.34944198,
    "epiweek": 202530,
    "week_end": "2025-07-26",
    "week_start": "2025-07-20",
    "geo_loc_region": "California",
    "name": "XEC*"
  },
  {
    "mean_lineage_prevalence": 28.151809569999994,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "BA.2.86*"
  },
  {
    "mean_lineage_prevalence": 0.7015959400000001,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "KP.3*"
  },
  {
    "mean_lineage_prevalence": 12.697662970000001,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "LP.8.1*"
  },
  {
    "mean_lineage_prevalence": 19.716886630000005,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "NB.1.8.1*"
  },
  {
    "mean_lineage_prevalence": 0.0004976100000000001,
    "epiweek": 202526,
    "week_end": "2025-06-28",
    "week_start": "2025-06-22",
    "geo_loc_region": "California",
    "name": "XEC*"
  }
]);
</script>