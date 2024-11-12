import { collect } from "./collect.mjs";
import { convert } from "./convert.mjs";
import { persist } from "./persist.mjs";
import { config } from "./configuration.mjs";

const choosenYear = config.years[0];

console.time("collect");
const data = await collect();
console.timeEnd("collect");

console.time("convert");
const result = convert(data);
console.timeEnd("convert");

console.time("persist");
persist(result[choosenYear]);
console.timeEnd("persist");
