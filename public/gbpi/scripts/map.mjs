import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

export const initializeZoom = () => {
  const resetZoom = () => {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  };
  const svg = d3.select("svg");
  const g = svg.select("g");

  // const buttonGroup = svg
  //   .append("g")
  //   .attr("class", "reset-button-group")
  //   .attr("transform", "translate(50, 220)")
  //   .style("cursor", "pointer")
  //   .style("visibility", "hidden") // Initially hidden
  //   .on("click", resetZoom);

  // buttonGroup
  //   .append("image")
  //   .attr("xlink:href", "images/undo.png")
  //   .attr("x", 5)
  //   .attr("y", 5)
  //   .attr("width", 15)
  //   .attr("height", 15);

  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on("zoom", () => {
      g.attr("transform", d3.event.transform);
      adjustStrokeWidth(d3.event.transform.k);

      // if (d3.event.transform.k > 1) {
      //   buttonGroup.style("visibility", "visible");
      // } else {
      //   buttonGroup.style("visibility", "hidden");
      // }
    });

  svg.call(zoom);
};

const adjustStrokeWidth = (k) => {
  d3.selectAll("path").style("stroke-width", 1 / k + "px");
};

export const tooltip = () => {
  const tooltip = createTooltip();

  d3.select("#svg")
    .selectAll("path")
    .on("mouseover", (_, i, nodes) => {
      const target = nodes[i];

      const areaName = target.getAttribute("data-name");
      const index = target.getAttribute("data-index");
      const color = target.getAttribute("data-color");
      const indexTitle = target.getAttribute("data-index-title");

      setTooltip(tooltip, {
        color,
        index,
        areaName,
        indexTitle,
      });
    })
    .on("mouseout", () => removeTooltip(tooltip));
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
    .style("pointer-events", "none");

const removeTooltip = (tooltip) =>
  tooltip.transition().duration(500).style("opacity", 0);

const setTooltip = (tooltip, { color, index, areaName, indexTitle }) => {
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
  const posy = d3.event.pageY;
  const posx = d3.event.pageX;

  const tooltipXPostiton = posx > 240 ? posx - 100 : posx + 10;
  const tooltipYPostiton = posy + 10;

  return {
    tooltipXPostiton,
    tooltipYPostiton,
  };
};
