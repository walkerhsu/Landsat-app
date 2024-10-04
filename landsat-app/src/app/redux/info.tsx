import { TLocation } from "@/types";
import profileCat from "../../../public/profile_cat.jpeg";
import { StaticImageData } from "next/image";

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

export type Person = {
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
};

export const mockPerson: Person = {
  id: "#ERD246534",
  name: "Nicholas Swatz",
  avatarUrl: profileCat,
  phone: "(629) 555-0123",
  email: "nicholasswatz@gmail.com",
  address: {
    street: "390 Market Street, Suite 200",
    cityState: "San Francisco CA",
    postcode: "94102",
  },
  details: [
    { label: "Date of birth", field: "Sep 26, 1988" },
    { label: "National ID", field: "GER10654" },
    { label: "Title", field: "Project Manager" },
    { label: "Join Date", field: "Jan 05, 2023" },
  ],
  locationHistory: [
    {
      place: "Metro DC",
      latlng: { lat: 38.9072, lng: -77.0369 },
      dataset: "Landsat",
      addedDate: "May 13, 2024",
    },
    {
      place: "San Francisco",
      latlng: { lat: 37.7749, lng: -122.4194 },
      dataset: "Landsat",
      addedDate: "May 13, 2024",
    },
    {
      place: "New York",
      latlng: { lat: 40.7128, lng: -74.006 },
      dataset: "Landsat",
      addedDate: "May 13, 2024",
    },
    {
      place: "Los Angeles",
      latlng: { lat: 34.0522, lng: -118.2437 },
      dataset: "Landsat",
      addedDate: "May 13, 2024",
    }
  ],
  activities: [
    {
      name: "John Miller",
      avatarUrl: profileCat,
      action: "last login on",
      date: "Jul 13, 2024",
      time: "05:36 PM",
    },
  ],
  compensationHistory: [
    {
      amount: 862.0,
      frequency: "month",
      effectiveDate: "May 10, 2015",
    },
  ],
};
