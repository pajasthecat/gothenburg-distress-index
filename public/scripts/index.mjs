const data = await (await fetch("../data/distress-index.json")).json();
const areas = await (await fetch("../data/primary-area.json")).json();

import { createPrimaryAreaMap } from "./map.mjs";

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
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  data.forEach((value) => {
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
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  for (var i = 1; i < allPrimaryAreas.rows.length; ) {
    allPrimaryAreas.deleteRow(i);
  }

  data.forEach((value) => {
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

const handleSearchPrimaryAreas = (searchText) => {
  if (!searchText) return setUpAllPrimaryAreas();

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

  const selectedData = filtered?.map((f) => data.find((d) => d.area === f));

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

createPrimaryAreaMap();

setUpAllPrimaryAreas();

document
  .getElementById("table-header-status")
  .addEventListener("click", () => sortTable(1, "string"));

document
  .getElementById("table-header-index")
  .addEventListener("click", () => sortTable(2, "number"));

document
  .getElementById("table-header-area")
  .addEventListener("click", () => sortTable(0, "area"));

document
  .getElementById("searchText")
  .addEventListener("input", (e) =>
    e?.target?.value === ""
      ? resetAllPrimaryAreas()
      : handleSearchPrimaryAreas(e?.target?.value)
  );
