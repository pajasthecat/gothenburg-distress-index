import { collect } from "./collect.mjs";
import { convert } from "./convert.mjs";

console.time("collect");
const data = await collect();
console.timeEnd("collect");

console.time("convert");
const result = convert(data);
console.timeEnd("convert");

console.log(result["2022"]);
