const http = require("http");
const faunadb = require("faunadb");
const _ = require("lodash");
const q = faunadb.query;

const citiesData = require("./data/cities.json");

const Seeder = {
  seed: async () => {
    const serverClient = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_KEY
    });

    for (let i = 0; i < citiesData.length; i++) {
      const cityData = citiesData[i];
      try {
        await serverClient.query(
          q.Create("cities", {
            data: {
              name: cityData.city,
              name_eng: cityData.city_ascii,
              lat: cityData.lat,
              lng: cityData.lng,
              population: cityData.population
            }
          })
        );
        console.log(`City ${cityData.city} created.`);
      } catch (e) {
        console.log(e);
      }
    }
  }
};

exports.Seeder = Seeder;
Seeder.seed();
