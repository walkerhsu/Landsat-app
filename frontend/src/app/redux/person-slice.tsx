import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StaticImageData } from "next/image";
// import { mockPerson } from "./info";
import { TLocation } from "@/types";
import { PersonModel } from "@/models/person-model";
// import { LocationModel } from "@/models/location-model";

type Address = {
  street: string;
  cityState: string;
  postcode: string;
};

type Detail = {
  label: string;
  field: string;
};

interface Person {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  email: string;
  address: Address;
  details: Detail[];
  locationHistory: LocationModel[];
};

type LocationModel = {
  id: string;
  place: string;
  latlng: TLocation;
  dataset: string;
  addedDate: string;
};

const initialPerson: Person = {
  id: "#MOCK12345",
  name: "John Doe",
  avatarUrl: "/_next/static/media/profile_mock.jpeg",
  phone: "(123) 456-7890",
  email: "johndoe@example.com",
  address: {
    street: "123 Main St",
    cityState: "Springfield, IL",
    postcode: "62701",
  },
  details: [
    { label: "Occupation", field: "Software Engineer" },
    { label: "Hobbies", field: "Reading, Hiking" },
  ],
  locationHistory: [
    {
      id: "1",
      place: "Taipei",
      latlng: { lat: 25.123456, lng: 121.654321 },
      dataset: "LANDSAT/LC08/C02/T1_TOA",
      addedDate: "2024-09-01",
    },
    {
      id: "2",
      place: "New York",
      latlng: { lat: 40.7128, lng: -74.006 },
      dataset: "LANDSAT/LC08/C02/T1_TOA",
      addedDate: "2024-09-01",
    },
  ],
  // activities: [
  //   { /* ActivityModel structure */ },
  // ],
  // compensationHistory: [
  //   { /* CompensationModel structure */ },
  // ],
};

export const parsePersonModel = (model: PersonModel): Person => {
  return {
    id: model.getId(),
    name: model.getName(),
    avatarUrl: model.getAvatarUrl(),
    phone: model.getPhone(),
    email: model.getEmail(),
    address: {
      street: model.getAddress().street,
      cityState: model.getAddress().cityState,
      postcode: model.getAddress().postcode,
    },
    details: model.getDetails().map(detail => ({
      label: detail.label,
      field: detail.field,
    })),
    locationHistory: model.getLocationHistory().map(location => ({
      id: location.getId(),
      place: location.getPlace(),
      latlng: location.getLatlng(),
      dataset: location.getDataset(),
      addedDate: location.getAddedDate(),
    })),
    // Uncomment if needed for activities or compensation history
    // activities: model.getActivities(),
    // compensationHistory: model.getCompensationHistory(),
  };
};

// const initialPerson: Person = PersonModel.createMockPerson();

// console.log(initialPerson);

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
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    },
    addLocation: (state, action: PayloadAction<LocationModel>) => {
      state.locationHistory.push(action.payload);
    },
    updateLocation: (state, action: PayloadAction<LocationModel>) => {
      // state.locationHistory = action.payload;
      // state.updateLocationHistory(action.payload);
      state.locationHistory = state.locationHistory.map((loc) =>
        loc.id === action.payload.id ? action.payload : loc
      );
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      // state.setLocationHistory(
      //   state
      //     .getLocationHistory()
      //     .filter((location) => location.getId() !== action.payload)
      // );
      state.locationHistory = state.locationHistory.filter(
        (location) => location.id !== action.payload
      );
    },
    updateAddressField: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      // state.updateAddress({
      //   ...state.getAddress(),
      //   [action.payload.name]: action.payload.value,
      // });
      state.address = {
        ...state.address,
        [action.payload.name]: action.payload.value,
      };
    },
    updateDetailField: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      // state.updateDetails({
      //   label: action.payload.name,
      //   field: action.payload.value,
      // });
      state.details.map((detail) =>
        detail.label === action.payload.name
          ? { ...detail, field: action.payload.value }
          : detail
      );
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
