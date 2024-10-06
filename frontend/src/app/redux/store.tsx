import { configureStore } from "@reduxjs/toolkit";
import personReducer from "./person-slice";
import locationReducer from "./location-slice";
import dataAttributeReducer from "./dataAttribute-slice";
import checkedItemsReducer from "./checkedItems-slice";
import selectedDatasetReducer from "./selectedDataset-slice";
import currentViewportReducer from "./current-viewport-slice";
import srDataReducer from "./srData-slice";
import tutorialReducer from "./tutorial-slice";
import fetchStatusReducer from "./fetchStatus-slice";

const store = configureStore({
  reducer: {
    person: personReducer,
    location: locationReducer,
    dataAttribute: dataAttributeReducer,
    checkedItems: checkedItemsReducer,
    selectedDataset: selectedDatasetReducer,
    currentViewport: currentViewportReducer,
    srData: srDataReducer,
    tutorial: tutorialReducer,
    fetchStatus: fetchStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
