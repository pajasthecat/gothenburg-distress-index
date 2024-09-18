const data = await (await fetch("../data/distress-index.json")).json();
const areas = await (await fetch("../data/primary-area.json")).json();

import { createPrimaryAreaMap } from "./map.mjs";
import { getIndexValue } from "./helpers.mjs";

const setUpAllPrimaryAreas = () => {
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  data.forEach((value) => {
    const index = getIndexValue(value.composite_index);

    const template = `
    <tr style="background-color: ${value.index_classification.color}; color: white">
         <td>${value.area}</td>
         <td>${value.index_classification.status}</td>
         <td>${index}</td>
       </tr>
   `;
    allPrimaryAreas.innerHTML += template;
  });
};

const setUpProsperusAreas = () => {
  const prosperousAreas = document.getElementById("prosperousAreas");

  data
    .sort((a, b) => a.composite_index - b.composite_index)
    .slice(0, 10)
    .forEach((value, index) => {
      const compositeIndexRounded = getIndexValue(value.composite_index);

      const template = `
      <tr>
           <td>${index + 1}</td>
           <td>${value.area}</td>
           <td>${compositeIndexRounded}</td>
         </tr>
     `;
      prosperousAreas.innerHTML += template;
    });
};

const setUpDistressedAreas = () => {
  const distressedAreas = document.getElementById("distressedAreas");

  data
    .sort((a, b) => b.composite_index - a.composite_index)
    .slice(0, 10)
    .forEach((value, index) => {
      const compositeIndexRounded = getIndexValue(value.composite_index);

      const template = `
        <tr>
             <td>${index + 1}</td>
             <td>${value.area}</td>
             <td>${compositeIndexRounded}</td>
           </tr>
       `;
      distressedAreas.innerHTML += template;
    });
};

createPrimaryAreaMap();

setUpAllPrimaryAreas();

setUpProsperusAreas();

setUpDistressedAreas();

document.getElementById("streetAddress").addEventListener("input", (event) => {
  var input = event.target.value;

  if (input.length < 3) return;
  const result = document.getElementById("result");
  const reg = new RegExp(input);
  const filteredAreas = areas.filter((area) => area.address.match(reg));
  let list = "";

  console.log({ filteredAreas });

  filteredAreas.forEach((address) => {
    list += "<li>" + address.address + "</li>";
  });

  result.innerHTML = "<ul>" + list + "</ul>";
});
