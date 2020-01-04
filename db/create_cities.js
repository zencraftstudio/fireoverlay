const faunadb = require("faunadb");
const q = faunadb.query;

const citiesData = require("./data/cities.json");

const Seeder = {
  seed: async () => {
    const serverClient = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_KEY
    });

    citiesData.forEach(async cityData => {
      try {
        await serverClient.query(
          q.Create("cities", {
            data: {
              name: cityData.city,
              name_eng: cityData.city_ascii,
              lat: cityData.lat,
              lng: cityData.lng
            }
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
