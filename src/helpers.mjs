export const round = (number) => Math.round(number * 100) / 100;

export const getIndexValue = (raw) => Math.round(round(raw) * 100);
