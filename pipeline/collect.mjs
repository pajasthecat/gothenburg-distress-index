import {
  getUnemploymentFigures,
  getPopulation,
  getMedianIncome,
  getUsse,
  getGovernmentAssistanceFigures,
} from "../src/clients/client.mjs";

import { readFileSync } from "fs";

export const collectData = async () => {
  const geoData = JSON.parse(readFileSync("data/data.geojson"));

  const [
    unemployment,
    populationData,
    medianIncomeData,
    usse,
    governmentAssistanceData,
  ] = await Promise.all([
    getUnemploymentFigures(),
    getPopulation(),
    getMedianIncome(),
    getUsse(),
    getGovernmentAssistanceFigures(),
  ]);

  const groupedByYear = unemployment.reduce((agg, current) => {
    const year = current.year;
    const area = current.area;
    const unemployed = current.unemployed;
    const yearIndex = agg.findIndex((a) => a.year === year);

    const conditional = (_) => _.year === year && _.area === area;

    const { population } = populationData.find(conditional);
    const { medianIncome } = medianIncomeData.find(conditional);
    const { nonEligible, eligible } = usse.find(conditional);
    const { populationOnGovernmentAssistance } =
      governmentAssistanceData.find(conditional);

    if (yearIndex === -1) {
      return [
        ...agg,
        {
          year,
          data: [
            {
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
            },
          ],
        },
      ];
    }

    agg[yearIndex] = {
      ...agg[yearIndex],
      data: [
        ...agg[yearIndex].data,
        {
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
        },
      ],
    };

    return agg;
  }, []);

  return {
    primary_areas: groupedByYear,
    gothenburg: {
      median_income: medianIncomeData.slice(-1)[0].medianIncome,
    },
    geoData,
  };
};
