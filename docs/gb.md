# Göteborgs Boendebarometer


## Indicator

### 1. Defining parameters

The composite indicator consist of the following indicators:

- Let $MIMH$ be the median primary area income to median house price.
- Let $O$ be the ownership rate in the area.

### 2. Data normalization



### 3. Assigning weights



### 4. Composite indicator


## Data pipeline

I use a data pipeline to fetch data. The pipeline can be found in ``pipelines/gb``. I collect the data (collect.mjs) and then convert it and do the index calculations (convert.mjs) and then save it in `public/data`.

### Data sources

I collect data from [Booli](https://www.booli.se/) and [Göteborgs Statistikdatbas](https://statistikdatabas.goteborg.se/pxweb/sv/).

| Data                                  | Source                          | Link                                                                                                                                                                              |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Median income                         | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px |
| Property prices                          | Booli | https://www.booli.se/graphql | 
| Ownership rate                        | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Bostäder och byggande/Bostadsbestånd/20_Typ_upplatelse_PRI.px| 

