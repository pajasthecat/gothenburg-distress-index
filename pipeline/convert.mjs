import { quantileRank } from "simple-statistics";

import { getIndexValue } from "../src/helpers.mjs";

const scales = {
  median_under_city_average: 1,
  non_eligable_upper_secondary_school_percent: 1,
  unemployed_percent: 1,
};

export const convert = ({ primary_areas, gothenburg, geoData }) => {
  const indexData = primary_areas
    .map((p) => calculateIndexMembers(p, gothenburg))
    .map(normalize)
    .map(applyWeights)
    .map(calculateIndex)
    .map(calculateQuartile);

  const updatedGeoData = addToGeoData(indexData, geoData);

  return { geoData: updatedGeoData, indexData };
};

const calculateIndexMembers = (primaryArea, gothenburg) => {
  const median_under_city_average =
    primaryArea.median_income >= gothenburg.median_income ? 0 : 1;

  const non_eligable_upper_secondary_school_percent =
    getNonElibiablePercent(primaryArea);

  return {
    ...primaryArea,
    median_under_city_average,
    non_eligable_upper_secondary_school_percent,
    unemployed_percent: primaryArea.unemployed.percent,
  };
};

const normalize = (primaryArea, _, array) => {
  const median_under_city_average_normalized = maxMinScalar(
    primaryArea.median_under_city_average,
    array.map((a) => a.median_under_city_average)
  );

  const non_eligable_upper_secondary_school_percent_normalized = maxMinScalar(
    primaryArea.non_eligable_upper_secondary_school_percent,
    array.map((a) => a.non_eligable_upper_secondary_school_percent)
  );

  const unemployed_percent_normalized = maxMinScalar(
    primaryArea.unemployed_percent,
    array.map((a) => a.unemployed_percent)
  );

  return {
    ...primaryArea,
    median_under_city_average_normalized,
    non_eligable_upper_secondary_school_percent_normalized,
    unemployed_percent_normalized,
  };
};

const applyWeights = (primaryArea) => {
  return {
    ...primaryArea,

    non_eligable_upper_secondary_school_percent_normalized_w:
      primaryArea.non_eligable_upper_secondary_school_percent_normalized *
      scales.non_eligable_upper_secondary_school_percent,

    unemployed_percent_normalized_w:
      primaryArea.unemployed_percent_normalized * scales.unemployed_percent,

    median_under_city_average_normalized_w:
      primaryArea.median_under_city_average_normalized *
      scales.median_under_city_average,
  };
};

const calculateIndex = (primaryArea) => {
  const {
    median_under_city_average_normalized_w,
    unemployed_percent_normalized_w,
    non_eligable_upper_secondary_school_percent_normalized_w,
  } = primaryArea;

  const weightSum =
    scales.median_under_city_average +
    scales.non_eligable_upper_secondary_school_percent +
    scales.unemployed_percent;

  const composite_index =
    (median_under_city_average_normalized_w +
      unemployed_percent_normalized_w +
      non_eligable_upper_secondary_school_percent_normalized_w) /
    weightSum;

  return { ...primaryArea, composite_index };
};

const calculateQuartile = (primaryArea, _, array) => {
  const allIndexEntries = array.map((_) => _.composite_index);

  const index_quartile = quantileRank(
    allIndexEntries,
    primaryArea.composite_index
  );

  const index_classification = getIndexClassification(index_quartile);

  return { ...primaryArea, index_quartile, index_classification };
};

const getIndexClassification = (quartile) => {
  if (quartile <= 0.1) return { status: "Välbärgat", color: "#00783c" };
  if (quartile <= 0.25) return { status: "Välmående", color: "#a9ad39" };
  if (quartile <= 0.5) return { status: "Stabilt", color: "#d8c500" };
  if (quartile <= 0.75) return { status: "Sårbart", color: "#ec7a30" };
  else return { status: "Utsatt", color: "#d82c09" };
};

const addToGeoData = (indexData, geoData) => {
  const features = geoData.features.map((feat) => {
    const match = indexData.find((primaryArea) => {
      const areaCode = primaryArea.area.split(" ")[0];

      return areaCode === feat.properties["PrimaryAreaCode"];
    });

    const index = getIndexValue(match.composite_index);

    const name = match.area
      .split(" ")
      .splice(1, 2)
      .toString()
      .replace(",", " ");

    return {
      ...feat,
      properties: {
        Color: match.index_classification.color,
        Index: index,
        Name: name,
      },
    };
  });

  return { ...geoData, features };
};

const getNonElibiablePercent = (p) => {
  if (p.usse.non_eligible === 0) return 0;
  return p.usse.non_eligible / (p.usse.eligible + p.usse.non_eligible);
};

const maxMinScalar = (value, series) => {
  const min = getMin(series);
  const max = getMax(series);

  return (value - min) / (max - min);
};

const getMax = (series) => Math.max(...series);

const getMin = (series) => Math.min(...series);
