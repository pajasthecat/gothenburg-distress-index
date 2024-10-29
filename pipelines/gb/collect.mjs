import { getAllHousePrices } from "../../src/clients/booliClient.mjs";
import {  getMedianIncomes, getPropertyOwnershipRate, getMovingData, getPopulationByYear } from "../../src/clients/gothenburgStatisticsClient.mjs";

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

const mergeDataByYear = ({propertyPrices, medianIncomes, propertyOwnershipRates, movingPatterns, populations}) => Object.keys(propertyPrices).reduce((aggregate, year) => {  
  const primaryArea = propertyPrices[year].reduce((agg, data) => {
    const {area, propertyPrices} = data;    

    const medianIncome = medianIncomes[year]?.find(m => m.area === area)?.medianIncome;
    const propertyOwnershipRate = propertyOwnershipRates[year]?.find(m => m.area === area)?.propertyOwnershipRate
    const movingPattern = movingPatterns[year]?.find(m => m.area === area)?.movingPattern
    const population = populations[year]?.find(m => m.area === area)?.population

   if(!medianIncome) {
    return agg;
   }

    return [...agg, {area, propertyPrices, medianIncome, propertyOwnershipRate, movingPattern, population}]
  }, []);

  if(!primaryArea || primaryArea.length === 0) return aggregate;

  return {...aggregate, [year]: {primaryArea, gothenburg: {
    medianIncome: medianIncomes[year].slice(-1)[0].medianIncome,
  },}}
},{});

export const collect = async () => {
  const { years } = config;

  const [propertyPrices, medianIncomes, propertyOwnershipRates, movingPatterns, populations] = await Promise.all([
    getPropertyPricesPerYear(years), 
    getMedianIncomes(years), 
    getPropertyOwnershipRate(years), 
    getMovingData(years),
    getPopulationByYear(years)]);  

  const mergedData = mergeDataByYear({propertyPrices, medianIncomes, propertyOwnershipRates, movingPatterns, populations});  

  return mergedData;
};
