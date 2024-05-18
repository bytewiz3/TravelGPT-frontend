<template>
  <div id="container"></div>
</template>

<script setup>
import { inject, onMounted, onUnmounted, watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

et map = null;
const mapMsg = inject("handleMapMsg", null);
const icons = [
  {
    type: 1,
    icon: "🏨", // hotel
  },
  {
    type: 2,
    icon: "🍽️", // restaurant
  },
];
watch(
  () => mapMsg.value,
  (v) => {
    console.log(v);
    switch (v?.type) {
      case 1:
        setMaket(v);
        break;

      default:
        break;
    }
  },
  {
    deep: true,
  }
);


