import { TLocation } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SR_data } from "./srData-slice";

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
