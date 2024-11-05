import d3Pkg from "d3";
const { select, geoAlbers, geoPath, event } = d3Pkg;
import d3ZoomPkg from "d3-zoom";
const { zoom: d3Zoom, event: zoomEvent } = d3ZoomPkg;
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";

import { addGbDataToGeoData } from "../mappers/geoDataEnricher.mjs";

const drawMap = (mapEntries, labels) => {

  const  {year, mapTitle, indexTitle} = labels
  const domObj = new JSDOM(`<!DOCTYPE html><body><div id="svg"></div></body>`);

  let svgContainer = select(domObj.window.document.getElementById("svg"));
  const height = 300;
  const width = 480;

  const myProjection = geoAlbers()
    .rotate([-25, 1, 1])
    .fitSize([width, height], mapEntries);

  const path = geoPath().projection(myProjection);

  const tooltip = createTooltip(svgContainer);

  const svg = svgContainer
    .append("svg")
    .attr("id", `svg-${year}`)
    .style("display", "block")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g");

  const zoom = d3Zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  svg.call(zoom);

  function zoomed() {
    g.attr("transform", zoomEvent.transform);
    adjustStrokeWidth(zoomEvent.transform.k);
  }

  function adjustStrokeWidth(k) {
    g.selectAll("path").style("stroke-width", 1 / k + "px");
  }

  g.selectAll("path")
    .data(mapEntries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", (d) => d.properties["Color"])
    .style("stroke", "white")
    .style("stroke-width", "1px")
    .on("mouseover", (event) => {
      const areaName = event.properties["Name"];
      const index = event.properties["Index"];
      const color = event.properties["Color"];

      setTooltip(tooltip, {
        color,
        index,
        areaName,
      });
    })
    .on("mouseout", () => removeTooltip(tooltip));

  createTitle(svg, year, mapTitle);

  createLabel(svg, mapEntries);

  return svgContainer.html();
};

const removeTooltip = (tooltip) =>
  tooltip.transition().duration(500).style("opacity", 0);

const setTooltip = (tooltip, { color, index, areaName }) => {
  const { tooltipYPostiton, tooltipXPostiton } = getToolTipPosition();

  const tooltipText = `
    <table class="innerTable">
      <tr>
        <th>Område</th>
        <td>${areaName}</td>
      </tr>
      <tr>
        <th>${indexTitle}</th>
        <td>${index}</td>
      </tr>
    </table>
  `;

  tooltip
    .html(tooltipText)
    .style("background-color", color)
    .style("color", "white")
    .style("left", `${tooltipXPostiton}px`)
    .style("top", `${tooltipYPostiton}px`)
    .transition()
    .duration(200)
    .style("opacity", 0.9);
};

const getToolTipPosition = () => {
  const posy = event.pageY;
  const posx = event.pageX;

  const tooltipXPostiton = posx > 240 ? posx - 100 : posx + 10;
  const tooltipYPostiton = posy + 10;

  return {
    tooltipXPostiton,
    tooltipYPostiton,
  };
};

const createTooltip = (svgContainer) =>
  svgContainer
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("border", "1px solid white")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("pointer-events", "none");

const createTitle = (svg, year, mapTitle) => {
  svg
    .append("rect")
    .attr("x", 50)
    .attr("y", 12)
    .attr("width", 140)
    .attr("height", 45)
    .style("fill", "white")
    .style("opacity", 0.9)
    .style("stroke", "white")
    .style("stroke-width", "1px");

  svg
    .append("text")
    .attr("class", "mapTitle")
    .attr("x", 55)
    .attr("y", 30)
    .text("Göteborgs");
  svg
    .append("text")
    .attr("class", "mapTitle")
    .attr("x", 55)
    .attr("y", 50)
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

export const createPrimaryAreaMap = (indexData, options) => {
  const geoData = JSON.parse(readFileSync("data/data.geojson"));
  const mapData = addGbDataToGeoData(indexData, geoData);
  return drawMap(mapData, options);
};
