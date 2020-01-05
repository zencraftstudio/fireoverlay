<template>
  <l-map :zoom="zoom" :center="mapCenter">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-circle :lat-lng="fireCenter" :radius="radius"></l-circle>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LCircle } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

export default {
  components: {
    "l-map": LMap,
    "l-tile-layer": LTileLayer,
    "l-circle": LCircle
  },
  props: ["lat", "lng"],
  methods: {
    updateFireLocation(lat, lng) {
      this.fireCenter = L.latLng(lat, lng);
      this.mapCenter = L.latLng(lat, lng);
    }
  },
  data() {
    return {
      zoom: 8,
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      radius: 10,
      fireCenter: L.latLng(this.lat, this.lng),
      mapCenter: L.latLng(this.lat, this.lng)
    };
  },
  mounted() {
    this.radius = Math.sqrt((12.35 * Math.pow(10, 6) * 4046.86) / Math.PI);
  }
};
</script>
