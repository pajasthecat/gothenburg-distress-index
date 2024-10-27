import { median } from "simple-statistics";

export const convert = (data) =>
  Object.keys(data).reduce((agg, year) => {
    const updatedData = data[year].map((dataByArea) => {
      const { propertyPrices, medianIncome } = dataByArea;

      const medianIncomeToMedianHousePrice = getMedianIncomeToMedianHousePrice(
        propertyPrices,
        medianIncome
      );

      return { ...dataByArea, indexData: medianIncomeToMedianHousePrice };
    });

    return { ...agg, [year]: updatedData };
  }, {});

const getMedianIncomeToMedianHousePrice = (propertyPrices, medianIncome) => {
  const medianPropertyPrice = median(propertyPrices.map((pp) => pp.price));

  return {
    medianPropertyPrice,
    medianIncomeToMedianHousePrice: medianPropertyPrice / medianIncome,
  };
};
