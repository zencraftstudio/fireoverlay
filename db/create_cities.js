const faunadb = require("faunadb");
const q = faunadb.query;

const citiesData = require("./data/cities.json");

const Seeder = {
	seed: async () => {
		const serverClient = new faunadb.Client({
			secret: 'fnADhQm_vDACC0g2DkY2s8dvU4Kf5d6lrEvi8T1Q'
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
							lng: cityData.lng
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
