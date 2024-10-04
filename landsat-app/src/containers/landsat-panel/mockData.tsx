export const TaipeiGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Taipei Polygon",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [121.5, 25.1],
            [121.4, 25.0],
            [121.5, 24.9],
            [121.6, 25.0],
            [121.5, 25.1],
          ],
        ],
      },
    },
  ],
};

export const GeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Taipei Polygon",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [121.5, 25.1],
            [121.6, 25.1],
            [121.6, 25.2],
            [121.5, 25.2],
            [121.5, 25.1],
          ],
        ],
      },
    },
  ],
};

export const ITEMS = [
  {
    category: "Landsat 8-9 OLI/TIRS C2 L1",
    location: "San Francisco",
    geoJson: TaipeiGeoJson,
    source: "NOAA-20 / VIIRS",
    options: ["2024-09-01", "2024-09-05", "2024-09-10"],
  },
  {
    category: "Landsat 8-9 OLI/TIRS C2 L2",
    location: "New York",
    geoJson: GeoJson,
    source: "IMERG",
    options: ["2024-09-01", "2024-09-05", "2024-09-10"],
  },
];
