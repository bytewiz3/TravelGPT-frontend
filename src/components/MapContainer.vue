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

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "492210b60b207632da3b51a4c4b84111",
  };
  AMapLoader.load({
    key: "5ade7b792cef9a3b3969bc39858fccaf",
    version: "2.0", // Specify the version of JSAPI to load, default is 1.4.15 when omitted
    plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.LineSearch", "AMap.ControlBar"], //List of plugins to be used, such as scale 'AMap.Scale', support adding multiple like: ['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // Set the map container id
        viewMode: "3D", // Whether it is 3D map mode
        pitch: 20, // Map pitch angle, valid range 0 degrees - 83 degrees
        rotateEnable: true, // Whether to enable map rotation interaction, mouse right click + mouse circle movement or keyboard Ctrl + mouse left click circle movement
        pitchEnable: true, // Whether to enable map tilt interaction, mouse right click + mouse up and down movement or keyboard Ctrl + mouse left click up and down movement
        zoom: 11, // Initialize the map level
        center: [116.397428, 39.90923], // Initialize the map center position
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});

// Set marker on the map
function setMaket(data) {
  map.clearMap();
  let list = data.position.map((res) => ({
    position: new AMap.LngLat(res.split(",")[0], res.split(",")[1]),
    text: "Restaurants", // Hotels
    icon: 1,
  }));

  list.forEach((item) => {
    // Marker display content, HTML element string
    const markerContent =
    //   '<div class="font20 icon-sty">' + `${icons[item?.icon - 1]?.icon}` + "</div>";
      '<div class="font20 icon-sty">' + `<img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">` + "</div>";

    const marker = new AMap.Marker({
      position: item.position,
      // Pass html to content
      content: markerContent,
      // [center bottom] of icon as origin
      offset: new AMap.Pixel(-13, -30),
    });
    var newCenter = [data.position[0].split(",")[0], data.position[0].split(",")[1]];
    map.setZoom(9);
    map.setCenter(newCenter);
    // Add markers to the map
    map?.add(marker);
  });
}

// Clear markers
function clearMarker() {
  map.clearMap();
  //   map.remove(marker);
}
</script>


