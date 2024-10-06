import { TLocation } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
<<<<<<< Updated upstream

export interface SR_data {
  color: string; // Hex color code as a string
  ndvi: number; // Normalized Difference Vegetation Index
  ndwi: number; // Normalized Difference Water Index
  evi: number; // Enhanced Vegetation Index
  savi: number; // Soil Adjusted Vegetation Index
  ndmi: number; // Normalized Difference Moisture Index
  nbr: number; // Normalized Burn Ratio
  nbr2: number; // Second Normalized Burn Ratio
  ndsi: number; // Normalized Difference Snow Index
  temperature: number; // Temperature in Kelvin
  b1: number; // Band 1
  b2: number; // Band 2
  b3: number; // Band 3
  b4: number; // Band 4
  b5: number; // Band 5
  b6: number; // Band 6
  b7: number; // Band 7
  b10: number; // Band 10
}
=======
import { SR_data } from "./srData-slice";
>>>>>>> Stashed changes

export interface GeoJson {
  type: string;
  features: {
    type: string;
    properties: {
      SR_data: SR_data;
    };
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }[];
}

export interface SelectedDatasetState {
  datasetID: string;
  location: TLocation;
  source: string;
  time: string;
}

const initialState: SelectedDatasetState = {
  datasetID: "",
  location: { lat: 25.123456, lng: 121.654321 },
  source: "",
  time: "",
};

export const selectedDatasetSlice = createSlice({
  name: "selectedDataset",
  initialState,
  reducers: {
    setDatasetID: (state, action: PayloadAction<string>) => {
      state.datasetID = action.payload;
    },
    setLocation: (state, action: PayloadAction<TLocation>) => {
      state.location = action.payload;
    },
    resetDataset: (state) => {
      state.datasetID = "";
      state.location = { lat: 25.123456, lng: 121.654321 };
    },
  },
});

export const {
  setDatasetID,
  setLocation,
  resetDataset,
} = selectedDatasetSlice.actions;

export default selectedDatasetSlice.reducer;
