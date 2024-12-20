export const configuration = {
  usse: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Utbildning/30_Gymnbehorig_PRI.px",
    body: {
      query: [
        {
          code: "År",
          selection: {
            filter: "item",
            values: ["2022"],
          },
        },
      ],
      response: {
        format: "json",
      },
    },
  },
  population: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Folkmängd/Folkmängd helår/10_FolkmHelar_PRI.px",
    body: {
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "agg:Ettårs_13.agg",
            values: ["20-64 år"],
          },
        },
        {
          code: "Kön",
          selection: {
            filter: "item",
            values: ["Man", "Kvinna"],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: ["2022"],
          },
        },
      ],
      response: {
        format: "json",
      },
    },
  },
  populationByYear: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Folkmängd/Folkmängd helår/10_FolkmHelar_PRI.px",
    body: (years) => ({
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "agg:Ettårs_13.agg",
            values: ["20-64 år"],
          },
        },
        {
          code: "Kön",
          selection: {
            filter: "item",
            values: ["Man", "Kvinna"],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: years,
          },
        },
      ],
      response: {
        format: "json",
      },
    }),
  },
  unemployment: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Arbetsmarknad/Arbetslöshet/10_AntalArblos_PRI.px",
    body: {
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "item",
            values: ["18-24 år", "25-54 år", "55-64 år"],
          },
        },
        {
          code: "Kön",
          selection: {
            filter: "item",
            values: ["Män", "Kvinnor"],
          },
        },
        {
          code: "Arbetssökandekategori",
          selection: {
            filter: "item",
            values: ["Öppet arbetslösa"],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: ["2022"],
          },
        },
      ],
      response: {
        format: "json",
      },
    },
  },
  welfareRecipients: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/20_HuvudInk_PRI.px",
    body: {
      query: [
        {
          code: "Kön",
          selection: {
            filter: "item",
            values: ["Man", "Kvinna"],
          },
        },
        {
          code: "Huvudsaklig inkomstkälla",
          selection: {
            filter: "item",
            values: ["Ekonomiskt bistånd"],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: ["2021"],
          },
        },
      ],
      response: {
        format: "json",
      },
    },
  },
  medianIncome: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px",
    body: {
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "item",
            values: ["18- år"],
          },
        },
        {
          code: "Kön",
          selection: {
            filter: "item",
            values: ["Båda kön"],
          },
        },
        {
          code: "Utbildningsnivå",
          selection: {
            filter: "item",
            values: ["Totalt (alla utbildningsnivåer)"],
          },
        },
        {
          code: "Tabellvärde",
          selection: {
            filter: "item",
            values: ["Medianinkomst"],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: ["2022"],
          },
        },
      ],
      response: {
        format: "json",
      },
    },
  },
  medianIncomeYears: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px",
    body: (years) => ({
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "item",
            values: ["18- år"],
          },
        },
        {
          code: "Kön",
          selection: {
            filter: "item",
            values: ["Båda kön"],
          },
        },
        {
          code: "Utbildningsnivå",
          selection: {
            filter: "item",
            values: ["Totalt (alla utbildningsnivåer)"],
          },
        },
        {
          code: "Tabellvärde",
          selection: {
            filter: "item",
            values: ["Medianinkomst"],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: years,
          },
        },
      ],
      response: {
        format: "json",
      },
    }),
  },
  houseOwnershipRateYears: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Bostäder och byggande/Bostadsbestånd/20_Typ_upplatelse_PRI.px",
    body: (years) => ({
      query: [
        {
          code: "Hustyp",
          selection: {
            filter: "item",
            values: [
              "Småhus",
              "Flerbostadshus",
              "Övriga hus",
              "Specialbostäder",
            ],
          },
        },
        {
          code: "Upplåtelseform",
          selection: {
            filter: "item",
            values: [
              "Hyresrätt",
              "Bostadsrätt",
              "Äganderätt",
              "Uppgift saknas",
            ],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: years,
          },
        },
      ],
      response: {
        format: "json",
      },
    }),
  },
  movingData: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Flyttningar/10_PRI_Flytt_Alla.px",
    body: (years) => ({
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "item",
            values: [
              "0-5 år",
              "6-15 år",
              "16-17 år",
              "18-24 år",
              "25-34 år",
              "35-44 år",
              "45-54 år",
              "55-64 år",
              "65-74 år",
              "75- år",
            ],
          },
        },
        {
          code: "Typ av flyttning",
          selection: {
            filter: "item",
            values: [
              "Inflyttning från annat primärområde i Göteborg",
              "Utflyttning till annat primärområde i Göteborg",
              "Inflyttning från kommun i Stor-Göteborg",
              "Utflyttning till kommun i Stor-Göteborg",
              "Inflyttning från övriga riket",
              "Utflyttning till övriga riket",
              "Invandring",
              "Utvandring",
            ],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: years,
          },
        },
      ],
      response: {
        format: "json",
      },
    }),
  },
  overCrowdingRate: {
    url: "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Trångboddhet/10_Trangbodd_PRI.px",
    body: (years) => ({
      query: [
        {
          code: "Ålder",
          selection: {
            filter: "item",
            values: [
              "0-5 år",
              "6-15 år",
              "16-18 år",
              "19-24 år",
              "25-34 år",
              "35-44 år",
              "45-54 år",
              "55-64 år",
              "65-74 år",
              "75-84 år",
              "85- år",
            ],
          },
        },
        {
          code: "År",
          selection: {
            filter: "item",
            values: years,
          },
        },
      ],
      response: {
        format: "json",
      },
    }),
  },
  boplats: {
    tables: [
      "Angered",
      "Askim-Frölunda-Högsbo",
      "Centrum",
      "Lundby",
      "Majorna-Linné",
      "Norra Hisingen",
      "Västra Göteborg",
      "Västa Hisningen",
      "Örgryte-Härlanda",
      "Östra Göteborg",
    ],
  },
};
