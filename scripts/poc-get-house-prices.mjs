import housePrices from "./data/prices.json" with {type: "json"};
import primaryAreas from "./data/primary-area.json" with {type: "json"};
import { getMedianIncome } from "../src/clients/client.mjs"

const normalizeString = (input) => input.toLowerCase().replace(/\s/g, "")

const medianIncome = await getMedianIncome();
console.log({medianIncome});


const res = Object.values(housePrices.pageProps.__APOLLO_STATE__).filter(_ => _.__typename === "SaleCard").reduce((aggregat, current) => {
    const price = parseInt(current.finalPrice.split("kr")[0].replace(/\s/g, ""))
    const year = current.soldAtLabel.match( /\b(19|20)\d{2}\b/g);
    const area = primaryAreas.find(_ => normalizeString(_.address) === normalizeString(current.streetAddress))?.primary_area;
    const median = medianIncome.find(_ => _.area === area && _.year === year);

    console.log({price, median, year});
    
    const t = price / (median * 0.85);
    if(!area) return aggregat;

    if(aggregat.length === 0  ) return [{area, prices: [t]}];

    const index = aggregat.findIndex(_ => _.area === area);
    if(index === -1){
        return [...aggregat,  {area, prices: [t]}]

    }

    aggregat[index] = {area, prices: [...aggregat[index].prices, t]};
    return aggregat;
}, [])

console.log(res[0]);
