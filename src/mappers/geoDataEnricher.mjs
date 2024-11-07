export const addToGeoData = (indexData, geoData) => {
  const features = geoData.features.map((feat) => {
    const { index, name, match } = getMatch(indexData, feat);
    return {
      ...feat,
      properties: {
        Color: match.color,
        Index: index,
        Name: name,
        Status: match.status,
        Sorting: match.sorting,
      },
    };
  });

  return { ...geoData, features };
};

export const addGbDataToGeoData = (indexData, geoData) => {
  const features = geoData.features.map((feat, i) => {
    const { index, name, match } = getMatch(indexData, feat);

    const {
      value,
      classification: { status, color, sorting },
    } = index;
    return {
      ...feat,
      properties: {
        Color: color,
        Index: value,
        Name: name,
        Status: status,
        Sorting: sorting,
      },
    };
  });

  return { ...geoData, features };
};

const getMatch = (indexData, feature) => {
  const match = indexData.find((primaryArea) => {
    const areaCode = primaryArea.area.split(" ")[0];

    return areaCode === feature.properties["PrimaryAreaCode"];
  });

  const index = match.index;

  const name = match.area.split(" ").splice(1, 2).toString().replace(",", " ");

  return { index, name, match };
};
