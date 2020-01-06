<template>
  <div id="app">
    <div id="wrapper">
      <div id="data">
        <div>
          <div class="logo-wrapper">
            <img class="logo" src="./assets/logo.png" />
            <h1>Fire Overlay</h1>
            <p>Overlay wildfires to get a feeling about the size of the destruction.</p>
          </div>
        </div>

        <div class="selectors">
          <div class="selector selector--fire">
            <h2>Fire:</h2>
            <v-select
              value="2019 Australian Bushfires"
              :clearable="false"
              :options="['2019 Australian Bushfires']"
            ></v-select>
          </div>
          <div class="selector selector--city">
            <h2>City:</h2>
            <v-select
              :value="selectedCity"
              @input="setSelectedCity"
              @search="onSearchCity"
              :clearable="false"
              label="name"
              :options="cities"
            ></v-select>
          </div>
        </div>

        <div class="notice">
          <p style="color:red">The red circle designates the area actively burned down.</p>
          <p style="color:gray">The gray circle designates the area effected by the smoke.</p>
        </div>
        <div class="author">
          <small>
            Made by
            <a target="_blank" href="http://github.com/gokaykucuk/">gokaykucuk</a> &
            <a target="_blank" href="http://fatihgozenc.com">fatihgozenc</a>
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
import "./scss/app.scss";

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
    setSelectedCity: function(newCity) {
      this.selectedCity = newCity;
      this.updateLocation();
    },
    onSearchCity: function(searchString, loading) {
      if (searchString.length < 3) {
        return;
      }
      loading(true);
      this.searchCities(loading, searchString, this);
    },
    updateLocation: function() {
      this.$refs.mainMap.updateSelection(
        this.selectedCity.lat,
        this.selectedCity.lng,
        63000
      );
    },
    searchCities: _.debounce(async (loading, searchParam, vm) => {
      const client = new faunadb.Client({
        secret: FAUNADB_CLIENT_KEY
      });
      const citiesResponse = await client.query(
        q.Map(
          q.Filter(
            q.Paginate(q.Match("all_cities"), { size: 16000 }),
            q.Lambda(
              "X",
              q.StartsWith(
                q.LowerCase(q.Select(["data", "name"], q.Get(q.Var("X")))),
                searchParam
              )
            )
          ),
          q.Lambda("x", q.Get(q.Var("x")))
        )
      );
      vm.cities = citiesResponse.data.map(city => city.data);
      loading(false);
    }, 350)
  }
};
</script>