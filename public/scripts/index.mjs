const data = await (await fetch("../data/distress-index.json")).json();
const areas = await (await fetch("../data/primary-area.json")).json();

import { createPrimaryAreaMap, deleteMap } from "./map.mjs";
import { configuration } from "../config.js";

const getYear = () => document.getElementById("yearSlider").value.toString();

const compareAsc = (first, second, comparer) => {
  switch (comparer) {
    case "number":
      return Number(first) > Number(second);

    case "area":
      return Number(first.split(" ")[0]) > Number(second.split(" ")[0]);

    default:
      return first > second;
  }
};

const compareDesc = (first, second, comparer) => {
  switch (comparer) {
    case "number":
      return Number(first) < Number(second);

    case "area":
      return Number(first.split(" ")[0]) < Number(second.split(" ")[0]);

    default:
      return first < second;
  }
};

const setSortArrow = (table, index) => {
  Array.from(table.getElementsByTagName("TH")).forEach((th, currentIndex) => {
    if (currentIndex != index) {
      th.className = null;
      return;
    }
    const className =
      th.className === "headerSortDown" ? "headerSortUp" : "headerSortDown";

    th.className = className;
  });
};

const setUpAllPrimaryAreas = () => {
  const year = getYear();

  const allPrimaryAreas = document.getElementById("allPrimaryAreas");
  data
    .find((d) => d.year === year)
    .data.forEach((value) => {
      const template = `
    <tr style="background-color: ${value.index_classification.color}; color: white">
         <td>${value.area}</td>
         <td>${value.index_classification.status}</td>
         <td>${value.index}</td>
       </tr>
   `;
      allPrimaryAreas.innerHTML += template;
    });
};

const resetAllPrimaryAreas = () => {
  const year = getYear();
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  console.log({ allPrimaryAreas });

  for (var i = 1; i < allPrimaryAreas.rows.length; ) {
    console.log({ i });

    allPrimaryAreas.deleteRow(i);
  }

  console.log({ allPrimaryAreas: allPrimaryAreas.rows.length });

  data
    .find((d) => d.year === year)
    .data.forEach((value) => {
      const template = `
    <tr style="background-color: ${value.index_classification.color}; color: white">
         <td>${value.area}</td>
         <td>${value.index_classification.status}</td>
         <td>${value.index}</td>
       </tr>
   `;
      allPrimaryAreas.innerHTML += template;
    });

  console.log({ allPrimaryAreas: allPrimaryAreas.rows.length });

  setSortingEventListeners();
};

const handleSearchPrimaryAreas = () => {
  const year = getYear();
  const searchText = document.getElementById("searchText").value;

  if (!searchText) return setUpAllPrimaryAreas(year);

  if (searchText.length <= 3) return;

  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  for (var i = 1; i < allPrimaryAreas.rows.length; ) {
    allPrimaryAreas.deleteRow(i);
  }

  const filtered = areas
    .filter(
      (a) =>
        a.address.toLowerCase().includes(searchText.toLowerCase()) ||
        a.primary_area.toLowerCase().includes(searchText.toLowerCase())
    )
    .reduce((agg, current) => {
      if (!agg) return [current.primary_area];

      if (agg.includes(current.primary_area)) return agg;

      return [...agg, current.primary_area];
    }, []);

  const selectedData = filtered?.map((f) =>
    data.find((d) => d.year === year).data.find((d) => d.area === f)
  );

  selectedData?.forEach((value) => {
    const template = `
    <tr style="background-color: ${value.index_classification.color}; color: white">
         <td>${value.area}</td>
         <td>${value.index_classification.status}</td>
         <td>${value.index}</td>
       </tr>
   `;

    allPrimaryAreas.innerHTML += template;
  });

  setSortingEventListeners();
};

const sortTable = (index, comparer, event) => {
  let i = 0;
  let shouldSwitch = false;
  let switchCount = 0;
  let table = document.getElementById("allPrimaryAreas");
  let switching = true;
  const ascending = "asc";
  const descending = "desc";
  let dir = descending;

  setSortArrow(table, index);

  while (switching) {
    switching = false;
    let rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      const first = rows[i]
        .getElementsByTagName("TD")
        [index].innerHTML.toLowerCase();

      const second = rows[i + 1]
        .getElementsByTagName("TD")
        [index].innerHTML.toLowerCase();

      if (dir === ascending) {
        if (compareAsc(first, second, comparer)) {
          shouldSwitch = true;
          break;
        }
      }

      if (dir === descending) {
        if (compareDesc(first, second, comparer)) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchCount++;
    } else {
      if (switchCount == 0 && dir === descending) {
        dir = ascending;
        switching = true;
      }
    }
  }
};

const setSortingEventListeners = () => {
  document
    .getElementById("table-header-status")
    .addEventListener("click", () => sortTable(1, "string"));

  document
    .getElementById("table-header-index")
    .addEventListener("click", () => sortTable(2, "number"));

  document
    .getElementById("table-header-area")
    .addEventListener("click", () => sortTable(0, "area"));
};

const setSearchEventListeners = () =>
  document
    .getElementById("searchText")
    .addEventListener("input", (e) =>
      e?.target?.value === ""
        ? resetAllPrimaryAreas()
        : handleSearchPrimaryAreas()
    );

const setUpYearRange = () => {
  const yearSlider = document.getElementById("yearSlider");

  if (yearSlider.value === "50") {
    yearSlider.max = configuration.yearRange[0];
    yearSlider.min = configuration.yearRange.slice(-1);
    yearSlider.value = configuration.yearRange[0];
  }

  document.getElementById("yearValue").innerHTML = ` ${yearSlider.value}`;

  yearSlider.addEventListener("change", (event) => {
    const index = event.target.value;

    const allSvg = document.querySelectorAll('svg[id^="svg-"]');

    allSvg.forEach((text) => (text.style.display = "none"));

    const svgToActivate = document.getElementById(`svg-${index}`);

    svgToActivate.style.display = "block";

    document.getElementById("yearValue").innerHTML = ` ${index}`;

    resetAllPrimaryAreas();

    handleSearchPrimaryAreas();
  });
};

const setEsgiTitle = () => {
  const esgiTitle = document.getElementById("esgiTitle");

  esgiTitle.innerHTML = `ESGI ${configuration.yearRange.slice(-1)} -  ${
    configuration.yearRange[0]
  }`;
};

createPrimaryAreaMap(configuration.yearRange);

setUpYearRange();

setUpAllPrimaryAreas();

setSortingEventListeners();

setSearchEventListeners();

setEsgiTitle();
