export const mapWithPrimaryAreas = (queueTimeByArea, areaMapping) =>
  queueTimeByArea
    .map(({ name, data }) => {
      return areaMapping[name].map((area) => ({
        area,
        queueTime: data,
      }));
    })
    .flat();
