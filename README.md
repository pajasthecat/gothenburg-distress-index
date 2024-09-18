# Index för Ekonomisk Sårbarhet i Göteborg (IESG)

## Data pipeline

I use a data pipeline to feth data (collect.mjs) and then convert it and do the index calculations (convert.mjs) adn then sva eit in the public folder in `public/data`.

### Data sources

To see details what is beeing fethced, see the client in `src/client.mjs `.

| Data                                  | Source                          | Link                                                                                                                                                                              |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Median                                | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px |
| Unemployment                          | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Arbetsmarknad/Arbetslöshet/10_AntalArblos_PRI.px                                     |
| Upper secondary education eligibility | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Utbildning/30_Gymnbehorig_PRI.px                              |
| Population figures                    | Statistikdatabas Göteborgs Stad | https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Folkmängd/Folkmängd helår/10_FolkmHelar_PRI.px                            |

## Map

The geo data has been gathered by using the .sh format published bt [Göteborgs Stadsbyggnadskontor](https://goteborg.se/wps/portal/enhetssida/statistik-och-analys/geografi/gisskikt-for-stadens-omradesindelning) and then converted it to geojson trough [mapshaper.com](https://mapshaper.org/).
