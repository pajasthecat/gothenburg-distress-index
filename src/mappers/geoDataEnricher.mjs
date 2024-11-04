export const addToGeoData = (indexData, geoData) => {
  const features = geoData.features.map((feat) => {
    const { index, name, match } = getMatch(indexData, feat);
    return {
      ...feat,
      properties: {
        Color: match.index_classification.color,
        Index: index,
        Name: name,
        Status: match.index_classification.status,
        Sorting: match.index_classification.sorting,
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
      classification: { status, color },
    } = index;
    return {
      ...feat,
      properties: {
        Color: color,
        Index: value,
        Name: name,
        Status: status,
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
