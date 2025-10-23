<script setup>
import { timeParse, timeFormat } from 'd3-time-format';

const props = defineProps({
  width: Number,
  hoveredDate: String,
});

const formatTime = timeFormat('%b %e, %Y');
const parseTime = timeParse('%Y-%m-%d');

const tooltipWidth = 320;
const xPosition = 50;
</script>

<template>
  <div
    class="tooltip-wrapper"
    :style="{
      transform: `translate(${xPosition}px, 0px)`,
      width: `${tooltipWidth}px`,
    }"
  >
    <div class="title"> 
      San Diego, CA, USA
    </div>
    <div class="date">
      {{ formatTime(parseTime(hoveredDate)) }}
      <hr class="divider" />
    </div>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  background: #ffffff;
  box-shadow: 1px 2px 7px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  position: absolute;
  padding: 0.5em;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  z-index: 2;
  color: '#2c3e50';
}
.title {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
}
.date {
  font-size: 12px;
  text-transform: uppercase;
}
.divider {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
