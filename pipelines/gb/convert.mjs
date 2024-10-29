import { median } from "simple-statistics";

export const convert = (data) =>
  Object.keys(data).reduce((agg, year) => {
    const updatedData = data[year].primaryArea
      .map((_) =>
        calculateMedianIncomeToMedianHousePrice(
          _,
          data[year].gothenburg.medianIncome
        )
      )
      .map(calculateOwnershipRate)
      .map(calculateNetMigration);

    return { ...agg, [year]: updatedData };
  }, {});

const calculateMedianIncomeToMedianHousePrice = (
  dataByArea,
  gothenBurgMedianIncome
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
