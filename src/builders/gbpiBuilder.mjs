import { median, quantileRank } from "simple-statistics";
import { round } from "../../src/helpers.mjs";

export const calculateNetMigration = (dataByArea) => {
  const { movingPattern, population } = dataByArea;

  if (!movingPattern) return 0;

  return (movingPattern.movingIn - movingPattern.movingOut) / population;
};

export const calculateOwnershipRate = (dataByArea) => {
  const { propertyOwnershipRate } = dataByArea;

  const ownershipRate =
    propertyOwnershipRate.own /
    (propertyOwnershipRate.rent +
      propertyOwnershipRate.own +
      propertyOwnershipRate.other);

  const ownershipRatesInverted = 1 - ownershipRate;

  return ownershipRatesInverted;
};

export const calculateOverCrowdedRate = (dataByArea) => {
  const { overCrowdingRate: overCrowding } = dataByArea;

  if (!overCrowding) return 0;

  return (
    overCrowding.crowded /
    (overCrowding.crowded + overCrowding.notCrowded + overCrowding.other)
  );
};

export const calculateMedianIncomeToMedianHousePrice = (
  gothenBurgMedianIncome,
  dataByArea
) => {
  const { propertyPrices, medianIncome } = dataByArea;

  return getMedianIncomeToMedianHousePrice(
    propertyPrices,
    medianIncome,
    gothenBurgMedianIncome
  );
};

export const calculateMedianRent = ({ medianRent }) => {
  const rentPerSqm = medianRent.map((_) => _.rentPerSqm);

  return median(rentPerSqm);
};

export const calculateQuartile = (
  classificationOptions,
  primaryArea,
  _,
  array
) => {
  const allIndexEntries = array.map((_) => _.index.value);

  const quartile = quantileRank(allIndexEntries, primaryArea.index.value);

  const classification = getIndexClassification(
    quartile,
    classificationOptions
  );

  return {
    ...primaryArea,
    index: {
      ...primaryArea.index,
      indexQuartile: quartile,
      classification,
    },
  };
};

export const calculateMedianQueueTime = ({ queueTime, area }) => {
  const yearArray = queueTime
    ?.reduce((agg, curr) => {
      const key = Object.keys(curr)[0];
      if (key === "Totalt") return agg;
      const years = key.split("-");

      const year = (parseInt(years[0]) + parseInt(years[1])) / 2;
      const count = curr[key];

      const res = new Array(count).fill(year).map((_) => _);

      return [...agg, res];
    }, [])
    ?.flat();

  try {
    const medianQueueTime = median(yearArray);
    return medianQueueTime;
  } catch (error) {
    console.log("Error when trying to get median years", { error, area });
    return 0;
  }
};

export const calculateIndex = (dataByArea) => {
  const { index } = dataByArea;

  const {
    scaled: {
      gothenburgMedianIncomeToMedianHousePrice,
      ownershipRate,
      medianQueueTime,
      medianRent,
    },
  } = index;

  const result =
    gothenburgMedianIncomeToMedianHousePrice +
    ownershipRate +
    medianQueueTime +
    medianRent;

  const roundedIndex = round(result);

  return {
    ...dataByArea,
    index: {
      ...index,
      value: roundedIndex,
    },
  };
};

const getMedianIncomeToMedianHousePrice = (
  propertyPrices,
  medianIncome,
  gothenBurgMedianIncome
) => {
  const allPrices = propertyPrices?.map((pp) => pp?.price);

  if (!allPrices || allPrices.length === 0)
    return {
      gothenburgMedianIncomeToMedianHousePrice: 0,
      primaryAreaMedianIncomeToMedianHousePrice: 0,
    };

  const medianPropertyPrice = median(allPrices);

  return {
    gothenburgMedianIncomeToMedianHousePrice:
      medianPropertyPrice / gothenBurgMedianIncome,
    primaryAreaMedianIncomeToMedianHousePrice:
      medianPropertyPrice / medianIncome,
  };
};

const getIndexClassification = (quartile, classificationOptions) => {
  if (quartile <= 0.1)
    return getClassificationForLevel(1, classificationOptions);
  if (quartile <= 0.25)
    return getClassificationForLevel(2, classificationOptions);
  if (quartile <= 0.5)
    return getClassificationForLevel(3, classificationOptions);
  if (quartile <= 0.75)
    return getClassificationForLevel(4, classificationOptions);
  else return getClassificationForLevel(5, classificationOptions);
};

const getClassificationForLevel = (sorting, classificationOptions) => ({
  ...classificationOptions[sorting],
  sorting,
});
