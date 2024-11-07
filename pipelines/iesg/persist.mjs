import { writeFileSync } from "fs";

export const persist = ({ geoData, indexData }) => {
  const indexDataAsString = JSON.stringify(indexData);
  const geoDataAsString = JSON.stringify(geoData);
  writeFileSync("./public/iesg/data/distress-index.json", indexDataAsString);
  writeFileSync("./public/iesg/data/distress-index.geojson", geoDataAsString);
};
