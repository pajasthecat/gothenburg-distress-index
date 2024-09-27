import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

const drawMap = (mapEntries, err) => {
  if (err) throw err;

  const height = 300;
  const width = 480;

  const myProjection = d3
    .geoAlbers()
    .rotate([-25, 1, 1])
    .fitSize([width, height], mapEntries);

  const path = d3.geoPath().projection(myProjection);

  const tooltip = createTooltip();

  const svg = d3
    .select("#svg")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("g")
    .selectAll("path")
    .data(mapEntries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", (d) => d.properties["Color"])
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

  createTitle(svg);

  createLabel(svg, mapEntries);
};

const removeTooltip = (tooltip) =>
  tooltip.transition().duration(500).style("opacity", 0);

const setTooltip = (tooltip, { color, index, areaName }) => {
  const posy = d3.event.pageY;
  const posx = d3.event.pageX;

  tooltip.style("background-color", color);
  tooltip.style("color", "white");
  tooltip.transition().duration(200).style("opacity", 0.9);

  tooltip
    .html(`${areaName}<br>IESG: ${index}`)
    .style("left", posx + 10 + "px")
    .style("top", posy + 10 + "px");
};

const createTooltip = () =>
  d3
    .select("#svg")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("border", "1px solid white")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("pointer-events", "none")
    .style("font-size", "x-small");

const createTitle = (svg) => {
  svg
    .append("text")
    .attr("x", 55)
    .attr("y", 30)
    .style("font-size", "x-small")
    .text("Göteborgs");
  svg
    .append("text")
    .attr("x", 55)
    .attr("y", 50)
    .style("font-size", "x-small")
    .text("primärområden 2024");
};

const createLabel = (svg, data) => {
  const legendData = getColors(data);

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
    .attr("transform", (d, i) => `translate(300, ${175 + i * 10})`);

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

export const createPrimaryAreaMap = async () =>
  d3.json("../data/distress-index.geojson").then(drawMap);
