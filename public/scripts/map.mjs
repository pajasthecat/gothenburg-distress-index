import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

import { getIndexValue } from "./helpers.mjs";

const matchGeoDataWithIndexData = (data, d) =>
  data.find((primaryArea) => {
    const areaCode = primaryArea.area.split(" ")[0];

    return areaCode === d.properties["PrimaryAreaCode"];
  });

const drawMap = (data, mapEntries, err) => {
  if (err) throw err;

  const height = 300;
  const width = 480;
  const svg = d3.select("svg").attr("width", width).attr("height", height);

  const myProjection = d3
    .geoAlbers()
    .rotate([-25, 1, 1])
    .fitSize([width, height], mapEntries);

  const path = d3.geoPath().projection(myProjection);

  svg
    .append("g")
    .selectAll("path")
    .data(mapEntries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function (d) {
      const match = matchGeoDataWithIndexData(data, d);

      return match.index_classification.color;
    })
    .on("mouseover", (d) => {
      const match = matchGeoDataWithIndexData(data, d);

      const areaName = match.area.split(" ")[1];
      const index = getIndexValue(match.composite_index);
      const tooltipText = `${areaName} - ESGI: ${index}`;

      d3.select("#tooltip").style("opacity", 1).text(tooltipText);
    })
    .on("mouseout", (e) => {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", function () {
      d3.select("#tooltip")
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    });
};

export const createPrimaryAreaMap = async () => {
  const distressIndex = await (
    await fetch("../data/distress-index.json")
  ).json();

  d3.json("../data/data.geojson").then(drawMap.bind(null, distressIndex));
};
