import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

const drawMap = (mapEntries, err) => {
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
    .style("fill", (d) => d.properties["Color"])
    .on("mouseover", (d) => {
      const areaName = d.properties["Name"];
      const index = d.properties["Index"];
      const tooltipText = `${areaName}: ${index}`;

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

export const createPrimaryAreaMap = async () =>
  d3.json("../data/distress-index.geojson").then(drawMap);
