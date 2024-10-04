import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";
import { mockPerson } from "./info";
import { TLocation } from "@/types";

// Types
type FavoriteLocationsInfo = {
  place: string;
  latlng: TLocation;
  dataset: string;
  addedDate: string;
};

type Activity = {
  name: string;
  avatarUrl: string | StaticImageData;
  action: string;
  date: string;
  time: string;
};

type CompensationInfo = {
  amount: number;
  frequency: string;
  effectiveDate: string;
};

interface Person {
  id: string;
  name: string;
  avatarUrl: string | StaticImageData;
  phone: string;
  email: string;
  address: {
    street: string;
    cityState: string;
    postcode: string;
  };
  details: { label: string; field: string }[];
  locationHistory: FavoriteLocationsInfo[];
  activities: Activity[];
  compensationHistory: CompensationInfo[];
}

const initialPerson: Person = mockPerson;

const personSlice = createSlice({
  name: "person",
  initialState: initialPerson,
  reducers: {
    setEditablePerson: (state, action: PayloadAction<Person>) => {
      return action.payload;
    },
    updatePersonField: (
      state,
      action: PayloadAction<{ field: keyof Person; value: any }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    addLocation: (state, action: PayloadAction<FavoriteLocationsInfo>) => {
      state.locationHistory.push(action.payload);
    },
    updateLocation: (state, action: PayloadAction<FavoriteLocationsInfo[]>) => {
      state.locationHistory = action.payload;
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      state.locationHistory = state.locationHistory.filter(
        (location) => location.place !== action.payload
      );
    },
    updateAddressField: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      state.address = {
        ...state.address,
        [action.payload.name]: action.payload.value,
      };
    },
    updateDetailField: (
      state: Person,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      const updatedDetails = state.details.map((detail) =>
        detail.label === action.payload.name
          ? { ...detail, field: action.payload.value }
          : detail
      );
      state.details = updatedDetails;
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
