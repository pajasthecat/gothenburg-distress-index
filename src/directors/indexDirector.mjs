import {
  calculateOwnershipRate,
  calculateMedianIncomeToMedianHousePrice,
  calculateMedianRent,
  calculateMedianQueueTime,
  calculateIndex,
  calculateQuartile,
} from "../builders/gbpiBuilder.mjs";
import {
  normalizeGbpiParameters,
  applyWeights,
} from "../../src/services/normalizerService.mjs";
import { round } from "../helpers.mjs";

export const buildGbpiIndex = ({
  primaryAreas,
  cityMedianIncome,
  classification,
  scales,
}) => {
  const indexData = primaryAreas.map(
    calculateIndexMembers.bind(null, cityMedianIncome)
  );

  const index = normalizeGbpiParameters(indexData)
    .map(applyWeights.bind(null, scales))
    .map(calculateIndex)
    .map(calculateQuartile.bind(null, classification));

  return index;
};

export const calculateIndexMembers = (cityMedianIncome, primaryAreaData) => {
  const {
    gothenburgMedianIncomeToMedianHousePrice,
    primaryAreaMedianIncomeToMedianHousePrice,
  } = calculateMedianIncomeToMedianHousePrice(
    cityMedianIncome,
    primaryAreaData
  );
  const ownershipRate = calculateOwnershipRate(primaryAreaData);
  const medianQueueTime = calculateMedianQueueTime(primaryAreaData);
  const medianRent = calculateMedianRent(primaryAreaData);

  const roundedmimh = round(gothenburgMedianIncomeToMedianHousePrice);
  return {
    ...primaryAreaData,
    index: {
      raw: {
        gothenburgMedianIncomeToMedianHousePrice: roundedmimh,
        primaryAreaMedianIncomeToMedianHousePrice,
        ownershipRate,
        medianQueueTime,
        medianRent,
      },
    },
  };
};
