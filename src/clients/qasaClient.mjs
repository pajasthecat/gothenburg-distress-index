import { load } from "cheerio";

import { configuration } from "./configuration.js";
import { readCache } from "./cache/cache.mjs";

export const getMedianRent = async () => {
  console.log("Getting data from Qasa");

  const {
    boplats: { tables },
  } = configuration;

  const cacheName = "qasaClient.json";

  const cachedProps = readCache(cacheName);

  if (cachedProps) return cachedProps;

  console.log("Done getting data from Qasa");

  return {
    Angered: [
      { room: 1, rentPerSqm: 237 },
      { room: 2, rentPerSqm: 183 },
      { room: 3, rentPerSqm: 150 },
    ],
    "Askim-Frölunda-Högsbo": [
      { room: 1, rentPerSqm: 276 },
      { room: 2, rentPerSqm: 212 },
      { room: 3, rentPerSqm: 189 },
    ],
    Centrum: [
      { room: 1, rentPerSqm: 277 },
      { room: 2, rentPerSqm: 239 },
      { room: 3, rentPerSqm: 205 },
    ],
    Lundby: [
      { room: 1, rentPerSqm: 290 },
      { room: 2, rentPerSqm: 236 },
      { room: 3, rentPerSqm: 213 },
    ],
    "Majorna-Linné": [
      { room: 1, rentPerSqm: 297 },
      { room: 2, rentPerSqm: 245 },
      { room: 3, rentPerSqm: 221 },
    ],
    "Norra Hisingen": [
      { room: 1, rentPerSqm: 229 },
      { room: 2, rentPerSqm: 193 },
      { room: 3, rentPerSqm: 175 },
    ],
    "Västra Göteborg": [
      { room: 1, rentPerSqm: 228 },
      { room: 2, rentPerSqm: 207 },
      { room: 3, rentPerSqm: 164 },
    ],
    "Västa Hisningen": [
      { room: 1, rentPerSqm: 214 },
      { room: 2, rentPerSqm: 192 },
      { room: 3, rentPerSqm: 170 },
    ],
    "Örgryte-Härlanda": [
      { room: 1, rentPerSqm: 256 },
      { room: 2, rentPerSqm: 227 },
      { room: 3, rentPerSqm: 187 },
    ],
    "Östra Göteborg": [
      { room: 1, rentPerSqm: 244 },
      { room: 2, rentPerSqm: 190 },
      { room: 3, rentPerSqm: 164 },
    ],
  };
};
