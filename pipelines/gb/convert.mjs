import { median, quantileRank } from "simple-statistics";

import { calculateZScore, getMeanAndStd } from "../../src/normalizers.mjs";
import { createPrimaryAreaMap } from "../../src/generators/mapGenerator.mjs";

const scales = {
  gothenburgMedianIncomeToMedianHousePrice: 0.25,
  ownershipRate: 0.25,
  netMigration: 0.25,
  overCrowdingRate: 0.25,
};

export const convert = (data) =>
  Object.keys(data).reduce((agg, year) => {
    const primaryAreas = data[year].primaryArea;
    const cityMedianIncome = data[year].gothenburg.medianIncome;

    const updatedData = primaryAreas.map(
      calculateIndexMembers.bind(null, cityMedianIncome)
    );

    const index = normalizeParameters(updatedData)
      .map(applyWeights)
      .map(calculateIndex)
      .map(calculateQuartile);

    const map = createPrimaryAreaMap(index, {year, mapTitle:"Primärområden", indexTitle: ""});

    return { ...agg, [year]: { index, map } };
  }, {});

const calculateQuartile = (primaryArea, _, array) => {
  const allIndexEntries = array.map((_) => _.index.value);

  const quartile = quantileRank(allIndexEntries, primaryArea.index.value);

  const classification = getIndexClassification(quartile);

  return {
    ...primaryArea,
    index: {
      ...primaryArea.index,
      indexQuartile: quartile,
      classification,
    },
  };
};

const getIndexClassification = (quartile) => {
  if (quartile >= 0.75)
    return { status: "Prisvärt", color: "#4CAF50", sorting: 1 };
  if (quartile >= 0.5)
    return { status: "Överkomligt", color: "#8BC34A", sorting: 2 };
  if (quartile >= 0.25)
    return { status: "Neutralt", color: "#FFEB3B", sorting: 3 };
  if (quartile >= 0.1) return { status: "Dyrt", color: "#FF9800", sorting: 4 };
  else return { status: "Väldigt dyrt", color: "#F44336", sorting: 5 };
};

const calculateIndex = (dataByArea) => {
  const { index } = dataByArea;

  const {
    scaled: {
      netMigration,
      gothenburgMedianIncomeToMedianHousePrice,
      ownershipRate,
      overCrowdingRate,
    },
  } = index;

  const netMigrationInverted = 1 - netMigration;
  const ownershipRateInverted = 1 - ownershipRate;

  const result =
    netMigrationInverted +
    gothenburgMedianIncomeToMedianHousePrice +
    ownershipRateInverted +
    overCrowdingRate;

  return {
    ...dataByArea,
    index: {
      ...index,
      value: result,
    },
  };
};

const calculateIndexMembers = (cityMedianIncome, dataByArea) => {
  const {
    gothenburgMedianIncomeToMedianHousePrice,
    primaryAreaMedianIncomeToMedianHousePrice,
  } = calculateMedianIncomeToMedianHousePrice(cityMedianIncome, dataByArea);
  const netMigration = calculateNetMigration(dataByArea);
  const ownershipRate = calculateOwnershipRate(dataByArea);
  const overCrowdingRate = calculateOverCrowdedRate(dataByArea);

  return {
    ...dataByArea,
    index: {
      raw: {
        netMigration,
        gothenburgMedianIncomeToMedianHousePrice,
        primaryAreaMedianIncomeToMedianHousePrice,
        ownershipRate,
        overCrowdingRate,
      },
    },
  };
};

const calculateOverCrowdedRate = (dataByArea) => {
  const { overCrowdingRate: overCrowding, area } = dataByArea;

  if (!overCrowding) return 0;

  return (
    overCrowding.crowded /
    (overCrowding.crowded + overCrowding.notCrowded + overCrowding.other)
  );
};

const calculateMedianIncomeToMedianHousePrice = (
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

const calculateOwnershipRate = (dataByArea) => {
  const { propertyOwnershipRate, area } = dataByArea;

  return (
    propertyOwnershipRate.own /
    (propertyOwnershipRate.rent +
      propertyOwnershipRate.own +
      propertyOwnershipRate.other)
  );
};

const calculateNetMigration = (dataByArea) => {
  const { movingPattern, population } = dataByArea;

  if (!movingPattern) return 0;

  return (movingPattern.movingIn - movingPattern.movingOut) / population;
};

const normalizeParameters = (dataByYear) => {
  const {
    mimhStats,
    netMigrationStat,
    ownershipRatesStat,
    overCrowdingRateStat,
  } = dataByYear.reduce((agg, current, index, array) => {
    if (index + 1 === array.length) {
      const { mimhs, overCrowdingRates, netMigrations, ownershipRates } = agg;

      return {
        mimhStats: getMeanAndStd(mimhs),
        netMigrationStat: getMeanAndStd(netMigrations),
        ownershipRatesStat: getMeanAndStd(ownershipRates),
        overCrowdingRateStat: getMeanAndStd(overCrowdingRates),
      };
    }

    const {
      index: {
        raw: {
          netMigration,
          gothenburgMedianIncomeToMedianHousePrice,
          ownershipRate,
          overCrowdingRate,
        },
      },
    } = current;

    if (index === 0)
      return {
        mimhs: [gothenburgMedianIncomeToMedianHousePrice],
        ownershipRates: [ownershipRate],
        netMigrations: [netMigration],
        overCrowdingRates: [overCrowdingRate],
      };

    return {
      mimhs: [...agg?.mimhs, gothenburgMedianIncomeToMedianHousePrice],
      ownershipRates: [...agg?.ownershipRates, ownershipRate],
      netMigrations: [...agg?.netMigrations, netMigration],
      overCrowdingRates: [...agg?.overCrowdingRates, overCrowdingRate],
    };
  }, {});

  return dataByYear.map((dataByArea) => {
    const { index } = dataByArea;
    const {
      raw: {
        gothenburgMedianIncomeToMedianHousePrice,
        ownershipRate,
        netMigration,
        overCrowdingRate,
      },
    } = index;

    return {
      ...dataByArea,
      index: {
        ...index,
        normalized: {
          gothenburgMedianIncomeToMedianHousePrice: calculateZScore(
            gothenburgMedianIncomeToMedianHousePrice,
            mimhStats
          ),
          ownershipRate: calculateZScore(ownershipRate, ownershipRatesStat),
          netMigration: calculateZScore(netMigration, netMigrationStat),
          overCrowdingRate: calculateZScore(
            overCrowdingRate,
            overCrowdingRateStat
          ),
        },
      },
    };
  });
};

const applyWeights = (primaryArea) => {
  const {
    index: {
      normalized: {
        netMigration,
        gothenburgMedianIncomeToMedianHousePrice,
        ownershipRate,
        overCrowdingRate,
      },
    },
  } = primaryArea;

  return {
    ...primaryArea,
    index: {
      ...primaryArea.index,
      scaled: {
        netMigration: netMigration * scales.netMigration,
        gothenburgMedianIncomeToMedianHousePrice:
          gothenburgMedianIncomeToMedianHousePrice *
          scales.gothenburgMedianIncomeToMedianHousePrice,
        ownershipRate: ownershipRate * scales.ownershipRate,
        overCrowdingRate: overCrowdingRate * scales.overCrowdingRate,
      },
    },
  };
};
