export const mockGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        SR_data: {"Taipei Polygon": 0.234},
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [121.5, 25.1],
            [121.6, 25.0],
            [121.5, 24.9],
            [121.4, 25.0],
            [121.5, 25.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "asdfadsf Polygon",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [121.51, 25.1],
            [121.41, 25.1],
            [121.53, 24.5],
            [121.66, 25.4],
            [121.51, 25.1],
          ],
        ],
      },
    },
  ],
};
