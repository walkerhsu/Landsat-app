import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";
import { mockPerson } from "./info";
import { TLocation } from "@/types";
import { PersonModel } from "@/models/person-model";
import { LocationModel } from "@/models/location-model";

const initialPerson: PersonModel = mockPerson;

const personSlice = createSlice({
  name: "person",
  initialState: initialPerson,
  reducers: {
    setEditablePerson: (state, action: PayloadAction<PersonModel>) => {
      return action.payload;
    },
    updatePersonField: (
      state,
      action: PayloadAction<{ field: keyof PersonModel; value: any }>
    ) => {
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    },
    addLocation: (state, action: PayloadAction<LocationModel>) => {
      state.getLocationHistory().push(action.payload);
    },
    updateLocation: (state, action: PayloadAction<LocationModel>) => {
      state.updateLocationHistory(action.payload);
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      state.setLocationHistory(
        state
          .getLocationHistory()
          .filter((location) => location.getId() !== action.payload)
      );
    },
    updateAddressField: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      state.updateAddress({
        ...state.getAddress(),
        [action.payload.name]: action.payload.value,
      });
    },
    updateDetailField: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      state.updateDetails({
        label: action.payload.name,
        field: action.payload.value,
      });
    },
  },
});

export const {
  setEditablePerson,
  updatePersonField,
  addLocation,
  updateLocation,
  removeLocation,
  updateAddressField,
  updateDetailField,
} = personSlice.actions;
export default personSlice.reducer;
