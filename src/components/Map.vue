<template>
  <l-map :zoom="zoom" :center="mapCenter">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-circle fillColor="red" color="red" :lat-lng="fireCenter" :radius="fireRadius"></l-circle>
    <l-circle fillColor="gray" color="gray" :lat-lng="fireCenter" :radius="smokeRadius"></l-circle>
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
    updateSelection(lat, lng, kmsq) {
      this.fireCenter = L.latLng(lat, lng);
      this.mapCenter = L.latLng(lat, lng);
      this.fireRadius = Math.sqrt(kmsq / Math.PI) * 1000;
    }
  },
  data() {
    return {
      zoom: 6,
      url:
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      fireRadius: Math.sqrt((12.35 * Math.pow(10, 6) * 4046.86) / Math.PI),
      fireCenter: L.latLng(this.lat, this.lng),
      mapCenter: L.latLng(this.lat, this.lng)
    };
  },
  computed: {
    smokeRadius: function() {
      return this.fireRadius * 3;
    }
  }
};
</script>
