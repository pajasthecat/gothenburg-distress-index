import d3Pkg from "d3";
const { select, geoAlbers, geoPath, event } = d3Pkg;
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";

import { addGbDataToGeoData } from "../mappers/geoDataEnricher.mjs";

export const buildMap = (indexData, mapOptions) => {
  const geoData = JSON.parse(readFileSync("data/data.geojson"));
  const mapData = addGbDataToGeoData(indexData, geoData);
  return drawMap(mapData, mapOptions);
};

const drawMap = (mapEntries, labels) => {
  const { year, mapTitle, indexShortTitle } = labels;
  const domObj = new JSDOM(`<!DOCTYPE html><body><div id="svg"></div></body>`);

  let svgContainer = select(domObj.window.document.getElementById("svg"));
  const height = 300;
  const width = 480;

  const myProjection = geoAlbers()
    .rotate([-25, 1, 1])
    .fitSize([width, height], mapEntries);

  const path = geoPath().projection(myProjection);

  const svg = svgContainer
    .append("svg")
    .attr("id", `svg-${year}`)
    .style("display", "block")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g");

  g.selectAll("path")
    .data(mapEntries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("data-color", (d) => d.properties["Color"])
    .attr("data-name", (d) => d.properties["Name"])
    .attr("data-index", (d) => d.properties["Index"])
    .attr("data-index-title", () => indexShortTitle)
    .style("fill", (d) => d.properties["Color"])
    .style("stroke", "white")
    .style("stroke-width", "1px");

  createTitle(svg, year, mapTitle);

  createLabel(svg, mapEntries);

  return svgContainer.html();
};

const createTitle = (svg, year, mapTitle) => {
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 150)
    .attr("height", 45)
    .style("fill", "white")
    .style("opacity", 0.9)
    .style("stroke", "white")
    .style("stroke-width", "1px");

  svg
    .append("text")
    .attr("class", "mapTitle")
    .attr("x", 10)
    .attr("y", 15)
    .text("Göteborgs");
  svg
    .append("text")
    .attr("class", "mapTitle")
    .attr("x", 10)
    .attr("y", 35)
    .text(`${mapTitle} ${year}`);
};

const createLabel = (svg, data) => {
  const legendData = getColors(data);

  svg
    .append("rect")
    .attr("x", 312)
    .attr("y", 185)
    .attr("width", 110)
    .attr("height", 70)
    .style("fill", "white")
    .style("stroke", "white")
    .style("opacity", 0.9)
    .style("stroke-width", "1px");

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20,20)");

  // Create legend items
  const legendItems = legend
    .selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(300, ${175 + i * 15})`);
  // Add colored rectangles
  legendItems
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (d) => d.color);

  // Add text labels
  legendItems
    .append("text")
    .attr("x", 15)
    .attr("y", 5)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text((d) => d.label);
};

const getColors = (data) => {
  return data.features
    .reduce((acc, curr) => {
      const color = curr.properties["Color"];
      const status = curr.properties["Status"];
      const sorting = curr.properties["Sorting"];

      const match = acc.findIndex((item) => item?.label === status);

      if (match === -1) return [...acc, { label: status, color, sorting }];
      return acc;
    }, [])
    .sort((a, b) => a.sorting - b.sorting);
};
