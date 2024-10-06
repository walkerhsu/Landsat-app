import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TutorialState {
    showTutorial: boolean;
}

const initialState: TutorialState = {
    showTutorial: false,
};

const TutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    setShowTutorial: (state, action: PayloadAction<boolean>) => {
      state.showTutorial = action.payload;
    },
  },
});

export const { setShowTutorial } = TutorialSlice.actions;
export default TutorialSlice.reducer;
