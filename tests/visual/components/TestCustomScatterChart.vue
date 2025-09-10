<template>
  <div class="test-container">
    <h1>Custom Scatter Chart Component Test</h1>
    <CustomScatterChart :data="chartData" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomScatterChart from "../../../src/components/CustomScatterChart.vue";

const chartData = ref([
  {
    name: "Alfa",
    xValue: 10,
    yValue: 15,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Alfa",
  },
  {
    name: "Bravo",
    xValue: 12,
    yValue: 7,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Bravo",
  },
  {
    name: "Charlie",
    xValue: 4,
    yValue: 12,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Charlie",
  },
  {
    name: "Delta",
    xValue: 7,
    yValue: 9,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Delta",
  },
  {
    name: "Echo",
    xValue: 8,
    yValue: 18,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Echo",
  },
  {
    name: "Foxtrot",
    xValue: 13,
    yValue: 3,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Foxtrot",
  },
  {
    name: "Golf",
    xValue: 2,
    yValue: 14,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Golf",
  },
  {
    name: "Hotel",
    xValue: 1,
    yValue: 5,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Hotel",
  },
  {
    name: "India",
    xValue: 0,
    yValue: 11,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#India",
  },
  {
    name: "Juliett",
    xValue: 17,
    yValue: 2,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Juliett",
  },
  {
    name: "Kilo",
    xValue: 15,
    yValue: 17,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Kilo",
  },
  {
    name: "Lima",
    xValue: 14.5,
    yValue: 8,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Lima",
  },
  {
    name: "Mike",
    xValue: 16.8,
    yValue: 19,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Mike",
  },
  {
    name: "November",
    xValue: 22,
    yValue: 6,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#November",
  },
  {
    name: "Oscar",
    xValue: 10.2,
    yValue: 13,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Oscar",
  },
  {
    name: "Papa",
    xValue: 13,
    yValue: 1,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Papa",
  },
  {
    name: "Quebec",
    xValue: 14.5,
    yValue: 16,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Quebec",
  },
  {
    name: "Romeo",
    xValue: 19,
    yValue: 4,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Romeo",
  },
  {
    name: "Sierra",
    xValue: 7.5,
    yValue: 10,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Sierra",
  },
  {
    name: "Tango",
    xValue: 6,
    yValue: 20,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Tango",
  },
  {
    name: "Uniform",
    xValue: 11,
    yValue: 14,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Uniform",
  },
  {
    name: "Victor",
    xValue: 5,
    yValue: 18,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Victor",
  },
  {
    name: "Whiskey",
    xValue: 9,
    yValue: 7,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Whiskey",
  },
  {
    name: "X-ray",
    xValue: 3,
    yValue: 16,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#X-ray",
  },
  {
    name: "Yankee",
    xValue: 12,
    yValue: 12,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Yankee",
  },
  {
    name: "Zulu",
    xValue: 20,
    yValue: 9,
    link: "https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#Zulu",
  },
]);
</script>
