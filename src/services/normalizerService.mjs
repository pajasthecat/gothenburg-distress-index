import { mean, standardDeviation } from "simple-statistics";

export const normalizeString = (input) =>
  input.toLowerCase().replace(/\s/g, "");

export const applyWeights = (scales, primaryArea) => {
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
        gothenburgMedianIncomeToMedianHousePrice:
          gothenburgMedianIncomeToMedianHousePrice *
          scales.gothenburgMedianIncomeToMedianHousePrice,
        ownershipRate: ownershipRate * scales.ownershipRate,
        medianQueueTime: medianQueueTime * scales.medianQueueTime,
        medianRent: medianRent * scales.medianRent,
      },
    },
  };
};

export const normalizeGbpiParameters = (dataByYear) => {
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

const calculateZScore = (value, { mean, std }) => (value - mean) / std;

const getMeanAndStd = (array) => ({
  mean: mean(array),
  std: standardDeviation(array),
});
