import { getAllHousePrices } from "../../src/clients/booliClient.mjs";
import {  getMedianIncomes, getPropertyOwnershipRate, getMovingData, getPopulationByYear, getOverCrowdingRate } from "../../src/clients/gothenburgStatisticsClient.mjs";

import { toPriceByYear } from "../../src/mappers/booliMappers.mjs";
import { readCache, writeCache } from "../../src/clients/cache/cache.mjs";
import {  normalizeString } from "../../src/services/normalizerService.mjs";
import { getQueueTimeForPrimaryAreas, getMedianRentForPrimaryAreas } from "../../src/services/rentalInformationService.mjs";

import { config } from "./configuration.mjs";
import primaryAreas from "../../data/primary-area.json" with {type:"json"};

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
  overCrowdingRates,
  queueTimes,
  medianRents}) => Object.keys(medianIncomes).reduce((aggregate, year) => {  
  const primaryArea = medianIncomes[year].reduce((agg, data) => {
    const {area, medianIncome} = data;    

    if(area === "Göteborg") return agg;

    const compareArea = m => normalizeString(m.area) === normalizeString(area);

    const getByYearAndArea = (data, year) => data[year]?.find(compareArea);      

    const propertyPricesData = propertyPrices[year]?.find(compareArea)?.propertyPrices;
    const propertyOwnershipRate = propertyOwnershipRates[year]?.find(compareArea)?.propertyOwnershipRate
    const movingPattern = movingPatterns[year]?.find(compareArea)?.movingPattern
    const population = populations[year]?.find(compareArea)?.population
    const overCrowdingRate = overCrowdingRates[year]?.find(compareArea)?.overCrowdingRate
    const queueTime = queueTimes[year]?.find(compareArea)?.queueTime;
    const medianRent = getByYearAndArea(medianRents, year)?.medianRent;  

   if(!medianIncome) {    
    return agg;
   }

    return [
      ...agg, {
        area, 
        propertyPrices: propertyPricesData, 
        medianIncome, 
        propertyOwnershipRate, 
        movingPattern, 
        population, 
        overCrowdingRate, 
        queueTime,
        medianRent}]
  }, []);

  if(!primaryArea || primaryArea.length === 0) return aggregate;

  return {...aggregate, [year]: {
    primaryArea, 
    gothenburg: {
    medianIncome: medianIncomes[year].slice(-1)[0].medianIncome,
  },}}
},{});

export const collect = async () => {
  const { years, areaMapping } = config;

  const [
    propertyPrices, 
    medianIncomes, 
    propertyOwnershipRates, 
    movingPatterns, 
    populations, 
    overCrowdingRates, 
    queueTimes, 
    medianRents] = await Promise.all([
    getPropertyPricesPerYear(years), 
    getMedianIncomes(years), 
    getPropertyOwnershipRate(years), 
    getMovingData(years),
    getPopulationByYear(years),
    getOverCrowdingRate(years),
    getQueueTimeForPrimaryAreas(years, areaMapping),
    getMedianRentForPrimaryAreas(years, areaMapping)]);          

  const mergedData = mergeDataByYear({
    propertyPrices, 
    medianIncomes, 
    propertyOwnershipRates, 
    movingPatterns, 
    populations, 
    overCrowdingRates, 
    queueTimes,
    medianRents});  
  
  return mergedData;
};
