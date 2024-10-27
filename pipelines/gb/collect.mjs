import { getAllHousePrices } from "../../src/clients/booliClient.mjs";
import {  getMedianIncomes } from "../../src/clients/client.mjs";

import { toPriceByYear } from "../../src/mappers/booliMappers.mjs";
import { readCache, writeCache } from "../../src/clients/cache/cache.mjs";

import { config } from "./configuration.mjs";
import primaryAreas from "../commonInputData/primary-area.json" with {type:"json"};

 const getPropertyPricesPerYear = async (years) => {

  const cacheKey = "propertyPricesCache.json";
  const cachedPropertyPricesPerYear = readCache(cacheKey);

  const yearsMissing = cachedPropertyPricesPerYear
    ? years.filter((year) => !Object.keys(cachedPropertyPricesPerYear)?.includes(year))
    : years;

  console.log("Years missing", { yearsMissing });

  if (yearsMissing.length === 0) {
    console.log(`Returning ${cacheKey} cache`);

    return cachedPropertyPricesPerYear;
  }

  const propertyPrices = await getAllHousePrices(yearsMissing);
  const result =  toPriceByYear(propertyPrices, primaryAreas);

  const allPropertiesPrices = { ...cachedPropertyPricesPerYear, ...result };

  writeCache(allPropertiesPrices, cacheKey);

  return allPropertiesPrices;
};

const mergeDataByYear = ({propertyPrices, medianIncomes}) => Object.keys(propertyPrices).reduce((aggregate, year) => {  
  const data = propertyPrices[year].reduce((agg, data) => {
    const {area, propertyPrices} = data;

    const medianIncome = medianIncomes[year]?.find(m => m.area === area)?.medianIncome;

   if(!medianIncome) {
    return agg;
   }

    return [...agg, {area, propertyPrices, medianIncome}]
  }, []);

  if(!data || data.length === 0) return aggregate;

  return {...aggregate, [year]: data}
},{});

export const collect = async () => {
  const { years } = config;

  const [propertyPrices, medianIncomes] = await Promise.all([getPropertyPricesPerYear(years), getMedianIncomes(years)]);  

  const mergedData = mergeDataByYear({propertyPrices, medianIncomes});

  return mergedData;
};
