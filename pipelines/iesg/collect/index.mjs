import { readFileSync } from "fs";
import { collectPrimaryArea } from "./collectPrimaryAreaData.mjs";

export const collectData = async () => {
  const geoData = JSON.parse(readFileSync("data/data.geojson"));

  const { primaryArea, gothenburg } = await collectPrimaryArea();

  return {
    primary_areas: primaryArea,
    gothenburg,
    geoData,
  };
};
