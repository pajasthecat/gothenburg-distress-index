import { htmTemplate } from "./templates/html.mjs";

import { writeFileSync } from "fs";

export const persist = ({ index, map }) => {
  const html = htmTemplate(map);

  const dataToPersist = index.map((_) => {
    const {
      area,
      index: {
        value,
        classification: { status, color },
      },
    } = _;

    return { index: value, status, color, area };
  });

  writeFileSync("./gb/public/index.html", html);
  writeFileSync(
    "./gb/public/data/primary-areas.json",
    JSON.stringify(dataToPersist)
  );
};
