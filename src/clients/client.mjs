import { configuration } from "./configuration.js";

export const getMedianIncome = async () => {
  const response = await fetchData(
    configuration.medianIncome.url,
    configuration.medianIncome.body,
    "medianIncome"
  );

  const data = response.data.map((d) => {
    const area = d.key[0];
    const year = d.key[5] === "202" ? "2020" : d.key[5];
    const value = parseInt(d.values[0]);

    return { area, year, medianIncome: value };
  });
  // const data = response.data.map((d) => mapResponse(d, "medianIncome", 5));

  return data;
};

export const getGovernmentAssistanceFigures = async () => {
  const response = await fetchData(
    configuration.welfareRecipients.url,
    configuration.welfareRecipients.body,
    "getGovernmentAssistanceFigures"
  );

  return response.data.reduce((agg, current) => {
    const area = current.key[0];
    const year = current.key[3];

    const index = agg.findIndex((a) => a.area === area && a.year === year);

    if (index === -1)
      return [
        ...agg,
        {
          area,
          year,
          populationOnGovernmentAssistance: parseInt(current.values[0]),
        },
      ];

    agg[index].populationOnGovernmentAssistance += parseInt(current.values[0]);

    return agg;
  }, []);
};

export const getUnemploymentFigures = async () => {
  const response = await fetchData(
    configuration.unemployment.url,
    configuration.unemployment.body,
    "getUnemploymentFigures"
  );

  const data = response.data.map((d) => mapResponse(d, "unemployed", 4));

  return data.reduce((accumulator, current) => {
    const match = accumulator.find(
      (a) => a.area === current.area && a.year === current.year
    );

    if (match === undefined) return [...accumulator, { ...current }];

    const index = accumulator.findIndex(
      (item) => item.area === match.area && item.year === match.year
    );

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
    configuration.population.body,
    "getPopulation"
  );

  const data = response.data.map((d) => mapResponse(d, "population", 3));

  return data.reduce((accumulator, current) => {
    const match = accumulator.find(
      (a) => a.area === current.area && a.year === current.year
    );

    if (match === undefined) return [...accumulator, { ...current }];

    const index = accumulator.findIndex(
      (item) => item.area === match.area && item.year === match.year
    );

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
    configuration.usse.body,
    "getUsse"
  );

  const data = response.data
    .filter((d) => d.key[1] === "0")
    .map((d) => {
      const area = d.key[0];
      const year = d.key[2];
      const eligible = parseInt(d.values[0]);

      return { area, eligible, year };
    });

  return data.map((d) => {
    const match = response.data.find(
      (res) =>
        res.key[0] === d.area && res.key[2] === d.year && res.key[1] === "1"
    );

    const nonEligible = parseInt(match.values[0]);

    return { ...d, nonEligible };
  });
};

const fetchData = async (url, body, functionName) => {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "accept-encoding": "gzip,deflate",
      "Content-Type": "text/plain",
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    return await response.json();
  } catch (error) {
    console.log({ error, functionName });
    throw error;
  }
};

const mapResponse = (data, valueName, yearIndex) => {
  const area = data.key[0];
  const year = data.key[yearIndex];
  const value = parseInt(data.values[0]);

  return { area, year, [valueName]: value };
};
