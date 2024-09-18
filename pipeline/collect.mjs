import {
  getUnemploymentFigures,
  getPopulation,
  getMedianIncome,
  getUsse,
} from "../src/client.mjs";

export const collectData = async () => {
  const unemployment = await getUnemploymentFigures();
  const populationData = await getPopulation();
  const medianIncomeData = await getMedianIncome();
  const usse = await getUsse();

  const mergedData = unemployment.map(({ area, unemployed }) => {
    const { population } = populationData.find((_) => _.area === area);
    const { medianIncome } = medianIncomeData.find((_) => _.area === area);
    const { nonEligible, eligible } = usse.find((_) => _.area === area);

    return {
      area,
      population,
      median_income: medianIncome,
      unemployed: {
        total: unemployed,
        percent: unemployed / population,
      },
      usse: {
        eligible,
        non_eligible: nonEligible,
      },
    };
  });

  return {
    primary_areas: mergedData,
    gothenburg: {
      median_income: medianIncomeData.slice(-1)[0].medianIncome,
    },
  };
};
