const faunadb = require("faunadb");
const q = faunadb.query;

const citiesData = require("./data/cities.json");

const Seeder = {
  seed: async () => {
    const serverClient = new faunadb.Client({
      secret: process.env.FAUNADB_KEY
    });

    citiesData.forEach(async cityData => {
      try {
        const cityParams = {
          name: cityData.city,
          name_eng: cityData.city_ascii,
          lat: cityData.lat,
          long: cityData.long
        };
        await serverClient.query(
          q.Create("cities", {
            data: cityParams
          })
        );
        console.log(`City ${cityParams.name} created.`);
      } catch (e) {
        console.log(e);
      }
    });
  }
};

exports.Seeder = Seeder;
Seeder.seed();
