import { htmlTemplate } from "./templates/html.mjs";
import { config } from "./configuration.mjs";
const {
  titles: { indexTitle, mimhTitle, indexShortTitle },
} = config;

import { writeFileSync } from "fs";

export const persist = ({ index, map }) => {
  const html = htmlTemplate(map, indexTitle, mimhTitle, indexShortTitle);

  const dataToPersist = index.map((_) => {
    const {
      area,
      index: {
        raw: { gothenburgMedianIncomeToMedianHousePrice },
        value,
        classification: { status, color, sorting },
      },
    } = _;

    return {
      index: value,
      status,
      color,
      area,
      sorting,
      mimh: gothenburgMedianIncomeToMedianHousePrice,
    };
  });

  writeFileSync("./public/gbpi/index.html", html);
  writeFileSync("./public/gbpi/data/index.json", JSON.stringify(dataToPersist));
};
