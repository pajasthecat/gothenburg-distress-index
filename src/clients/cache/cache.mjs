import { writeFileSync, readFileSync } from "fs";

export const writeCache = (data, fileName) => {
  const dataAsString = JSON.stringify(data);

  writeFileSync(`./src/clients/cache/${fileName}`, dataAsString);
};

export const readCache = (fileName) => {
  try {
    const path = `./src/clients/cache/${fileName}`;

    const cacheAsString = readFileSync(path, {
      encoding: "utf8",
      flag: "r",
    });

    return JSON.parse(cacheAsString);
  } catch (error) {
    return null;
  }
};
