import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  b6: number;
  b7: number;
  b8: number;
}

interface SRDataState {
  data: SR_data | null;
}

const initialState: SRDataState = {
  data: null,
};

const srDataSlice = createSlice({
  name: 'srData',
  initialState,
  reducers: {
    setSRData(state, action: PayloadAction<SR_data>) {
      state.data = action.payload;
    },
    clearSRData(state) {
      state.data = null;
    },
  },
});

export const { setSRData, clearSRData } = srDataSlice.actions;

export default srDataSlice.reducer;
