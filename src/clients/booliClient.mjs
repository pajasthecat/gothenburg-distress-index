import { readCache, writeCache } from "./cache/cache.mjs";

export const getHousePrices = async (year, page) => {
  const body = JSON.stringify({
    query: `query searchSold($input: SearchRequest!) {
      search: searchSold(input: $input) {
          pages
          totalCount
          result {
              streetAddress
               soldSqmPrice {
                raw
              }
              soldDate
              soldPrice {
                  raw
                  unit
              }
          }
      }
  }
  `,
    variables: {
      input: {
        filters: [
          {
            key: "maxSoldDate",
            value: `${year}-12-31`,
          },
          {
            key: "minSoldDate",
            value: `${year}-01-01`,
          },
        ],
        areaId: "22",
        sort: "created",
        page: page,
        ascending: false,
      },
    },
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const url = "https://www.booli.se/graphql";

  const response = await fetch(url, requestOptions);

  const searchResult = await response.json();

  const pageMax = searchResult.data.search.pages;
  const prices = searchResult.data.search.result;

  return { prices, pageMax };
};

export const getAllHousePrices = async (years) => {
  const cacheKey = "booliCache.json";
  const cachedPropertyPrices = readCache(cacheKey);

  const yearsMissing = cachedPropertyPrices
    ? years.filter((year) => !Object.keys(cachedPropertyPrices)?.includes(year))
    : years;

  console.log("Years missing", { yearsMissing });

  if (yearsMissing.length === 0) {
    console.log(`Returning ${cacheKey} cache`);

    return cachedPropertyPrices;
  }

  const propertyPrices = (
    await Promise.all(
      years.map(async (year) => {
        let continueFetch = true;
        let page = 0;
        let res = [];

        while (continueFetch) {
          page += 1;
          const { prices, pageMax } = await getHousePrices(year, page);

          res = [...res, prices];

          if (pageMax === page) continueFetch = false;
        }

        return { [year]: res.flat() };
      })
    )
  ).reduce((agg, curr) => {
    const year = Object.keys(curr)[0];
    return { ...agg, [year]: curr[year] };
  }, {});

  const allPropertiesPrices = { ...cachedPropertyPrices, ...propertyPrices };

  writeCache(allPropertiesPrices, cacheKey);

  return allPropertiesPrices;
};
