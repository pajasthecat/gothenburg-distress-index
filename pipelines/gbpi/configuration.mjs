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
      color: "#66A182",
    },
    2: {
      status: "Överkomligt",
      color: "#4B8F72",
    },
    3: {
      status: "Neutralt",
      color: "#3B7D63",
    },
    4: {
      status: "Svåröverkomligt",
      color: "#2C6B54",
    },
    5: {
      status: "Svårtillgängligt",
      color: "#1C4D3B",
    },
  },
};
