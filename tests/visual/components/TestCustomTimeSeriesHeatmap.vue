<template>
  <div class="test-container">
    <h1>Custom Time-series Heatmap Component Test</h1>
    <CustomTimeSeriesHeatmap
      :aggregatedData="testData"
    />
  </div>
</template>

<script setup>
import CustomTimeSeriesHeatmap from "../../../src/components/CustomTimeSeriesHeatmap.vue";

const testData = [
  {
      "prevalence": 0.010995,
      "collection_date": "2024-11-12",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "Other",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31400247"
      ],
      "viral_load": 19161.199427813,
      "ww_population": 13754
  },
  {
      "prevalence": 99.89755299999999,
      "collection_date": "2024-11-12",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31400247"
      ],
      "viral_load": 19161.199427813,
      "ww_population": 13754
  },
  {
      "prevalence": 5.182987,
      "collection_date": "2024-11-19",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "XEC",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31483473"
      ],
      "viral_load": 96061.3814585822,
      "ww_population": 13754
  },
  {
      "prevalence": 6.947622000000001,
      "collection_date": "2024-11-19",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "LR.1",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31483473"
      ],
      "viral_load": 96061.3814585822,
      "ww_population": 13754
  },
  {
      "prevalence": 8.895161,
      "collection_date": "2024-11-19",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "Other",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31483473"
      ],
      "viral_load": 96061.3814585822,
      "ww_population": 13754
  },
  {
      "prevalence": 69.70905099999999,
      "collection_date": "2024-11-19",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31483473"
      ],
      "viral_load": 96061.3814585822,
      "ww_population": 13754
  },
  {
      "prevalence": 8.955891000000001,
      "collection_date": "2024-11-19",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31483473"
      ],
      "viral_load": 96061.3814585822,
      "ww_population": 13754
  },
  {
      "prevalence": 0.041045,
      "collection_date": "2024-11-19",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.1.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31483473"
      ],
      "viral_load": 96061.3814585822,
      "ww_population": 13754
  },
  {
      "prevalence": 13.982907,
      "collection_date": "2024-11-25",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "XEC",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31636697"
      ],
      "viral_load": 63527.6405437104,
      "ww_population": 13754
  },
  {
      "prevalence": 31.690435,
      "collection_date": "2024-11-25",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "LB.1.2*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31636697"
      ],
      "viral_load": 63527.6405437104,
      "ww_population": 13754
  },
  {
      "prevalence": 34.061048,
      "collection_date": "2024-11-25",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31636697"
      ],
      "viral_load": 63527.6405437104,
      "ww_population": 13754
  },
  {
      "prevalence": 19.161313999999997,
      "collection_date": "2024-11-25",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31636697"
      ],
      "viral_load": 63527.6405437104,
      "ww_population": 13754
  },
  {
      "prevalence": 0.8597880000000001,
      "collection_date": "2024-11-25",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "Other",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31636697"
      ],
      "viral_load": 63527.6405437104,
      "ww_population": 13754
  },
  {
      "prevalence": 63.898799000000004,
      "collection_date": "2024-11-27",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31701713"
      ],
      "viral_load": 53176.3342071795,
      "ww_population": 13754
  },
  {
      "prevalence": 36.033939,
      "collection_date": "2024-11-27",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.1.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31701713"
      ],
      "viral_load": 53176.3342071795,
      "ww_population": 13754
  },
  {
      "prevalence": 0.030489000000000002,
      "collection_date": "2024-12-10",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "Other",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31740610"
      ],
      "viral_load": 84128.5538685973,
      "ww_population": 13754
  },
  {
      "prevalence": 6.06001,
      "collection_date": "2024-12-10",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3.6",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31740610"
      ],
      "viral_load": 84128.5538685973,
      "ww_population": 13754
  },
  {
      "prevalence": 87.748908,
      "collection_date": "2024-12-10",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3.1*",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31740610"
      ],
      "viral_load": 84128.5538685973,
      "ww_population": 13754
  },
  {
      "prevalence": 6.06001,
      "collection_date": "2024-12-10",
      "geo_loc_country": "USA",
      "geo_loc_region": "California",
      "name": "KP.3",
      "collection_site_id": "USA_CA_11702",
      "sra_accession": [
          "SRR31740610"
      ],
      "viral_load": 84128.5538685973,
      "ww_population": 13754
  }];
</script>
