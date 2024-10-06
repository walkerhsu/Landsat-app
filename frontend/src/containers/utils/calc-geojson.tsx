import { GeoJson } from "@/app/redux/selectedDataset-slice";
import { TLocation } from "@/types";

export function calcGeoJson(currentLocation: TLocation, geoJson: GeoJson) {
  let all_coordinates: number[][][] = [];
  if (!geoJson) return;
  for (let i = 0; i < geoJson.features.length; i++) {
    all_coordinates.push(geoJson.features[i].geometry.coordinates[0]);
  }

  for (let i = 0; i < all_coordinates.length; i++) {
    const corners1 = all_coordinates[i][0];
    const corners2 = all_coordinates[i][1];
    const corners3 = all_coordinates[i][2];
    // console.log(corners1, corners2, corners3);
    if (
      currentLocation.lat >= corners2[1] &&
      currentLocation.lat <= corners3[1] &&
      currentLocation.lng >= corners1[0] &&
      currentLocation.lng <= corners2[0]
    ) {
      const SR_data = geoJson.features[i].properties.SR_data;
      console.log(SR_data);
      return SR_data;
    }
  }
  return null;
}
