import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FetchStatus {
  isFetching: boolean;
}

const initialState: FetchStatus = {
  isFetching: false,
};

const fetchStatusSlice = createSlice({
  name: "fetchStatus",
  initialState,
  reducers: {
    setFetchStatus: (state, action: PayloadAction<FetchStatus>) => {
      state.isFetching = action.payload.isFetching;
    },
  },
});

export const { setFetchStatus } = fetchStatusSlice.actions;

export default fetchStatusSlice.reducer;
