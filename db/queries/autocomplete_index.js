CreateIndex({
	name: "cities_autocomplete_5",
	permissions: { read: "public" },
	source: [
		{
			collection: Collection("cities"),
			fields: {
				term: Query(
					Lambda("doc", LowerCase(SubString(Select(["data", "name"], Var("doc")), 0, 5)))
				)
			}
		}
	],
	terms: [{ binding: "term" }]
})