const data = await (await fetch("../data/index.json")).json();
const areas = await (await fetch("../data/primary-area.json")).json();

import { setSearchEventListeners, setSortingEventListeners, setUpAllPrimaryAreas } from "./table.mjs";
import {  tooltip } from "./map.mjs";

tooltip();

setUpAllPrimaryAreas(data);

setSortingEventListeners();

setSearchEventListeners(areas, data);
