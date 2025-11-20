<template>
  <div class="test-container">
    <h1>Custom Multiline Chart Component Test</h1>
    <CustomMultiLineChart :data="mockData"/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomMultiLineChart from "../../../src/components/CustomMultiLineChart.vue";

const mockData = ref([
  {
    "label": "Alpha",
	"data": [
	  {
	    "date": "2022-03-01",
		"total_count": 4573,
		"lineage_count": 2946,
		"total_count_rolling": 4223.714285714285,
		"lineage_count_rolling": 2776.5714285714284,
		"proportion": 0.6573767164986809,
		"proportion_ci_lower": 0.6430182611273804,
		"proportion_ci_upper": 0.6716334979657482
	  },
	  {
		"date": "2022-03-02",
		"total_count": 3569,
		"lineage_count": 2142,
		"total_count_rolling": 3922.4285714285716,
		"lineage_count_rolling": 2547.4285714285716,
		"proportion": 0.6494518701970354,
		"proportion_ci_lower": 0.6343745251934276,
		"proportion_ci_upper": 0.6642321711963199
	  },
	  {
		"date": "2022-03-03",
		"total_count": 3024,
		"lineage_count": 1859,
		"total_count_rolling": 3666.285714285714,
		"lineage_count_rolling": 2357.285714285714,
		"proportion": 0.6429629052369077,
		"proportion_ci_lower": 0.6273172563145368,
		"proportion_ci_upper": 0.658327307988267
	  },
	  {
		"date": "2022-03-04",
		"total_count": 2967,
		"lineage_count": 1811,
		"total_count_rolling": 3453.714285714286,
		"lineage_count_rolling": 2181,
		"proportion": 0.6314940436796823,
		"proportion_ci_lower": 0.6152489580335643,
		"proportion_ci_upper": 0.6474144737496544
	  },
	  {
		"date": "2022-03-05",
		"total_count": 1928,
		"lineage_count": 1185,
		"total_count_rolling": 3310.285714285714,
		"lineage_count_rolling": 2081.285714285714,
		"proportion": 0.628732953564647,
		"proportion_ci_lower": 0.6121346569506909,
		"proportion_ci_upper": 0.6450421911002739
	  },
	  {
		"date": "2022-03-06",
		"total_count": 1645,
		"lineage_count": 934,
		"total_count_rolling": 3214.4285714285716,
		"lineage_count_rolling": 1992.7142857142858,
		"proportion": 0.6199280031998577,
		"proportion_ci_lower": 0.6032176213211458,
		"proportion_ci_upper": 0.6367653102890536
	  },
	  {
		"date": "2022-03-07",
		"total_count": 3959,
		"lineage_count": 2261,
		"total_count_rolling": 3095,
		"lineage_count_rolling": 1876.857142857143,
		"proportion": 0.6064158781444726,
		"proportion_ci_lower": 0.5891578171752214,
		"proportion_ci_upper": 0.6235672413281208
	  },
	  {
		"date": "2022-03-08",
		"total_count": 2951,
		"lineage_count": 1608,
		"total_count_rolling": 2863.285714285714,
		"lineage_count_rolling": 1685.7142857142858,
		"proportion": 0.5887342214239386,
		"proportion_ci_lower": 0.5707871898687465,
		"proportion_ci_upper": 0.606818722014504
	  },
	  {
		"date": "2022-03-09",
		"total_count": 2809,
		"lineage_count": 1467,
		"total_count_rolling": 2754.714285714286,
		"lineage_count_rolling": 1589.2857142857142,
		"proportion": 0.5769330498366436,
		"proportion_ci_lower": 0.5582477297250514,
		"proportion_ci_upper": 0.5951300824067938
	  },
	  {
		"date": "2022-03-10",
		"total_count": 2717,
		"lineage_count": 1326,
		"total_count_rolling": 2710.8571428571427,
		"lineage_count_rolling": 1513.142857142857,
		"proportion": 0.5581787521079258,
		"proportion_ci_lower": 0.5393489604463189,
		"proportion_ci_upper": 0.5767203504366123
	  },
	  {
		"date": "2022-03-11",
		"total_count": 2363,
		"lineage_count": 1169,
		"total_count_rolling": 2624.5714285714284,
		"lineage_count_rolling": 1421.4285714285713,
		"proportion": 0.541585020683649,
		"proportion_ci_lower": 0.5222347183192666,
		"proportion_ci_upper": 0.5603408568204591
	  },
	  {
		"date": "2022-03-12",
		"total_count": 1419,
		"lineage_count": 691,
		"total_count_rolling": 2551.8571428571427,
		"lineage_count_rolling": 1350.857142857143,
		"proportion": 0.5293623691429212,
		"proportion_ci_lower": 0.5099991776971681,
		"proportion_ci_upper": 0.5487116325966268
	  },
	  {
		"date": "2022-03-13",
		"total_count": 1531,
		"lineage_count": 642,
		"total_count_rolling": 2535.5714285714284,
		"lineage_count_rolling": 1309.142857142857,
		"proportion": 0.5163107780720041,
		"proportion_ci_lower": 0.4967081731614456,
		"proportion_ci_upper": 0.5355893323671064
	  },
	  {
		"date": "2022-03-14",
		"total_count": 3436,
		"lineage_count": 1513,
		"total_count_rolling": 2460.8571428571427,
		"lineage_count_rolling": 1202.2857142857142,
		"proportion": 0.4885637989086265,
		"proportion_ci_lower": 0.4686936278969808,
		"proportion_ci_upper": 0.5081722769911429
	  },
	  {
		"date": "2022-03-15",
		"total_count": 3155,
		"lineage_count": 1349,
		"total_count_rolling": 2490,
		"lineage_count_rolling": 1165.2857142857142,
		"proportion": 0.46798623063683303,
		"proportion_ci_lower": 0.44831993694986,
		"proportion_ci_upper": 0.48749767701831553
	  },
	  {
		"date": "2022-03-16",
		"total_count": 2793,
		"lineage_count": 1175,
		"total_count_rolling": 2487.714285714286,
		"lineage_count_rolling": 1123.5714285714287,
		"proportion": 0.4516480992305042,
		"proportion_ci_lower": 0.4322787938212949,
		"proportion_ci_upper": 0.4713703267659326
	  },
      {
		"date": "2022-03-17",
		"total_count": 2581,
		"lineage_count": 1024,
		"total_count_rolling": 2468.285714285714,
		"lineage_count_rolling": 1080.4285714285713,
		"proportion": 0.4377242736427827,
		"proportion_ci_lower": 0.4181118588353311,
		"proportion_ci_upper": 0.457236992466511
	  },
	  {
		"date": "2022-03-18",
		"total_count": 2409,
		"lineage_count": 942,
		"total_count_rolling": 2474.8571428571427,
		"lineage_count_rolling": 1048,
		"proportion": 0.4234587854998846,
		"proportion_ci_lower": 0.40406716091452693,
		"proportion_ci_upper": 0.4429804830349164
	  },
	  {
		"date": "2022-03-19",
		"total_count": 1883,
		"lineage_count": 668,
		"total_count_rolling": 2541.1428571428573,
		"lineage_count_rolling": 1044.7142857142858,
		"proportion": 0.4111198560827524,
		"proportion_ci_lower": 0.3922331752936265,
		"proportion_ci_upper": 0.43047968584306173
	  },
	  {
		"date": "2022-03-20",
		"total_count": 1857,
		"lineage_count": 592,
		"total_count_rolling": 2587.714285714286,
		"lineage_count_rolling": 1037.5714285714287,
		"proportion": 0.4009605829744949,
		"proportion_ci_lower": 0.3823183151111142,
		"proportion_ci_upper": 0.4200666305111852
	  },
	  {
		"date": "2022-03-21",
		"total_count": 3646,
		"lineage_count": 1104,
		"total_count_rolling": 2617.714285714286,
		"lineage_count_rolling": 979.1428571428571,
		"proportion": 0.3740449683475224,
		"proportion_ci_lower": 0.35556287440825146,
		"proportion_ci_upper": 0.39261481969112627
	  },
	  {
		"date": "2022-03-22",
		"total_count": 3185,
		"lineage_count": 896,
		"total_count_rolling": 2622,
		"lineage_count_rolling": 914.4285714285714,
		"proportion": 0.3487523155715375,
		"proportion_ci_lower": 0.3305242225689796,
		"proportion_ci_upper": 0.3669875676456933
	  },
	  {
		"date": "2022-03-23",
		"total_count": 3173,
		"lineage_count": 819,
		"total_count_rolling": 2676.285714285714,
		"lineage_count_rolling": 863.5714285714286,
		"proportion": 0.3226753496316857,
		"proportion_ci_lower": 0.3053532501567805,
		"proportion_ci_upper": 0.34076958532194485
	  },
	  {
		"date": "2022-03-24",
		"total_count": 2938,
		"lineage_count": 800,
		"total_count_rolling": 2727.285714285714,
		"lineage_count_rolling": 831.5714285714286,
		"proportion": 0.30490807186632446,
		"proportion_ci_lower": 0.2880291343731078,
		"proportion_ci_upper": 0.3225786890530002
	  },
	  {
		"date": "2022-03-25",
		"total_count": 2673,
		"lineage_count": 623,
		"total_count_rolling": 2765,
		"lineage_count_rolling": 786,
		"proportion": 0.2842676311030741,
		"proportion_ci_lower": 0.2676869898082724,
		"proportion_ci_upper": 0.301299643782938
	  },
	  {
		"date": "2022-03-26",
		"total_count": 2183,
		"lineage_count": 424,
		"total_count_rolling": 2807.8571428571427,
		"lineage_count_rolling": 751.1428571428571,
		"proportion": 0.2675146273212923,
		"proportion_ci_lower": 0.2513241665626133,
		"proportion_ci_upper": 0.2840552285571686
	  },
	  {
		"date": "2022-03-27",
		"total_count": 2228,
		"lineage_count": 444,
		"total_count_rolling": 2860.8571428571427,
		"lineage_count_rolling": 730,
		"proportion": 0.2551682812343953,
		"proportion_ci_lower": 0.23943430581785674,
		"proportion_ci_upper": 0.2713718737798812
	  },
	  {
		"date": "2022-03-28",
		"total_count": 3838,
		"lineage_count": 698,
		"total_count_rolling": 2888.285714285714,
		"lineage_count_rolling": 672,
		"proportion": 0.23266396280542093,
		"proportion_ci_lower": 0.21754911005056318,
		"proportion_ci_upper": 0.2483603308702342
	  },
	  {
		"date": "2022-03-29",
		"total_count": 3406,
		"lineage_count": 560,
		"total_count_rolling": 2919.8571428571427,
		"lineage_count_rolling": 624,
		"proportion": 0.21370908557170118,
		"proportion_ci_lower": 0.19911881223055766,
		"proportion_ci_upper": 0.22884568040471204
	  },
	  {
		"date": "2022-03-30",
		"total_count": 3613,
		"lineage_count": 517,
		"total_count_rolling": 2982.714285714286,
		"lineage_count_rolling": 580.8571428571429,
		"proportion": 0.19474112744863262,
		"proportion_ci_lower": 0.18085868230320754,
		"proportion_ci_upper": 0.2092740139035251
	  },
	  {
		"date": "2022-03-31",
		"total_count": 3370,
		"lineage_count": 518,
		"total_count_rolling": 3044.4285714285716,
		"lineage_count_rolling": 540.5714285714286,
		"proportion": 0.17756088405049034,
		"proportion_ci_lower": 0.1644559393043513,
		"proportion_ci_upper": 0.19160990930071667
	  },
	  {
		"date": "2022-04-01",
		"total_count": 3314,
		"lineage_count": 449,
		"total_count_rolling": 3136,
		"lineage_count_rolling": 515.7142857142857,
		"proportion": 0.16444970845481047,
		"proportion_ci_lower": 0.1518764973564478,
		"proportion_ci_upper": 0.1778239960321282
	  },
	  {
		"date": "2022-04-02",
		"total_count": 2462,
		"lineage_count": 284,
		"total_count_rolling": 3175.8571428571427,
		"lineage_count_rolling": 495.7142857142857,
		"proportion": 0.15608834510368405,
		"proportion_ci_lower": 0.14386181514145585,
		"proportion_ci_upper": 0.1691070679790147
	  },
	  {
		"date": "2022-04-03",
		"total_count": 2360,
		"lineage_count": 242,
		"total_count_rolling": 3194.714285714286,
		"lineage_count_rolling": 466.85714285714283,
		"proportion": 0.1461342395921835,
		"proportion_ci_lower": 0.13423876512408736,
		"proportion_ci_upper": 0.15873370801467337
	  },
	  {
		"date": "2022-04-04",
		"total_count": 5262,
		"lineage_count": 550,
		"total_count_rolling": 3398.1428571428573,
		"lineage_count_rolling": 445.7142857142857,
		"proportion": 0.1311640812208349,
		"proportion_ci_lower": 0.12021532001519399,
		"proportion_ci_upper": 0.14291986936784187
	  },
	  {
		"date": "2022-04-05",
		"total_count": 4545,
		"lineage_count": 447,
		"total_count_rolling": 3560.8571428571427,
		"lineage_count_rolling": 429.57142857142856,
		"proportion": 0.12063708577389072,
		"proportion_ci_lower": 0.11035965108035349,
		"proportion_ci_upper": 0.13176170889637298
	  },
	],
  },
  {
    "label": "Beta",
	"data": [
	  {
		"date": "2022-03-01",
		"total_count": 4573,
		"lineage_count": 134,
		"total_count_rolling": 4223.714285714285,
		"lineage_count_rolling": 103.57142857142857,
		"proportion": 0.02452140972738957,
		"proportion_ci_lower": 0.02026792159025076,
		"proportion_ci_upper": 0.029625444568758676
	  },
	  {
		"date": "2022-03-02",
		"total_count": 3569,
		"lineage_count": 120,
		"total_count_rolling": 3922.4285714285716,
		"lineage_count_rolling": 103,
		"proportion": 0.02625924172342208,
		"proportion_ci_lower": 0.021600972667485983,
		"proportion_ci_upper": 0.03162187331221068
	  },
	  {
		"date": "2022-03-03",
		"total_count": 3024,
		"lineage_count": 111,
		"total_count_rolling": 3666.285714285714,
		"lineage_count_rolling": 104.42857142857143,
		"proportion": 0.02848347880299252,
		"proportion_ci_lower": 0.023360609025002525,
		"proportion_ci_upper": 0.03412104877426451
	  },
	  {
		"date": "2022-03-04",
		"total_count": 2967,
		"lineage_count": 115,
		"total_count_rolling": 3453.714285714286,
		"lineage_count_rolling": 108.28571428571429,
		"proportion": 0.03135340833884845,
		"proportion_ci_lower": 0.025850493861455832,
		"proportion_ci_upper": 0.03747057363119355
	  },
	  {
		"date": "2022-03-05",
		"total_count": 1928,
		"lineage_count": 72,
		"total_count_rolling": 3310.285714285714,
		"lineage_count_rolling": 106.14285714285714,
		"proportion": 0.03206456067667875,
		"proportion_ci_lower": 0.02642890766924105,
		"proportion_ci_upper": 0.038437110971829336
	  },
	  {
		"date": "2022-03-06",
		"total_count": 1645,
		"lineage_count": 54,
		"total_count_rolling": 3214.4285714285716,
		"lineage_count_rolling": 107.57142857142857,
		"proportion": 0.03346517932536332,
		"proportion_ci_lower": 0.027786477845279982,
		"proportion_ci_upper": 0.040258754509836035
	  },
	  {
		"date": "2022-03-07",
		"total_count": 3959,
		"lineage_count": 150,
		"total_count_rolling": 3095,
		"lineage_count_rolling": 108,
		"proportion": 0.03489499192245557,
		"proportion_ci_lower": 0.028858089176512485,
		"proportion_ci_upper": 0.04180099224193868
	  },
	  {
		"date": "2022-03-08",
		"total_count": 2951,
		"lineage_count": 129,
		"total_count_rolling": 2863.285714285714,
		"lineage_count_rolling": 107.28571428571429,
		"proportion": 0.03746944070248965,
		"proportion_ci_lower": 0.030886384389287015,
		"proportion_ci_upper": 0.04479486227191849
	  },
	  {
		"date": "2022-03-09",
		"total_count": 2809,
		"lineage_count": 139,
		"total_count_rolling": 2754.714285714286,
		"lineage_count_rolling": 110,
		"proportion": 0.03993154592127781,
		"proportion_ci_lower": 0.033093007027736696,
		"proportion_ci_upper": 0.04772754360774446
	  },
	  {
		"date": "2022-03-10",
		"total_count": 2717,
		"lineage_count": 151,
		"total_count_rolling": 2710.8571428571427,
		"lineage_count_rolling": 115.71428571428571,
		"proportion": 0.04268549747048904,
		"proportion_ci_lower": 0.03565220737941448,
		"proportion_ci_upper": 0.050900395213266066
	  },
	  {
		"date": "2022-03-11",
		"total_count": 2363,
		"lineage_count": 127,
		"total_count_rolling": 2624.5714285714284,
		"lineage_count_rolling": 117.42857142857143,
		"proportion": 0.04474199869366428,
		"proportion_ci_lower": 0.037172978801348004,
		"proportion_ci_upper": 0.052973214556686646
	  },
	  {
		"date": "2022-03-12",
		"total_count": 1419,
		"lineage_count": 83,
		"total_count_rolling": 2551.8571428571427,
		"lineage_count_rolling": 119,
		"proportion": 0.046632704472932884,
		"proportion_ci_lower": 0.03895768871728285,
		"proportion_ci_upper": 0.05532986129076921
	  },
	  {
		"date": "2022-03-13",
		"total_count": 1531,
		"lineage_count": 81,
		"total_count_rolling": 2535.5714285714284,
		"lineage_count_rolling": 122.85714285714286,
		"proportion": 0.048453433996281485,
		"proportion_ci_lower": 0.0406499603978328,
		"proportion_ci_upper": 0.05738277965057568
	  },
	  {
		"date": "2022-03-14",
		"total_count": 3436,
		"lineage_count": 209,
		"total_count_rolling": 2460.8571428571427,
		"lineage_count_rolling": 131.28571428571428,
		"proportion": 0.05334958783234645,
		"proportion_ci_lower": 0.04488101758473176,
		"proportion_ci_upper": 0.0626296268764633
	  },
	  {
		"date": "2022-03-15",
		"total_count": 3155,
		"lineage_count": 211,
		"total_count_rolling": 2490,
		"lineage_count_rolling": 143,
		"proportion": 0.05742971887550201,
		"proportion_ci_lower": 0.048801024471898165,
		"proportion_ci_upper": 0.06708632724597786
	  },
	  {
		"date": "2022-03-16",
		"total_count": 2793,
		"lineage_count": 169,
		"total_count_rolling": 2487.714285714286,
		"lineage_count_rolling": 147.28571428571428,
		"proportion": 0.05920523716549902,
		"proportion_ci_lower": 0.0503273959600781,
		"proportion_ci_upper": 0.06886471112058314
	  },
	  {
		"date": "2022-03-17",
		"total_count": 2581,
		"lineage_count": 161,
		"total_count_rolling": 2468.285714285714,
		"lineage_count_rolling": 148.71428571428572,
		"proportion": 0.06025002893853456,
		"proportion_ci_lower": 0.05148738581389195,
		"proportion_ci_upper": 0.07028834568125719
	  },
	  {
		"date": "2022-03-18",
		"total_count": 2409,
		"lineage_count": 142,
		"total_count_rolling": 2474.8571428571427,
		"lineage_count_rolling": 150.85714285714286,
		"proportion": 0.06095589933040869,
		"proportion_ci_lower": 0.05208972002019301,
		"proportion_ci_upper": 0.07095627364453562
	  },
	  {
		"date": "2022-03-19",
		"total_count": 1883,
		"lineage_count": 128,
		"total_count_rolling": 2541.1428571428573,
		"lineage_count_rolling": 157.28571428571428,
		"proportion": 0.061895659995502575,
		"proportion_ci_lower": 0.05292046879996324,
		"proportion_ci_upper": 0.07165033497631475
	  },
	  {
		"date": "2022-03-20",
		"total_count": 1857,
		"lineage_count": 147,
		"total_count_rolling": 2587.714285714286,
		"lineage_count_rolling": 166.71428571428572,
		"proportion": 0.06442530639284531,
		"proportion_ci_lower": 0.055546358946571256,
		"proportion_ci_upper": 0.07448402212690265
	  },
	  {
		"date": "2022-03-21",
		"total_count": 3646,
		"lineage_count": 260,
		"total_count_rolling": 2617.714285714286,
		"lineage_count_rolling": 174,
		"proportion": 0.06647020301244269,
		"proportion_ci_lower": 0.05739753781983054,
		"proportion_ci_upper": 0.07648614561572352
	  },
	  {
		"date": "2022-03-22",
		"total_count": 3185,
		"lineage_count": 241,
		"total_count_rolling": 2622,
		"lineage_count_rolling": 178.28571428571428,
		"proportion": 0.06799607714939522,
		"proportion_ci_lower": 0.05873259180287476,
		"proportion_ci_upper": 0.07799481607505244
	  },
      {
		"date": "2022-03-23",
		"total_count": 3173,
		"lineage_count": 261,
		"total_count_rolling": 2676.285714285714,
		"lineage_count_rolling": 191.42857142857142,
		"proportion": 0.07152770364043984,
		"proportion_ci_lower": 0.06208190092954331,
		"proportion_ci_upper": 0.08159491582380228
	  },
	  {
		"date": "2022-03-24",
		"total_count": 2938,
		"lineage_count": 235,
		"total_count_rolling": 2727.285714285714,
		"lineage_count_rolling": 202,
		"proportion": 0.07406631396993348,
		"proportion_ci_lower": 0.06469456051308843,
		"proportion_ci_upper": 0.08435700151026015
	  },
	  {
		"date": "2022-03-25",
		"total_count": 2673,
		"lineage_count": 244,
		"total_count_rolling": 2765,
		"lineage_count_rolling": 216.57142857142858,
		"proportion": 0.07832601394988375,
		"proportion_ci_lower": 0.06889665942489905,
		"proportion_ci_upper": 0.08894716572037668
	  },
	  {
		"date": "2022-03-26",
		"total_count": 2183,
		"lineage_count": 207,
		"total_count_rolling": 2807.8571428571427,
		"lineage_count_rolling": 227.85714285714286,
		"proportion": 0.08114983464767235,
		"proportion_ci_lower": 0.07152428442189251,
		"proportion_ci_upper": 0.0917315966320802
	  },
	  {
		"date": "2022-03-27",
		"total_count": 2228,
		"lineage_count": 182,
		"total_count_rolling": 2860.8571428571427,
		"lineage_count_rolling": 232.85714285714286,
		"proportion": 0.08139418755617697,
		"proportion_ci_lower": 0.07183992448125426,
		"proportion_ci_upper": 0.09188644391355193
	  },
	  {
		"date": "2022-03-28",
		"total_count": 3838,
		"lineage_count": 366,
		"total_count_rolling": 2888.285714285714,
		"lineage_count_rolling": 248,
		"proportion": 0.08586408151152439,
		"proportion_ci_lower": 0.07606824661791428,
		"proportion_ci_upper": 0.09650638665377699
	  },
	  {
		"date": "2022-03-29",
		"total_count": 3406,
		"lineage_count": 303,
		"total_count_rolling": 2919.8571428571427,
		"lineage_count_rolling": 256.85714285714283,
		"proportion": 0.08796907872205098,
		"proportion_ci_lower": 0.07814516274604603,
		"proportion_ci_upper": 0.09869839361058695
	  },
	  {
		"date": "2022-03-30",
		"total_count": 3613,
		"lineage_count": 306,
		"total_count_rolling": 2982.714285714286,
		"lineage_count_rolling": 263.2857142857143,
		"proportion": 0.08827051103980076,
		"proportion_ci_lower": 0.07839014254060792,
		"proportion_ci_upper": 0.0987410466612962
	  },
	  {
		"date": "2022-03-31",
		"total_count": 3370,
		"lineage_count": 309,
		"total_count_rolling": 3044.4285714285716,
		"lineage_count_rolling": 273.85714285714283,
		"proportion": 0.08995354511754491,
		"proportion_ci_lower": 0.08023522152749117,
		"proportion_ci_upper": 0.10057019710895762
	  },
	  {
		"date": "2022-04-01",
		"total_count": 3314,
		"lineage_count": 262,
		"total_count_rolling": 3136,
		"lineage_count_rolling": 276.42857142857144,
		"proportion": 0.08814686588921283,
		"proportion_ci_lower": 0.07847402521384021,
		"proportion_ci_upper": 0.0983063695436619
	  },
	  {
		"date": "2022-04-02",
		"total_count": 2462,
		"lineage_count": 218,
		"total_count_rolling": 3175.8571428571427,
		"lineage_count_rolling": 278,
		"proportion": 0.08753542350771445,
		"proportion_ci_lower": 0.07807783408052815,
		"proportion_ci_upper": 0.09773643053345718
	  },
	  {
		"date": "2022-04-03",
		"total_count": 2360,
		"lineage_count": 233,
		"total_count_rolling": 3194.714285714286,
		"lineage_count_rolling": 285.2857142857143,
		"proportion": 0.08929928900415865,
		"proportion_ci_lower": 0.07968985464986172,
		"proportion_ci_upper": 0.09945770644210807
	  },
	  {
		"date": "2022-04-04",
		"total_count": 5262,
		"lineage_count": 463,
		"total_count_rolling": 3398.1428571428573,
		"lineage_count_rolling": 299.14285714285717,
		"proportion": 0.08803127758859881,
		"proportion_ci_lower": 0.07881832932191167,
		"proportion_ci_upper": 0.09786899727621055
	  },
	  {
		"date": "2022-04-05",
		"total_count": 4545,
		"lineage_count": 411,
		"total_count_rolling": 3560.8571428571427,
		"lineage_count_rolling": 314.57142857142856,
		"proportion": 0.0883414908128059,
		"proportion_ci_lower": 0.07946567989871849,
		"proportion_ci_upper": 0.09811952370446815
	  },
	],	
  }
]);
</script>
