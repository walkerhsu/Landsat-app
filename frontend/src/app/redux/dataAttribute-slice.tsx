import { formatDate } from "@/lib/utils";
import { TLocation } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Timespan {
  startDate: string;
  endDate: string;
}

interface CloudCoverage {
  min: number;
  max: number;
}

interface DatasetState {
  locations: TLocation[]; // Array of location strings
  timespan: Timespan; // Timespan object
  cloudCoverage: CloudCoverage; // Number of cloud coverage
  // datasetName: string; // Name of the dataset
}


const initialState: DatasetState = {
  locations: [],
  timespan: {
    startDate: formatDate(new Date()), // default to today
    endDate: formatDate(new Date()), // default to today
  },
  cloudCoverage: {min: 0, max: 100},
};

const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setDatasetAttributeOfLocations(state, action: PayloadAction<TLocation>) {
      if (!state.locations.some((location) => location === action.payload)) {
        const updatedLocations = new Set([...state.locations, action.payload]);
        state.locations = Array.from(updatedLocations) as TLocation[];
      } else {
        state.locations = state.locations.filter(
          (location) => location !== action.payload
        );
      }
      console.log(state.locations);
    },
    setDatasetAttributeOfTimespan(state, action: PayloadAction<Timespan>) {
      state.timespan = action.payload;
    },
    setDatasetAttributeOfCloudCoverage(state, action: PayloadAction<CloudCoverage>){
      state.cloudCoverage = action.payload;
    },
    // setDatasetName(state, action: PayloadAction<string>) {
    //   state.datasetName = action.payload;
    // },
    resetAllDatasetAttribute(state) {
      state.locations = [];
      state.timespan = {
        startDate: formatDate(new Date()),
        endDate: formatDate(new Date()),
      };
      state.cloudCoverage = {min: 0, max: 100};
      // state.datasetName = "";
    },
  },
});

export const {
  setDatasetAttributeOfLocations,
  setDatasetAttributeOfTimespan,
  setDatasetAttributeOfCloudCoverage,
  // setDatasetName,
  resetAllDatasetAttribute,
} = datasetSlice.actions;

export default datasetSlice.reducer;
