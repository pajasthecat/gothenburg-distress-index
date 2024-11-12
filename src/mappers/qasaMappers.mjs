export const mapWithPrimaryAreas = (medianRentByArea, areaMapping) =>
  Object.keys(medianRentByArea)
    .map((key) => {
      const medianRent = medianRentByArea[key];
      return areaMapping[key].map((area) => ({
        area,
        medianRent,
      }));
    })
    .flat();
