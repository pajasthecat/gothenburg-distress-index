export const config = {
  years: ["2022"],
  propertyPrices: {
    fetch: false,
  },
  titles: {
    mimhTitle: "MP/ML kvot",
    indexTitle: "Göteborgs Boendeprisindex",
    indexShortTitle: "GBPI",
  },
  scales: {
    gothenburgMedianIncomeToMedianHousePrice: 0.45,
    ownershipRate: 0.25,
    netMigration: 0.15,
    overCrowdingRate: 0.15,
  },
  classification: {
    1: {
      status: "Lätttillgängligt",
      color: "#4CAF50",
    },
    2: {
      status: "Överkomligt",
      color: "#8BC34A",
    },
    3: {
      status: "Neutralt",
      color: "#FFEB3B",
    },
    4: {
      status: "Svåröverkomligt",
      color: "#FF9800",
    },
    5: {
      status: "Svårtillgängligt",
      color: "#F44336",
    },
  },
};
