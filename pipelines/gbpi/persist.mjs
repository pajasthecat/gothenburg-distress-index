import { htmlTemplate } from "./templates/html.mjs";
import { config } from "./configuration.mjs";
import { getIndexValue } from "../../src/helpers.mjs";

const { titles } = config;

import { writeFileSync } from "fs";

export const persist = ({ index, map }) => {
  const html = htmlTemplate(map, titles);

  const dataToPersist = index.map((_) => {
    const {
      area,
      index: {
        raw: {
          gothenburgMedianIncomeToMedianHousePrice,
          medianQueueTime,
          ownershipRate,
          medianRent,
        },
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
      medianQueueTime,
      ownershipRate: getIndexValue(ownershipRate),
      medianRent,
    };
  });

  writeFileSync("./public/gbpi/index.html", html);
  writeFileSync("./public/gbpi/data/index.json", JSON.stringify(dataToPersist));
};
