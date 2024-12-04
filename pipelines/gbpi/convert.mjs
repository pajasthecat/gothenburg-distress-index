import { config } from "./configuration.mjs";
import { buildGbpiIndex } from "../../src/directors/indexDirector.mjs";
import { buildMap } from "../../src/directors/mapDirector.mjs";

export const convert = (data) =>
  Object.keys(data).reduce((agg, year) => {
    const {
      titles: { indexShortTitle },
      classification,
      scales,
      mapTitle,
    } = config;

    const primaryAreas = data[year].primaryArea;
    const cityMedianIncome = data[year].gothenburg.medianIncome;

    const index = buildGbpiIndex({
      primaryAreas,
      cityMedianIncome,
      classification,
      scales,
    });

    const map = buildMap(index, {
      year,
      mapTitle,
      indexShortTitle,
    });

    return { ...agg, [year]: { index, map } };
  }, {});
