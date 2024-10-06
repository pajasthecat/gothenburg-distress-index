export const showMap = () => {
  const svgContainer = document.getElementById("svg");

  fetch("data/out.svg")
    .then((res) => res.text())
    .then((text) => (svgContainer.innerHTML = text))
    .catch((e) => console.error(e));
};
