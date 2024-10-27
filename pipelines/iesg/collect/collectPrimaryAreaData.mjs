import {
  getUnemploymentFigures,
  getPopulation,
  getMedianIncome,
  getUsse,
  getGovernmentAssistanceFigures,
} from "../../../src/clients/client.mjs";

const mergeAreaData = (
  area,
  unemployed,
  populationData,
  medianIncomeData,
  usse,
  governmentAssistanceData
) => {
  const { population } = populationData.find((_) => _.area === area);
  const { medianIncome } = medianIncomeData.find((_) => _.area === area);
  const { nonEligible, eligible } = usse.find((_) => _.area === area);
  const { populationOnGovernmentAssistance } = governmentAssistanceData.find(
    (_) => _.area === area
  );

  return {
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
};

export const collectPrimaryArea = async () => {
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

  const primaryArea = unemployment.map(({ area, unemployed }) =>
    mergeAreaData(
      area,
      unemployed,
      populationData,
      medianIncomeData,
      usse,
      governmentAssistanceData
    )
  );

  return {
    primaryArea,
    gothenburg: {
      median_income: medianIncomeData.slice(-1)[0].medianIncome,
    },
  };
};
