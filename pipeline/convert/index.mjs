import { convertPrimaryData } from "./convertPrimaryData.mjs";
import { createPrimaryAreaMap } from "./mapService.mjs";
import { years } from "./config.js";

export const convert = (data) => {
  const primaryData = convertPrimaryData(data);

  createPrimaryAreaMap(primaryData.geoData, years);

  return primaryData;
};
