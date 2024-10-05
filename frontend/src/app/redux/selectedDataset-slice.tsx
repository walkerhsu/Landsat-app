import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeoJson {
  type: string;
  features: {
    type: string;
    properties: {
      name: string;
    };
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }[];
}

interface Location {
  place: string;
  geoJsons: GeoJson;
}

interface SelectedDatasetState {
  category: string;
  locations: Location[];
  source: string;
  time: string;
}

const initialState: SelectedDatasetState = {
  category: "",
  locations: [],
  source: "",
  time: "",
};

export const selectedDatasetSlice = createSlice({
  name: "selectedDataset",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
      console.log(state.locations);
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.locations = [action.payload];
    },
    setSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    setAllFields: (state, action: PayloadAction<SelectedDatasetState>) => {
      state.category = action.payload.category;
      state.locations = action.payload.locations;
      state.source = action.payload.source;
      state.time = action.payload.time;
    },
    resetDataset: (state) => {
      state.category = "";
      state.locations = [];
      state.source = "";
      state.time = "";
    },
  },
});

export const {
  setCategory,
  addLocation,
  setLocation,
  setSource,
  setTime,
  setAllFields,
  resetDataset,
} = selectedDatasetSlice.actions;

export default selectedDatasetSlice.reducer;
