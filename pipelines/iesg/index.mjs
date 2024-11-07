import { collectData } from "./collect/index.mjs";
import { convert } from "./convert.mjs";
import { persist } from "./persist.mjs";

const data = await collectData();

const res = convert(data);

persist(res);
