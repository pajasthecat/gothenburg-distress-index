import { quantileRank } from "simple-statistics";

import { getIndexValue } from "../src/helpers.mjs";

const scales = {
  median_under_city_average: 0.25,
  non_eligable_upper_secondary_school_percent: 0.25,
  unemployed_percent: 0.25,
  population_on_government_assistance: 0.25,
};

export const convert = ({ primary_areas, gothenburg, geoData }) => {
  const indexData = primary_areas.map(({ year, data }) => {
    const indexOutput = data
      .map((primaryArea, _, array) =>
        calculateIndexMembers(primaryArea, gothenburg, array)
      )
      .map(normalize)
      .map(applyWeights)
      .map(calculateIndex)
      .map(calculateQuartile)
      .map(pickDataToExpose);

    return { year, data: indexOutput };
  });

  const updatedGeoData = addToGeoData(indexData, geoData);

  return { geoData: updatedGeoData, indexData };
};

const calculateIndexMembers = (primaryArea, gothenburg, primaryAreas) => {
  const median_under_city_average =
    primaryArea.median_income >= gothenburg.median_income ? 0 : 1;

  const quartile_income =
    1 -
    quantileRank(
      primaryAreas.map((p) => p.median_income),
      primaryArea.median_income
    );

  const non_eligable_upper_secondary_school_percent =
    getNonElibiablePercent(primaryArea);

  return {
    ...primaryArea,
    quartile_income,
    median_under_city_average,
    non_eligable_upper_secondary_school_percent,
    unemployed_percent: primaryArea.unemployed.percent,
    population_on_government_assistance:
      primaryArea.governmentAssistance.percent,
  };
};

const normalize = (primaryArea, _, array) => {
  const median_under_city_average_normalized = maxMinScalar(
    primaryArea.median_under_city_average,
    array.map((a) => a.median_under_city_average)
  );

  const quartile_income_normalized = maxMinScalar(
    primaryArea.quartile_income,
    array.map((a) => a.quartile_income)
  );

  const non_eligable_upper_secondary_school_percent_normalized = maxMinScalar(
    primaryArea.non_eligable_upper_secondary_school_percent,
    array.map((a) => a.non_eligable_upper_secondary_school_percent)
  );

  const unemployed_percent_normalized = maxMinScalar(
    primaryArea.unemployed_percent,
    array.map((a) => a.unemployed_percent)
  );

  const population_on_government_assistance_normalized = maxMinScalar(
    primaryArea.population_on_government_assistance,
    array.map((a) => a.population_on_government_assistance)
  );

  return {
    ...primaryArea,
    median_under_city_average_normalized,
    quartile_income_normalized,
    non_eligable_upper_secondary_school_percent_normalized,
    unemployed_percent_normalized,
    population_on_government_assistance_normalized,
  };
};

const applyWeights = (primaryArea) => {
  return {
    ...primaryArea,

    quartile_income_normalized_w:
      primaryArea.quartile_income_normalized * scales.median_under_city_average,

    non_eligable_upper_secondary_school_percent_normalized_w:
      primaryArea.non_eligable_upper_secondary_school_percent_normalized *
      scales.non_eligable_upper_secondary_school_percent,

    unemployed_percent_normalized_w:
      primaryArea.unemployed_percent_normalized * scales.unemployed_percent,

    median_under_city_average_normalized_w:
      primaryArea.median_under_city_average_normalized *
      scales.median_under_city_average,

    population_on_government_assistance_normalized_w:
      primaryArea.population_on_government_assistance_normalized *
      scales.population_on_government_assistance,
  };
};

const calculateIndex = (primaryArea) => {
  const {
    quartile_income_normalized_w,
    unemployed_percent_normalized_w,
    non_eligable_upper_secondary_school_percent_normalized_w,
    population_on_government_assistance_normalized_w,
  } = primaryArea;

  const composite_index =
    quartile_income_normalized_w +
    unemployed_percent_normalized_w +
    non_eligable_upper_secondary_school_percent_normalized_w +
    population_on_government_assistance_normalized_w;

  const composite_index_rounded = getIndexValue(composite_index);

  return {
    ...primaryArea,
    index: { composite_index, composite_index_rounded },
  };
};

const calculateQuartile = (primaryArea, _, array) => {
  const allIndexEntries = array.map((_) => _.index.composite_index_rounded);

  const index_quartile = quantileRank(
    allIndexEntries,
    primaryArea.index.composite_index_rounded
  );

  const index_classification = getIndexClassification(index_quartile);

  return { ...primaryArea, index_quartile, index_classification };
};

const pickDataToExpose = ({
  area,
  index: { composite_index_rounded },
  index_classification,
}) => ({
  area,
  index: composite_index_rounded,
  index_classification,
});

const getIndexClassification = (quartile) => {
  if (quartile <= 0.1)
    return { status: "Blomstrande", color: "#00783c", sorting: 1 };
  if (quartile <= 0.25)
    return { status: "Välmående", color: "#a9ad39", sorting: 2 };
  if (quartile <= 0.5)
    return { status: "Stabilt", color: "#d8c500", sorting: 3 };
  if (quartile <= 0.75)
    return { status: "Sårbart", color: "#ec7a30", sorting: 4 };
  else return { status: "Utsatt", color: "#d82c09", sorting: 5 };
};

const addToGeoData = (indexData, geoData) => {
  const features = geoData.features.map((feat) => {
    const years = indexData.map(({ year, data }) => {
      const match = data.find((primaryArea) => {
        const areaCode = primaryArea.area.split(" ")[0];

        return areaCode === feat.properties["PrimaryAreaCode"];
      });
      return { year, match };
    });

    const properties = years.map(({ year, match }) => {
      const index = match.index;

      const name = match.area
        .split(" ")
        .splice(1, 2)
        .toString()
        .replace(",", " ");

      return {
        Color: match.index_classification.color,
        Index: index,
        Name: name,
        Status: match.index_classification.status,
        Sorting: match.index_classification.sorting,
        Year: year,
      };
    });

    return {
      ...feat,
      properties,
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
