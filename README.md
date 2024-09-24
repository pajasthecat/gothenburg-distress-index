# Index för Ekonomisk Sårbarhet i Göteborg (IESG)

## Url

You can find the index presented [here](https://iesg.pages.dev/).

## Indicator

### 1. Defining parameters

The composite indicator consist of the following indicators:

- Let $I$ be the income quintile of the median income compared to the other areas.
- Let $U$ be the unemployment indicator.
- Let $E$ be the upper secondary education ineligibility indicator.

### 2. Data normalization

Since the data has different ranges I have normalized them, with a max-min normalizer (feature scaling) which performs a linear transformation on the original data.

- $I´ = \dfrac{I - I*{min}}{I*{max} - I\_{min}} $

- $U´ = \dfrac{U - U*{min}}{U*{max} - U\_{min}} $

- $E´ = \dfrac{E - E*{min}}{E*{max} - E\_{min}} $

### 3. Aissigning weights

- $w_I + w_U + w_E = w_{sum}$

### 4. Composite indicator

$IESG = \dfrac{ (1 -w_I * I´) + w_U * U´ + w_E * E´}{w_{sum}}$

## Data pipeline

I use a data pipeline to fetch data (collect.mjs) and then convert it and do the index calculations (convert.mjs) and then save it in `public/data`.

### Data sources

To see details what is being fetched, see the client in `src/client.mjs `.

| Data                                  | Source                          | Link                                                                                                                                                                              |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Median income                         | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px |
| Unemployment                          | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Arbetsmarknad/Arbetslöshet/10_AntalArblos_PRI.px                                     |
| Upper secondary education eligibility | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Utbildning/30_Gymnbehorig_PRI.px                              |
| Population figures                    | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Folkmängd/Folkmängd helår/10_FolkmHelar_PRI.px                            |

## Map

The geo data has been gathered by using the .sh format published by [Göteborgs Stadsbyggnadskontor](https://goteborg.se/wps/portal/enhetssida/statistik-och-analys/geografi/gisskikt-for-stadens-omradesindelning) and then converted to geojson with the help of [mapshaper.com](https://mapshaper.org/).

### Help creating d3 maps

| Tool                                                   | Link                                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Map visualization of open data with D3 (Part3)         | https://medium.com/@ttemplier/map-visualization-of-open-data-with-d3-part3-db98e8b346b3#.nyzbvyczd |
| Introduction to Digital Cartography: GeoJSON and D3.js | https://medium.com/@amy.degenaro/introduction-to-digital-cartography-geojson-and-d3-js-c27f066aa84 |
