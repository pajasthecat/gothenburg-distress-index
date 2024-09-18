import data from "../data/primary-area.json" with {"type": "json"};

const searchTerm = "Banjo";

const t = data.filter(d => d.address.includes(searchTerm));

console.log({t});
