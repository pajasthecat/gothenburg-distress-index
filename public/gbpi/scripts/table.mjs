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
    const className = "activeSort";

    th.className = className;
  });
};

const resetAllPrimaryAreas = (data) => {
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  for (var i = 1; i < allPrimaryAreas.rows.length; ) {
    allPrimaryAreas.deleteRow(i);
  }

  addRow(data, allPrimaryAreas);

  setSortingEventListeners();
};

const handleSearchPrimaryAreas = (searchText, areas, data) => {
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

  addRow(selectedData, allPrimaryAreas);

  setSortingEventListeners();
};

const sortTable = (index, comparer) => {
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

const addRow = (data, allPrimaryAreas) =>
  data.forEach((value) => {
    const row = getRow(value);
    allPrimaryAreas.innerHTML += row;
  });

const getRow = ({
  area,
  status,
  index,
  color,
  mimh,
  ownershipRate,
  medianQueueTime,
  medianRent,
}) =>
  `
  <tr style="background-color: ${color}; color: white">
       <td>${area}</td>
       <td>${status}</td>
       <td>${index}</td>
       <td class="onlyOnDesktop">${mimh}</td>
       <td class="onlyOnDesktop">${medianQueueTime}</td>
       <td class="onlyOnDesktop">${ownershipRate}</td>
       <td class="onlyOnDesktop">${medianRent}</td>
     </tr>
 `;

export const setSortingEventListeners = () => {
  document
    .getElementById("table-header-area")
    .addEventListener("click", () => sortTable(0, "area"));

  document
    .getElementById("table-header-status")
    .addEventListener("click", () => sortTable(1, "string"));

  document
    .getElementById("table-header-index")
    .addEventListener("click", () => sortTable(2, "number"));

  document
    .getElementById("table-header-mimh")
    .addEventListener("click", () => sortTable(3, "number"));

  document
    .getElementById("table-header-medianQueueTime")
    .addEventListener("click", () => sortTable(4, "number"));

  document
    .getElementById("table-header-ownershipRate")
    .addEventListener("click", () => sortTable(5, "number"));

  document
    .getElementById("table-header-medianRent")
    .addEventListener("click", () => sortTable(6, "number"));
};

export const setSearchEventListeners = (areas, data) =>
  document
    .getElementById("searchText")
    .addEventListener("input", (e) =>
      e?.target?.value === ""
        ? resetAllPrimaryAreas(data)
        : handleSearchPrimaryAreas(e?.target?.value, areas, data)
    );

export const setUpAllPrimaryAreas = (data) => {
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  addRow(data, allPrimaryAreas);
};
