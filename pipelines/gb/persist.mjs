import { htmTemplate } from "./templates/html.mjs";

import { writeFileSync } from "fs";

export const persist = ({ index, map }) => {
  const html = htmTemplate(map, "GB");

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
