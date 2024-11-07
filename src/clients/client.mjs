import { configuration } from "./configuration.js";

export const getMedianIncome = async () => {
  const response = await fetchData(
    configuration.medianIncome.url,
    configuration.medianIncome.body
  );

  const data = response.data.map((d) => mapResponse(d, "medianIncome"));

  return data;
};

export const getPropertyOwnershipRate = async (years) => {
  const response = await fetchData(
    configuration.houseOwnershipRateYears.url,
    configuration.houseOwnershipRateYears.body(years)
  );

  const data = response.data.reduce((agg, response) => {
    const [area, _, type, year] = response.key;
    const value = parseInt(response.values[0]);

    const rent = type === "Hyresrätt" ? value : 0;
    const own = type === "Bostadsrätt" || type === "Äganderätt" ? value : 0;
    const other = type === "Uppgift saknas" ? value : 0;

    const chosenYear = agg[year];

    const data = { area, propertyOwnershipRate: { rent, own, other } };

    if (!chosenYear) return { [year]: [data] };

    const index = chosenYear.findIndex((_) => _.area === area);

    if (index === -1) {
      return { [year]: [...chosenYear, data] };
    }

    chosenYear[index] = {
      area,
      propertyOwnershipRate: {
        rent: chosenYear[index].propertyOwnershipRate.rent + rent,
        other: chosenYear[index].propertyOwnershipRate.other + other,
        own: chosenYear[index].propertyOwnershipRate.own + own,
      },
    };

    return { [year]: [...chosenYear] };
  }, {});

  return data;
};

export const getMedianIncomes = async (years) => {
  const response = await fetchData(
    configuration.medianIncomeYears.url,
    configuration.medianIncomeYears.body(years)
  );

  const data = response.data
    .map((d) => mapResponseByYear(d, "medianIncome"))
    .reduce((agg, current) => {
      const { area, medianIncome, year } = current;

      const data = { area, medianIncome };

      const choosenYear = agg[year];

      if (!choosenYear) return { [year]: [data] };

      return { [year]: [...choosenYear, data] };
    }, {});

  return data;
};

export const getGovernmentAssistanceFigures = async () => {
  const response = await fetchData(
    configuration.welfareRecipients.url,
    configuration.welfareRecipients.body
  );

  return response.data.reduce((agg, current) => {
    const area = current.key[0];

    const index = agg.findIndex((a) => a.area === area);

    if (index === -1)
      return [
        ...agg,
        { area, populationOnGovernmentAssistance: parseInt(current.values[0]) },
      ];

    agg[index].populationOnGovernmentAssistance += parseInt(current.values[0]);

    return agg;
  }, []);
};

export const getUnemploymentFigures = async () => {
  const response = await fetchData(
    configuration.unemployment.url,
    configuration.unemployment.body
  );

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
  const response = await fetchData(
    configuration.population.url,
    configuration.population.body
  );

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
  const response = await fetchData(
    configuration.usse.url,
    configuration.usse.body
  );

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
    body: JSON.stringify(body),
  };

  const response = await fetch(url, requestOptions);

  return await response.json();
};

const mapResponse = (data, valueName) => {
  const area = data.key[0];
  const value = parseInt(data.values[0]);

  return { area, [valueName]: value };
};

const mapResponseByYear = (data, valueName) => {
  const area = data.key[0];
  const year = data.key[5];
  const value = parseInt(data.values[0]);

  return { area, [valueName]: value, year };
};
