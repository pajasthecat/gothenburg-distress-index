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
      .map(calculateOwnershipRate);

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

const calculateOwnershipRate = (dataByArea) => {
  const { propertyOwnershipRate, indexData } = dataByArea;

  const ownershipRate =
    propertyOwnershipRate.own /
    (propertyOwnershipRate.rent +
      propertyOwnershipRate.own +
      propertyOwnershipRate.other);

  return { ...dataByArea, indexData: { ...indexData, ownershipRate } };
};

const getMedianIncomeToMedianHousePrice = (
  propertyPrices,
  medianIncome,
  gothenBurgMedianIncome
) => {
  const medianPropertyPrice = median(propertyPrices.map((pp) => pp.price));

  return {
    medianPropertyPrice,
    gothenburgMedianIncomeToMedianHousePrice:
      medianPropertyPrice / gothenBurgMedianIncome,
    primaryAreaMedianIncomeToMedianHousePrice:
      medianPropertyPrice / medianIncome,
  };
};
