import profileCat from '../../../public/profile_cat.jpeg';
import { StaticImageData } from 'next/image';

// Types
type FavoriteLocationsInfo = {
  department: string;
  division: string;
  manager: string;
  hireDate: string;
  location: string;
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

type Person = {
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
  details: {
    dateOfBirth: string;
    nationalId: string;
    title: string;
    hireDate: string;
  };
  locationHistory: FavoriteLocationsInfo[];
  activities: Activity[];
  compensationHistory: CompensationInfo[];
};

export const Person: Person = {
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
  details: {
    dateOfBirth: "Sep 26, 1988",
    nationalId: "GER10654",
    title: "Project Manager",
    hireDate: "Jan 05, 2023",
  },
  locationHistory: [
    {
      department: "Creative Associate",
      division: "Project Management",
      manager: "Alex Foster",
      hireDate: "May 13, 2024",
      location: "Metro DC",
    },
    // Add more job history items as needed
  ],
  activities: [
    {
      name: "John Miller",
      avatarUrl: profileCat,
      action: "last login on",
      date: "Jul 13, 2024",
      time: "05:36 PM",
    },
    // Add more activities as needed
  ],
  compensationHistory: [
    {
      amount: 862.0,
      frequency: "month",
      effectiveDate: "May 10, 2015",
    },
    // Add more compensation history items as needed
  ],
};
