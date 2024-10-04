import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Timespan {
  startDate: string; // start date
  endDate: string; // end date
}

interface DatasetState {
  locations: string[]; // Array of location strings
  timespan: Timespan; // Timespan object
  datasetName: string; // Name of the dataset
}

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const initialState: DatasetState = {
  locations: [],
  timespan: {
    startDate: formatDate(new Date()), // default to today
    endDate: formatDate(new Date()), // default to today
  },
  datasetName: "",
};

const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setDatasetLocations(state, action: PayloadAction<string>) {
      if (!state.locations.some((location) => location === action.payload)) {
        const updatedLocations = new Set([...state.locations, action.payload]);
        state.locations = Array.from(updatedLocations) as string[];
      } else {
        state.locations = state.locations.filter(
          (location) => location !== action.payload
        );
      }
      //   state.locations = action.payload;
      console.log(state.locations);
    },
    setDatasetTimespan(state, action: PayloadAction<Timespan>) {
      state.timespan = action.payload;
    },
    setDatasetName(state, action: PayloadAction<string>) {
      state.datasetName = action.payload;
    },
    resetDataset(state) {
      state.locations = [];
      state.timespan = {
        startDate: formatDate(new Date()),
        endDate: formatDate(new Date()),
      };
      state.datasetName = "";
    },
  },
});

export const {
  setDatasetLocations,
  setDatasetTimespan,
  setDatasetName,
  resetDataset,
} = datasetSlice.actions;

export default datasetSlice.reducer;
