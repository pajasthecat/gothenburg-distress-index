import { normalizeString } from "../normalizers.mjs";

export const toPriceByYear = (booliData, primaryAreas) =>
  Object.keys(booliData).reduce((agg, year) => {
    console.log(`Mapping booli year ${year}`);

    const value = booliData[year].reduce((aggregate, pp) => {
      const price = pp.soldPrice?.raw;
      const priceSqm = pp?.soldSqmPrice?.raw;

      const area = primaryAreas.find(
        (primaryArea) =>
          normalizeString(primaryArea.address) ===
          normalizeString(pp.streetAddress)
      )?.primary_area;

      if (!area || !price || !priceSqm) return aggregate;

      const index = aggregate.findIndex((_) => _.area === area);

      if (index === -1) {
        return [...aggregate, { area, propertyPrices: [{ price, priceSqm }] }];
      }

      aggregate[index] = {
        area,
        propertyPrices: [
          ...aggregate[index].propertyPrices,
          { price, priceSqm },
        ],
      };

      return aggregate;
    }, []);

    return { ...agg, [year]: value };
  }, {});
