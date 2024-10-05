import { configureStore } from "@reduxjs/toolkit";
import personReducer from "./person-slice";
import locationReducer from "./location-slice";
import dataAttributeReducer from "./dataAttribute-slice";
import checkedItemsReducer from "./checkedItems-slice";
import selectedDatasetReducer from "./selectedDataset-slice";

const store = configureStore({
  reducer: {
    person: personReducer,
    location: locationReducer,
    dataAttribute: dataAttributeReducer,
    checkedItems: checkedItemsReducer,
    selectedDataset: selectedDatasetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
