export const mapResponse = (data, valueName) => {
  const area = data.key[0];
  const value = parseInt(data.values[0]);

  return { area, [valueName]: value };
};

export const mapResponseByYear = (data, valueName) => {
  const area = data.key[0];
  const year = data.key[5];
  const value = parseInt(data.values[0]);

  return { area, [valueName]: value, year };
};

export const mapPopulation = (response) => {
  return response.data
    .map((d) => mapResponse(d, "population"))
    .reduce((accumulator, current) => {
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

export const mapPopulationByYear = (response) =>
  response.data.reduce((agg, { key, values }) => {
    const [area, _, __, year] = key;
    const population = parseInt(values[0]);

    const chosenYear = agg[year];

    const data = { area, population };

    if (!chosenYear) return { [year]: [data] };

    const index = chosenYear.findIndex((_) => _.area === area);

    if (index === -1) {
      return { [year]: [...chosenYear, data] };
    }

    chosenYear[index] = {
      area,
      population: chosenYear[index].population + population,
    };

    return { [year]: [...chosenYear] };
  }, {});

export const mapUsse = (response) => {
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

export const mapUnemploymentFigures = (response) => {
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

export const mapMedianIncomes = (response) => {
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

export const mapGovernmentAssistance = (response) => {
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

export const mapPropertyOwnershipRate = (response) =>
  response.data.reduce((agg, response) => {
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

export const mapMovingData = (response) =>
  response.data.reduce((agg, { key, values }) => {
    const [area, _, movingDirection, year] = key;
    const value = parseInt(values[0]);

    const movingOut = movingDirection.includes("Utflyttning") ? value : 0;
    const movingIn = movingDirection.includes("Inflyttning") ? value : 0;

    const chosenYear = agg[year];

    const data = { area, movingPattern: { movingIn, movingOut } };

    if (!chosenYear) return { [year]: [data] };

    const index = chosenYear.findIndex((_) => _.area === area);

    if (index === -1) {
      return { [year]: [...chosenYear, data] };
    }

    chosenYear[index] = {
      area,
      movingPattern: {
        movingIn: chosenYear[index].movingPattern.movingIn + movingIn,
        movingOut: chosenYear[index].movingPattern.movingOut + movingOut,
      },
    };

    return { [year]: [...chosenYear] };
  }, {});
