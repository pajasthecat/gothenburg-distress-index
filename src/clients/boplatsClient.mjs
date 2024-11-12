import { load } from "cheerio";

import { configuration } from "./configuration.js";
import { writeCache, readCache } from "./cache/cache.mjs";

export const getQueueingTimeInYears = async () => {
  console.log("Getting data from Boplats");

  const {
    boplats: { tables },
  } = configuration;

  const cacheName = "boplatsClient.json";

  const cachedProps = readCache(cacheName);

  if (cachedProps) {
    console.log("Done getting cached data from Boplats");

    return cachedProps;
  }

  const response = await fetch("https://boplats.se/tipshjalp/statistik");

  const markup = await response.text();

  const $ = load(markup);

  const h3 = $("h3").filter((_, el) => $(el).text().trim() === "Tabeller");

  let tableResult = [];
  let next = h3.next();

  while (next.length && next[0].tagName !== "h3") {
    if (next[0].tagName === "table") {
      const tableName = next.prev("p").text().trim();
      const table = $(next);

      const tableData = table
        .find("tr")
        .map((_, row) => {
          const rowData = $(row)
            .find("td")
            .map((_, cell) => $(cell).text().trim())
            .get();

          if (!rowData[0] || rowData[0] === "") return;

          const propNames = rowData[0].match(/\b(\d+-\d+|Totalt)\b/);

          if (!propNames) return;

          const years = parseInt(rowData[1]);

          const data = { [propNames[0]]: isNaN(years) ? 0 : years };

          return data;
        })
        .get();

      tableResult.push({
        name: tableName,
        data: tableData,
      });
    }
    next = next.next();
  }

  const pickedTables = tableResult.filter((table) =>
    tables.includes(table.name)
  );

  writeCache(pickedTables, cacheName);

  console.log("Done getting data from Boplats");

  return pickedTables;
};
