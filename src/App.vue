<template>
  <div id="app">
    <div id="wrapper">
      <div id="data">
        <v-select
          :value="selectedCity"
          @input="setSelectedCity"
          label="name"
          :options="cities"
        ></v-select>
      </div>
      <div id="map">
        <Map ref="mainMap" :lat="lat" :lng="lng"></Map>
      </div>
    </div>
  </div>
</template>

<script>
import "./utils/constants";
import Map from "./components/Map.vue";
import { Client } from "faunadb";
import { constants } from "buffer";
import _ from "lodash";
const faunadb = require("faunadb");
const q = faunadb.query;

export default {
  name: "app",
  components: {
    Map
  },
  data() {
    return {
      lat: 0,
      lng: 0,
      cities: [],
      selectedCity: null
    };
  },
  async mounted() {
    const client = new faunadb.Client({
      secret: FAUNADB_CLIENT_KEY
    });
    const citiesResponse = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("all_cities"))),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    );
    this.cities = citiesResponse.data.map(city => city.data);
    this.selectedCity = _.sample(this.cities);
    this.lat = this.selectedCity.lat;
    this.lng = this.selectedCity.lng;
    this.updateLocation();
  },
  methods: {
    setSelectedCity(newCity) {
      this.selectedCity = newCity;
      this.updateLocation();
    },
    updateLocation() {
      this.$refs.mainMap.updateFireLocation(
        this.selectedCity.lat,
        this.selectedCity.lng
      );
    }
  }
};
</script>

<style>
html,
body,
#app,
#wrapper {
  height: 100%;
  margin: 0;
}
#wrapper {
  display: grid;
  grid-template-columns: repeat(8, [col-start] 1fr);
}
#data {
  grid-column: col-start 1 / span 3;
  grid-row: 1;
}
#map {
  grid-column: col-start 3 / span 7;
  grid-row: 1;
}
</style>
