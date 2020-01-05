<template>
  <div id="app">
    <div id="wrapper">
      <div id="data">
        <div>
          <div class="text-center">
            <img class="logo" src="./assets/logo.png" />
            <h1>Fire Overlay</h1>
          </div>
          <p>Overlay wildfires to get a feeling about the size of the destruction.</p>
        </div>
        <div>
          <h2>Fire:</h2>
          <v-select
            value="2019 Australian Bushfires"
            :clearable="false"
            :options="['2019 Australian Bushfires']"
          ></v-select>
        </div>
        <div>
          <h2>City:</h2>
          <v-select
            :value="selectedCity"
            @input="setSelectedCity"
            :clearable="false"
            label="name"
            :options="cities"
          ></v-select>
        </div>
        <div>
          <p style="color:red">The red circle designates the area actively burned down.</p>
          <p style="color:gray">The gray circle designates the area effected by the smoke.</p>
        </div>
        <div>
          <small>
            Made by
            <a target="_blank" href="http://github.com/gokaykucuk/">gokaykucuk</a>
          </small>
        </div>
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
import "./css/app.css";

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
      this.$refs.mainMap.updateSelection(
        this.selectedCity.lat,
        this.selectedCity.lng,
        63000
      );
    }
  }
};
</script>