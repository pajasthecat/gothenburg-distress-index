import { getAllHousePrices } from "../../src/clients/booliClient.mjs";
import {  getMedianIncomes, getPropertyOwnershipRate, getMovingData, getPopulationByYear, getOverCrowdingRate } from "../../src/clients/gothenburgStatisticsClient.mjs";

import { toPriceByYear } from "../../src/mappers/booliMappers.mjs";
import { readCache, writeCache } from "../../src/clients/cache/cache.mjs";
import {  normalizeString } from "../../src/normalizers.mjs";

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

const mergeDataByYear = ({
  propertyPrices, 
  medianIncomes, 
  propertyOwnershipRates, 
  movingPatterns, 
  populations,
  overCrowdingRates}) => Object.keys(propertyPrices).reduce((aggregate, year) => {  
  const primaryArea = propertyPrices[year].reduce((agg, data) => {
    const {area, propertyPrices} = data;    

    const compare = m => normalizeString(m.area) === normalizeString(area) 

    const medianIncome = medianIncomes[year]?.find(compare)?.medianIncome;
    const propertyOwnershipRate = propertyOwnershipRates[year]?.find(compare)?.propertyOwnershipRate
    const movingPattern = movingPatterns[year]?.find(compare)?.movingPattern
    const population = populations[year]?.find(compare)?.population
    const overCrowdingRate = overCrowdingRates[year]?.find(compare)?.overCrowdingRate

   if(!medianIncome) {
    return agg;
   }

    return [...agg, {area, propertyPrices, medianIncome, propertyOwnershipRate, movingPattern, population, overCrowdingRate}]
  }, []);

  if(!primaryArea || primaryArea.length === 0) return aggregate;

  return {...aggregate, [year]: {primaryArea, gothenburg: {
    medianIncome: medianIncomes[year].slice(-1)[0].medianIncome,
  },}}
},{});

export const collect = async () => {
  const { years } = config;

  const [propertyPrices, medianIncomes, propertyOwnershipRates, movingPatterns, populations, overCrowdingRates] = await Promise.all([
    getPropertyPricesPerYear(years), 
    getMedianIncomes(years), 
    getPropertyOwnershipRate(years), 
    getMovingData(years),
    getPopulationByYear(years),
    getOverCrowdingRate(years)]);  

  const mergedData = mergeDataByYear({propertyPrices, medianIncomes, propertyOwnershipRates, movingPatterns, populations, overCrowdingRates});  

  return mergedData;
};
