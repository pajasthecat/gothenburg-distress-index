# Göteborgs Boendeprisindex - GBPI

GBPI is an index that (hopefully at least) measures how easy it is to find a place to live in the primary areas of Gothenburg.


## Generative AI

I always use ChatGPT and/or other generative AI, both professionally and in my private life. In this project this includes, but is not limited to, 
  - Generate explanatory text in a concise way
  - Generate d3 code 
  - Cons and pros regarding different normalization techniques
  - Format data that I input
   - And much more

What I do NOT use it for is to generate/collect data. The reason for that is that I do not know where it gets the data and I want transparency where the data comes from and how it is formatted and converted.

I mention this for transparency.

## Indicator defintion

### 1. Defining parameters

The composite indicator consist of the following indicators:

- Let $MPF/MI$ be the median primary area house price to city wide median income.
- Let $O$ be the ownership rate in the area.
- Let $MQ$ be median queue time for the primary area.
- Let $MR2$ be the median rent on the subletting market. for the primary area.

### 2. Data normalization

Since I want a low score on the index to indicate that it is easier to find a place to live we need to handle $O$ in some way. I choose between flipping it ($ 1 - O$) and invert it ($1/O$). 

I went with flipping since I have a few values close to 0. Inverting the values introduces non-linearity and increase differences on the lower end of the range. The difference between 4% and 5% ownership would be bigger when inverted and could distort the index and impact it disproportionately. Of course I could use logarithmic inversion, but I thought it was simpler to just flip the value.

- $O_{flipped} = 1 - O$

To normalize the values I went with a z-score normalization. It was between that and max-min-normalizer. Since I did not want the index to be beteween 1 and 0 I went with z-score.

- $MPF/MI_{normalized} = \frac{MPF/MI - \mu_{MPF/MI}}{\sigma_{MPF/MI}} $ 
- $O_{normalized} = \frac{O_{flipped} - \mu_{O_{flipped}}}{\sigma_{O_{flipped}}} $ 
- $MQ_{normalized} = \frac{MQ - \mu_{MQ}}{\sigma_{MQ}} $ 
- $MR2_{normalized} = \frac{MR2 - \mu_{MR2}}{\sigma_{MR2}} $ 

### 3. Assigning weights

$w_{MPF/MI} + w_O + w_{MQ} + w_{MR2}= 1$

To see the exact weights, see `pipelines/gbpi/configuration.mjs` 

### 4. Composite indicator

$GBPI = w_{MPF/MI} * MPFI_{normalized} + w_O * O_{normalized} + w_{MQ} * MQ_{normalized} + w_{MR2} * MR2_{normalized}$


## Data pipeline

I use a data pipeline to fetch data. The pipeline can be found in `pipelines/gb`. I collect the data (collect.mjs) and then convert it and do the index calculations (convert.mjs) and then save it in `public/data`.

To get more details on how the data is collected, what endpoints are used etc, please see the corresponding clients.

### Data sources

I collect data from [Booli](https://www.booli.se/) and [Göteborgs Statistikdatbas](https://statistikdatabas.goteborg.se/pxweb/sv/).

| Data | Source| Link | How is the data collected|
| --------------- | -------------- |---------- | ---- |
| Median income   | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px | API |
| Property prices | Booli| https://www.booli.se/graphql| API |
| Ownership rate  | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Bostäder och byggande/Bostadsbestånd/20_Typ_upplatelse_PRI.px| API |
| Median queue time  | Boplats Väst |https://boplats.se/tipshjalp/statistik| Scraped |
| Median rent 2hand  | Qasa | https://qasa.se/blog/hyresrapport-vt-2024 | Collected manually |
