export const getMedianIncome = async () => {
  const body = JSON.stringify({
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
  });

  const url =
    "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Inkomster/Förvärvsinkomster etc/23_InkomsterUtbildning_PRI.px";

  const response = await fetchData(url, body);

  const data = response.data.map((d) => mapResponse(d, "medianIncome"));

  return data;
};

export const getUnemploymentFigures = async () => {
  const body = JSON.stringify({
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
  });

  const url =
    "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Arbetsmarknad/Arbetslöshet/10_AntalArblos_PRI.px";

  const response = await fetchData(url, body);

  const data = response.data.map((d) => mapResponse(d, "unemployed"));

  return data.reduce((accumulator, current) => {
    const match = accumulator.find((a) => a.area === current.area);

    if (match === undefined) return [...accumulator, { ...current }];

    const index = accumulator.findIndex((item) => item.area === match.area);

    const updatedMatch = {
      ...match,
      unemployed: match.unemployed + current.unemployed,
    };

    accumulator[index] = updatedMatch;
    return accumulator;
  }, []);
};

export const getPopulation = async () => {
  const body = JSON.stringify({
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
  });

  const url =
    "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Befolkning/Folkmängd/Folkmängd helår/10_FolkmHelar_PRI.px";

  const response = await fetchData(url, body);

  const data = response.data.map((d) => mapResponse(d, "population"));

  return data.reduce((accumulator, current) => {
    const match = accumulator.find((a) => a.area === current.area);

    if (match === undefined) return [...accumulator, { ...current }];

    const index = accumulator.findIndex((item) => item.area === match.area);

    const updatedMatch = {
      ...match,
      population: match.population + current.population,
    };

    accumulator[index] = updatedMatch;
    return accumulator;
  }, []);
};

export const getUsse = async () => {
  const body = JSON.stringify({
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
  });

  const url =
    "https://statistikdatabas.goteborg.se/api/v1/sv/1. Göteborg och dess delområden/Primärområden/Inkomst och utbildning/Utbildning/30_Gymnbehorig_PRI.px";

  const response = await fetchData(url, body);

  const data = response.data
    .filter((d) => d.key[1] === "0")
    .map((d) => {
      const area = d.key[0];
      const eligible = parseInt(d.values[0]);

      return { area, eligible };
    });

  return data.map((d) => {
    const match = response.data.find(
      (res) => res.key[0] === d.area && res.key[1] === "1"
    );

    const nonEligible = parseInt(match.values[0]);

    return { ...d, nonEligible };
  });
};

const fetchData = async (url, body) => {
  const requestOptions = {
    method: "POST",
    body: body,
  };

  const response = await fetch(url, requestOptions);

  return await response.json();
};

const mapResponse = (data, valueName) => {
  const area = data.key[0];
  const value = parseInt(data.values[0]);

  return { area, [valueName]: value };
};
