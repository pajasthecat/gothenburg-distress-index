import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

const drawMap = (mapEntries, err, years) => {
  if (err) throw err;
  years.forEach((year, index) => {
    const yearFilter = (prop) => prop.Year === year;

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
      .attr("id", `svg-${year}`)
      .style("display", index === 0 ? "block" : "none")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    svg.call(zoom);

    function zoomed() {
      g.attr("transform", d3.event.transform);
      adjustStrokeWidth(d3.event.transform.k);
    }

    function adjustStrokeWidth(k) {
      g.selectAll("path").style("stroke-width", 1 / k + "px");
    }

    g.selectAll("path")
      .data(mapEntries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", (d) => d.properties.find(yearFilter)["Color"])
      .style("stroke", "white")
      .style("stroke-width", "1px")
      .on("mouseover", (event) => {
        const areaName = event.properties.find(yearFilter)["Name"];
        const index = event.properties.find(yearFilter)["Index"];
        const color = event.properties.find(yearFilter)["Color"];

        setTooltip(tooltip, {
          color,
          index,
          areaName,
        });
      })
      .on("mouseout", () => removeTooltip(tooltip));

    createTitle(svg, year);

    createLabel(svg, mapEntries);
  });
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
        <th>IESG</th>
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
  const posy = d3.event.pageY;
  const posx = d3.event.pageX;

  const tooltipXPostiton = posx > 240 ? posx - 100 : posx + 10;
  const tooltipYPostiton = posy + 10;

  return {
    tooltipXPostiton,
    tooltipYPostiton,
  };
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

const createTitle = (svg, year) => {
  svg
    .append("rect")
    .attr("x", 50)
    .attr("y", 12)
    .attr("width", 120)
    .attr("height", 50)
    .style("fill", "white")
    .style("opacity", 0.9)

    .style("stroke", "white")
    .style("stroke-width", "1px");

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
    .text(`primärområden ${year}`);
};

const createLabel = (svg, data) => {
  const legendData = getColors(data);

  svg
    .append("rect")
    .attr("x", 312)
    .attr("y", 185)
    .attr("width", 95)
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
      const color = curr.properties[0]["Color"];
      const status = curr.properties[0]["Status"];
      const sorting = curr.properties[0]["Sorting"];

      const match = acc.findIndex((item) => item?.label === status);

      if (match === -1) return [...acc, { label: status, color, sorting }];
      return acc;
    }, [])
    .sort((a, b) => a.sorting - b.sorting);
};

export const createPrimaryAreaMap = async (year) =>
  d3
    .json("../data/distress-index.geojson")
    .then((data, error) => drawMap(data, error, year));

export const deleteMap = () => {
  document.getElementById("svg").innerHTML = "";
};
