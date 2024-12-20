# Index för Ekonomisk Sårbarhet i Göteborg (IESG)

## Url

You can find the index presented [here](https://iesg.pages.dev/).

## Indicator

### 1. Defining parameters

The composite indicator consist of the following indicators:

- Let $I$ be the income quintile of the median income compared to the other areas.
- Let $U$ be the unemployment percentage in the area.
- Let $E$ be the percentage of non-eligible to upper secondary education in the area.
- Let $WR$ be the percentage of welfare recipients in the area.

### 2. Data normalization

For $I$ I will invert the value. I.E if the quintile is 0.9, the inverted value will be 0.1. This is because a higher value indicates less stress. To align it with the scale of the other values we have to invert it.

- $I^{-1} = 1 - I$

Since the data has different ranges I have normalized them, with a max-min normalizer (feature scaling) which performs a linear transformation on the original data.


- $I^{-1}´ = \dfrac{I^{-1} - I^{-1}_{min}}{I^{-1}_{max} - I^{-1}_{min}} $

- $U´ = \dfrac{U - U_{min}}{U_{max} - U_{min}} $

- $E´ = \dfrac{E - E_{min}}{E_{max} - E_{min}} $

- $WR´ = \dfrac{WR - WR_{min}}{WR_{max} - WR_{min}} $

### 3. Assigning weights

- $w_I + w_U + w_E + w_{W R}= 1$

### 4. Composite indicator

$IESG =  w_I * I^{-1} ´ + w_U * U´ + w_E * E + w_{WR} * WR´$

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