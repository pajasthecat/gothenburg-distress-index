import { writeFileSync } from "fs";

export const persist = (data) => {
  const dataAsString = JSON.stringify(data);
  writeFileSync("./public/data/distress-index.json", dataAsString);
};
