import { configuration } from "./configuration.js";
import {
  mapMedianIncomes,
  mapPopulation,
  mapResponse,
  mapUnemploymentFigures,
  mapUsse,
  mapGovernmentAssistance,
  mapPropertyOwnershipRate,
  mapMovingData,
  mapPopulationByYear,
} from "../mappers/gothenburgStatisticsMappers.mjs";

export const getMovingData = async (years) => {
  const response = await fetchData(
    configuration.movingData.url,
    configuration.movingData.body(years)
  );

  return mapMovingData(response);
};

export const getPropertyOwnershipRate = async (years) => {
  const response = await fetchData(
    configuration.houseOwnershipRateYears.url,
    configuration.houseOwnershipRateYears.body(years)
  );

  return mapPropertyOwnershipRate(response);
};

export const getMedianIncome = async () => {
  const response = await fetchData(
    configuration.medianIncome.url,
    configuration.medianIncome.body
  );

  return response.data.map((d) => mapResponse(d, "medianIncome"));
};

export const getMedianIncomes = async (years) => {
  const response = await fetchData(
    configuration.medianIncomeYears.url,
    configuration.medianIncomeYears.body(years)
  );

  return mapMedianIncomes(response);
};

export const getGovernmentAssistanceFigures = async () => {
  const response = await fetchData(
    configuration.welfareRecipients.url,
    configuration.welfareRecipients.body
  );

  return mapGovernmentAssistance(response);
};

export const getUnemploymentFigures = async () => {
  const response = await fetchData(
    configuration.unemployment.url,
    configuration.unemployment.body
  );

  return mapUnemploymentFigures(response);
};

export const getPopulation = async () => {
  const response = await fetchData(
    configuration.population.url,
    configuration.population.body
  );

  return mapPopulation(response);
};

export const getPopulationByYear = async (years) => {
  const response = await fetchData(
    configuration.populationByYear.url,
    configuration.populationByYear.body(years)
  );

  return mapPopulationByYear(response);
};

export const getUsse = async () => {
  const response = await fetchData(
    configuration.usse.url,
    configuration.usse.body
  );

  return mapUsse(response);
};

const fetchData = async (url, body) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(body),
  };

  const response = await fetch(url, requestOptions);

  return await response.json();
};
