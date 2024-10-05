import {
  getUnemploymentFigures,
  getPopulation,
  getMedianIncome,
  getUsse,
  getGovernmentAssistanceFigures,
} from "../src/clients/client.mjs";

import { readFileSync } from "fs";

const groupByYear = (
  unemployment,
  populationData,
  medianIncomeData,
  usse,
  governmentWelfare
) =>
  unemployment.reduce((agg, { year, area, unemployed }) => {
    const YEAR_AND_AREA_CONDITIONAL = (_) => _.year === year && _.area === area;

    const yearIndex = agg.findIndex((a) => a.year === year);

    const { population } = populationData.find(YEAR_AND_AREA_CONDITIONAL);
    const { medianIncome } = medianIncomeData.find(YEAR_AND_AREA_CONDITIONAL);
    const { nonEligible, eligible } = usse.find(YEAR_AND_AREA_CONDITIONAL);
    const { populationOnGovernmentAssistance } = governmentWelfare.find(
      YEAR_AND_AREA_CONDITIONAL
    );

    const data = {
      area,
      population,
      median_income: medianIncome,
      governmentAssistance: {
        total: populationOnGovernmentAssistance,
        percent: populationOnGovernmentAssistance / population,
      },
      unemployed: {
        total: unemployed,
        percent: unemployed / population,
      },
      usse: {
        eligible,
        non_eligible: nonEligible,
      },
    };

    if (yearIndex === -1) {
      return [
        ...agg,
        {
          year,
          data: [data],
        },
      ];
    }

    agg[yearIndex] = {
      ...agg[yearIndex],
      data: [...agg[yearIndex].data, data],
    };

    return agg;
  }, []);

export const collectData = async () => {
  const geoData = JSON.parse(readFileSync("data/data.geojson"));

  const [
    unemployment,
    populationData,
    medianIncomeData,
    usse,
    governmentWelfare,
  ] = await Promise.all([
    getUnemploymentFigures(),
    getPopulation(),
    getMedianIncome(),
    getUsse(),
    getGovernmentAssistanceFigures(),
  ]);

  const primary_areas = groupByYear(
    unemployment,
    populationData,
    medianIncomeData,
    usse,
    governmentWelfare
  );

  return {
    primary_areas,
    gothenburg: {
      median_income: medianIncomeData.slice(-1)[0].medianIncome,
    },
    geoData,
  };
};
