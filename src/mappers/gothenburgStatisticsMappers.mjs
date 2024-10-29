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

  export const mapPopulation = (response) =>{
    return response.data.map((d) => mapResponse(d, "population")).reduce((accumulator, current) => {
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
  }


  export const mapUsse = (response) => {
    const data =  response.data
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
  }

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
  }

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
  }

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
  }