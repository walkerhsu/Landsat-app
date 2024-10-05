import { TLocation } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentViewportState {
  center: TLocation;
  zoom: number;
}

const initialState: CurrentViewportState = {
  center: { lat: 25.13680057687235, lng: 121.50427011487547 },
  zoom: 10,
};

const viewportSlice = createSlice({
  name: "viewport",
  initialState,
  reducers: {
    setViewport: (state, action: PayloadAction<CurrentViewportState>) => {
      console.log(action.payload);
      state.center = action.payload.center;
      state.zoom = action.payload.zoom;
    },
  },
});

export const { setViewport } = viewportSlice.actions;
export default viewportSlice.reducer;
