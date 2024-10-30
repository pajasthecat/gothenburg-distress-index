import { median } from "simple-statistics";

export const convert = (data) =>
  Object.keys(data).reduce((agg, year) => {
    const cityMedianIncome = data[year].gothenburg.medianIncome;

    const updatedData = data[year].primaryArea
      .map(calculateMedianIncomeToMedianHousePrice.bind(null, cityMedianIncome))
      .map(calculateOwnershipRate)
      .map(calculateNetMigration)
      .map(calculateOverCrowdedRate);

    return { ...agg, [year]: updatedData };
  }, {});

const calculateOverCrowdedRate = (dataByArea) => {
  const { indexData, overCrowdingRate: overCrowding, area } = dataByArea;

  if (!overCrowding) return 0;

  const overCrowdingRate =
    overCrowding.crowded /
    (overCrowding.crowded + overCrowding.notCrowded + overCrowding.other);

  return { ...dataByArea, indexData: { ...indexData, overCrowdingRate } };
};

const calculateMedianIncomeToMedianHousePrice = (
  gothenBurgMedianIncome,
  dataByArea
) => {
  const { propertyPrices, medianIncome } = dataByArea;

  const medianIncomeToMedianHousePrice = getMedianIncomeToMedianHousePrice(
    propertyPrices,
    medianIncome,
    gothenBurgMedianIncome
  );

  return { ...dataByArea, indexData: medianIncomeToMedianHousePrice };
};

const getMedianIncomeToMedianHousePrice = (
  propertyPrices,
  medianIncome,
  gothenBurgMedianIncome
) => {
  const medianPropertyPrice = median(propertyPrices.map((pp) => pp.price));

  return {
    gothenburgMedianIncomeToMedianHousePrice:
      medianPropertyPrice / gothenBurgMedianIncome,
    primaryAreaMedianIncomeToMedianHousePrice:
      medianPropertyPrice / medianIncome,
  };
};

const calculateOwnershipRate = (dataByArea) => {
  const { propertyOwnershipRate, indexData } = dataByArea;

  const ownershipRate =
    propertyOwnershipRate.own /
    (propertyOwnershipRate.rent +
      propertyOwnershipRate.own +
      propertyOwnershipRate.other);

  return { ...dataByArea, indexData: { ...indexData, ownershipRate } };
};

const calculateNetMigration = (dataByArea) => {
  const { movingPattern, indexData, population } = dataByArea;

  if (!movingPattern)
    return { ...dataByArea, indexData: { ...indexData, netMigration: 0 } };

  const netMigration =
    (movingPattern.movingIn - movingPattern.movingOut) / population;

  return { ...dataByArea, indexData: { ...indexData, netMigration } };
};
