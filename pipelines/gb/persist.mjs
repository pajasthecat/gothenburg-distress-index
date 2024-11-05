import { htmlTemplate } from "./templates/html.mjs";
import { config } from "./configuration.mjs";
const { indexTitle } = config;

import { writeFileSync } from "fs";

export const persist = ({ index, map }) => {
  const html = htmlTemplate(map, indexTitle);

  const dataToPersist = index.map((_) => {
    const {
      area,
      index: {
        value,
        classification: { status, color, sorting },
      },
    } = _;

    return { index: value, status, color, area, sorting };
  });

  writeFileSync("./gb/public/index.html", html);
  writeFileSync(
    "./gb/public/data/index.json",
    JSON.stringify(dataToPersist)
  );
};
