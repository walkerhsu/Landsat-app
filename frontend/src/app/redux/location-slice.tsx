import { TLocation } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  latlng: TLocation;
}

const initialState: LocationState = {
  latlng: { lat: 25.13680057687235, lng: 121.50427011487547 },
};

// Get the current viewport on the map
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLatLng: (state, action: PayloadAction<TLocation>) => {
      console.log(action.payload);
      state.latlng = action.payload;
    },
  },
});

export const { setLatLng } = locationSlice.actions;
export default locationSlice.reducer;
