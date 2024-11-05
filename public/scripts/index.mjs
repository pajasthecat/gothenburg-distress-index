const data = await (await fetch("../data/distress-index.json")).json();
const areas = await (await fetch("../data/primary-area.json")).json();

import { createPrimaryAreaMap } from "./map.mjs";

import { setSearchEventListeners, setSortingEventListeners, setUpAllPrimaryAreas } from "./table.mjs";

createPrimaryAreaMap();

setUpAllPrimaryAreas(data);

setSortingEventListeners();

setSearchEventListeners(areas, data);
