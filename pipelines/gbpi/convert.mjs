import { median, quantileRank } from "simple-statistics";

import { calculateZScore, getMeanAndStd } from "../../src/normalizers.mjs";
import { createPrimaryAreaMap } from "../../src/generators/mapGenerator.mjs";
import { round } from "../../src/helpers.mjs";
import { config } from "./configuration.mjs";
const {
  titles: { indexShortTitle },
  classification,
  scales,
} = config;

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

    const map = createPrimaryAreaMap(index, {
      year,
      mapTitle: "Primärområden",
      indexShortTitle,
    });

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
  if (quartile <= 0.1) return getClassificationForLevel(1);
  if (quartile <= 0.25) return getClassificationForLevel(2);
  if (quartile <= 0.5) return getClassificationForLevel(3);
  if (quartile <= 0.75) return getClassificationForLevel(4);
  else return getClassificationForLevel(5);
};

const getClassificationForLevel = (sorting) => ({
  ...classification[sorting],
  sorting,
});

const calculateIndex = (dataByArea) => {
  const { index } = dataByArea;

  const {
    scaled: {
      gothenburgMedianIncomeToMedianHousePrice,
      ownershipRate,
      medianQueueTime,
      medianRent,
    },
  } = index;

  const ownershipRateInverted = 1 - ownershipRate;

  const result =
    gothenburgMedianIncomeToMedianHousePrice +
    ownershipRateInverted +
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

const calculateIndexMembers = (cityMedianIncome, dataByArea) => {
  const {
    gothenburgMedianIncomeToMedianHousePrice,
    primaryAreaMedianIncomeToMedianHousePrice,
  } = calculateMedianIncomeToMedianHousePrice(cityMedianIncome, dataByArea);
  const netMigration = calculateNetMigration(dataByArea);
  const ownershipRate = calculateOwnershipRate(dataByArea);
  const overCrowdingRate = calculateOverCrowdedRate(dataByArea);
  const medianQueueTime = calculateMedianQueueTime(dataByArea);
  const medianRent = calculateMedianRent(dataByArea);

  const roundedmimh = round(gothenburgMedianIncomeToMedianHousePrice);
  return {
    ...dataByArea,
    index: {
      raw: {
        netMigration,
        gothenburgMedianIncomeToMedianHousePrice: roundedmimh,
        primaryAreaMedianIncomeToMedianHousePrice,
        ownershipRate,
        overCrowdingRate,
        medianQueueTime,
        medianRent,
      },
    },
  };
};

const calculateMedianRent = ({ medianRent }) => {
  const rentPerSqm = medianRent.map((_) => _.rentPerSqm);

  return median(rentPerSqm);
};

const calculateMedianQueueTime = ({ queueTime, area }) => {
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

const calculateOverCrowdedRate = (dataByArea) => {
  const { overCrowdingRate: overCrowding } = dataByArea;

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
    medianQueueTimeStat,
    medianRentStat,
  } = dataByYear.reduce((agg, current, index, array) => {
    if (index + 1 === array.length) {
      const {
        mimhs,
        overCrowdingRates,
        netMigrations,
        ownershipRates,
        medianQueueTime,
        medianRent,
      } = agg;

      return {
        mimhStats: getMeanAndStd(mimhs),
        netMigrationStat: getMeanAndStd(netMigrations),
        ownershipRatesStat: getMeanAndStd(ownershipRates),
        overCrowdingRateStat: getMeanAndStd(overCrowdingRates),
        medianQueueTimeStat: getMeanAndStd(medianQueueTime),
        medianRentStat: getMeanAndStd(medianRent),
      };
    }

    const {
      index: {
        raw: {
          netMigration,
          gothenburgMedianIncomeToMedianHousePrice,
          ownershipRate,
          overCrowdingRate,
          medianQueueTime,
          medianRent,
        },
      },
    } = current;

    if (index === 0)
      return {
        mimhs: [gothenburgMedianIncomeToMedianHousePrice],
        ownershipRates: [ownershipRate],
        netMigrations: [netMigration],
        overCrowdingRates: [overCrowdingRate],
        medianQueueTime: [medianQueueTime],
        medianRent: [medianRent],
      };

    return {
      mimhs: [...agg?.mimhs, gothenburgMedianIncomeToMedianHousePrice],
      ownershipRates: [...agg?.ownershipRates, ownershipRate],
      netMigrations: [...agg?.netMigrations, netMigration],
      overCrowdingRates: [...agg?.overCrowdingRates, overCrowdingRate],
      medianQueueTime: [...agg?.medianQueueTime, medianQueueTime],
      medianRent: [...agg?.medianRent, medianRent],
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
        medianQueueTime,
        medianRent,
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
          medianQueueTime: calculateZScore(
            medianQueueTime,
            medianQueueTimeStat
          ),
          medianRent: calculateZScore(medianRent, medianRentStat),
        },
      },
    };
  });
};

const applyWeights = (primaryArea) => {
  const {
    index: {
      normalized: {
        gothenburgMedianIncomeToMedianHousePrice,
        ownershipRate,
        medianQueueTime,
        medianRent,
      },
    },
  } = primaryArea;

  return {
    ...primaryArea,
    index: {
      ...primaryArea.index,
      scaled: {
        // netMigration: netMigration * scales.netMigration,
        gothenburgMedianIncomeToMedianHousePrice:
          gothenburgMedianIncomeToMedianHousePrice *
          scales.gothenburgMedianIncomeToMedianHousePrice,
        ownershipRate: ownershipRate * scales.ownershipRate,
        // overCrowdingRate: overCrowdingRate * scales.overCrowdingRate,
        medianQueueTime: medianQueueTime * scales.medianQueueTime,
        medianRent: medianRent * scales.medianRent,
      },
    },
  };
};
