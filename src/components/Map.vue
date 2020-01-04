<template>
  <l-map :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-circle :lat-lng="marker" :radius="radius"></l-circle>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LCircle } from "vue2-leaflet";

import "leaflet/dist/leaflet.css";
import Vue2LeafletPathTransform from "vue2-leaflet-path-transform";

export default {
  components: {
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-circle": LCircle,
    "v-path-transform": Vue2LeafletPathTransform
  },
  data() {
    return {
      zoom: 6,
      center: L.latLng(47.41322, -1.219482),
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.41322, -1.219482),
      radius: Math.sqrt((4 * Math.pow(10, 10)) / Math.PI)
    };
  }
};
</script>
