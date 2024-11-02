import { mean, standardDeviation } from "simple-statistics";

export const normalizeString = (input) =>
  input.toLowerCase().replace(/\s/g, "");

export const calculateZScore = (value, { mean, std }) => (value - mean) / std;

export const getMeanAndStd = (array) => ({
  mean: mean(array),
  std: standardDeviation(array),
});
