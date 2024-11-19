let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwiping = false;
let currentPage = 0;

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

  updatePagination(currentPage);
};

const handleSearchPrimaryAreas = (e, areas, data) => {
  const searchText = e?.target?.value;
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

  updatePagination(currentPage);
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
  <tr>
       <td class="sticky">${area}</td>
       <td style="background-color: ${color}; color: white">${status}</td>
       <td style="background-color: ${color}; color: white">${index}</td>
       <td style="background-color: ${color}; color: white">${mimh}</td>
       <td style="background-color: ${color}; color: white">${medianQueueTime}</td>
       <td style="background-color: ${color}; color: white">${ownershipRate}</td>
       <td style="background-color: ${color}; color: white">${medianRent}</td>
     </tr>
 `;

const getPaginationDot = () => document.getElementById("pagination-dots");

const createDots = (paginationDots, newPage, totalPages) => {
  paginationDots.innerHTML = "";
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("div");
    dot.classList.add("pagination-dot");
    if (i === newPage) dot.classList.add("active");
    dot.dataset.page = i;
    paginationDots.appendChild(dot);
  }
};

export const updatePagination = (newPage) => {
  const table = document.getElementById("allPrimaryAreas");
  const rows = table.querySelectorAll("tbody tr");
  const headerCells = table.querySelectorAll("thead th");
  const totalColumns = headerCells.length - 1;
  const columnsPerPage = 2;

  const paginationDots = getPaginationDot();
  const totalPages = Math.ceil(totalColumns / columnsPerPage);

  const pageToUpdateTo =
    totalPages === newPage || newPage === -1 ? currentPage : newPage;

  const startColumn = pageToUpdateTo * columnsPerPage + 1;
  const endColumn = startColumn + columnsPerPage;

  headerCells.forEach((cell, index) => {
    cell.style.display =
      index === 0 || (index >= startColumn && index < endColumn) ? "" : "none";
  });

  rows.forEach((row) => {
    Array.from(row.cells).forEach((cell, index) => {
      cell.style.display =
        index === 0 || (index >= startColumn && index < endColumn)
          ? ""
          : "none";
    });
  });

  createDots(paginationDots, pageToUpdateTo, totalPages);

  currentPage = pageToUpdateTo;
};

const handleSwipe = () => {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) > 30) {
    if (swipeDistance > 0) {
      const newPage = currentPage - 1;
      updatePagination(newPage);
    } else {
      const newPage = currentPage + 1;
      updatePagination(newPage);
    }
  }

  touchStartX = 0;
  touchEndX = 0;
};

export const setTouchEvent = () => {
  const tableContainer = document.querySelector(".tableContainer");

  tableContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = false;
  });

  tableContainer.addEventListener("touchmove", (e) => {
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (!isSwiping && Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwiping = true;
    }

    if (isSwiping) {
      e.preventDefault();
    }
  });

  tableContainer.addEventListener("touchend", () => {
    if (isSwiping) {
      handleSwipe();
    }
    touchStartX = touchEndX = touchStartY = touchEndY = 0;
    isSwiping = false;
  });
};

export const setTablePaginationListener = () =>
  getPaginationDot().addEventListener("click", (e) => {
    if (e.target.classList.contains("pagination-dot")) {
      const newPage = parseInt(e.target.dataset.page);
      updatePagination(newPage);
    }
  });

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
        : handleSearchPrimaryAreas(e, areas, data)
    );

export const setUpAllPrimaryAreas = (data) => {
  const allPrimaryAreas = document.getElementById("allPrimaryAreas");

  addRow(data, allPrimaryAreas);
};
