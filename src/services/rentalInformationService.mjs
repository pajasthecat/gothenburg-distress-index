import { getQueueingTimeInYears } from "../clients/boplatsClient.mjs";
import { getMedianRent } from "../clients/qasaClient.mjs";

import { mapWithPrimaryAreas } from "../mappers/boplatsMappers.mjs";
import { mapWithPrimaryAreas as mapQasaWithPrimaryAreas } from "../mappers/qasaMappers.mjs";

export const getQueueTimeForPrimaryAreas = async (years, areaToPrimaryArea) => {
  const result = await years.reduce(async (agg, year) => {
    const queueTimeByArea = await getQueueingTimeInYears();

    const queueTime = mapWithPrimaryAreas(queueTimeByArea, areaToPrimaryArea);

    const res = { [year]: queueTime };

    return { ...agg, ...res };
  }, {});

  return result;
};

export const getMedianRentForPrimaryAreas = async (
  years,
  areaToPrimaryArea
) => {
  const result = await years.reduce(async (agg, year) => {
    const medianRentByArea = await getMedianRent();

    const medianRent = mapQasaWithPrimaryAreas(
      medianRentByArea,
      areaToPrimaryArea
    );

    const res = { [year]: medianRent };

    return { ...agg, ...res };
  }, {});

  return result;
};
