import { collectData } from "./collect.mjs";
import { convert } from "./convert/index.mjs";
import { persist } from "./persist.mjs";

const data = await collectData();

const res = convert(data);

console.log(res);

persist(res);
