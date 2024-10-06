import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DatasetState {
  checkedItems: string[];
}

const initialState: DatasetState = {
  checkedItems: [],
};

const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setCheckedItems(state, action: PayloadAction<string[]>) {
      state.checkedItems = action.payload;
    },
    toggleCheckedItem(
      state,
      action: PayloadAction<{ item: string; clear?: boolean }>
    ) {
      const { item, clear } = action.payload;

      if (clear) {
        state.checkedItems = [item];
      } else {
        if (state.checkedItems.includes(item)) {
          state.checkedItems = state.checkedItems.filter((i) => i !== item);
        } else {
          state.checkedItems.push(item);
        }
      }

      console.log(state.checkedItems);
    },
    clearCheckedItems(state) {
      state.checkedItems = [];
    },
  },
});

export const { setCheckedItems, toggleCheckedItem, clearCheckedItems } =
  datasetSlice.actions;
export default datasetSlice.reducer;
