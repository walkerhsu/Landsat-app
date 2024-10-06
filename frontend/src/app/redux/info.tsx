import { TLocation } from "@/types";
import profileCat from "../../../public/profile_cat.jpeg";
import { StaticImageData } from "next/image";
import { PersonModel } from "@/models/person-model";
import { LocationModel } from "@/models/location-model";

// export const mockPerson: PersonModel = PersonModel.create(
//   "#ERD246534",
//   "Nicholas Swatz",
//   profileCat.src,
//   "(629) 555-0123",
//   "nicholasswatz@gmail.com",
//   {
//     street: "390 Market Street, Suite 200",
//     cityState: "San Francisco CA",
//     postcode: "94102",
//   },
//   [
//     { label: "Date of birth", field: "Sep 26, 1988" },
//     { label: "National ID", field: "GER10654" },
//     { label: "Title", field: "Project Manager" },
//     { label: "Join Date", field: "Jan 05, 2023" },
//   ],
//   [
//     LocationModel.create(
//       "38.9072",
//       "Metro DC",
//       { lat: 38.9072, lng: -77.0369 },
//       "Landsat",
//       "May 13, 2024"
//     ),
//     LocationModel.create(
//       "37.7749",
//       "San Francisco",
//       { lat: 37.7749, lng: -122.4194 },
//       "Landsat",
//       "May 13, 2024"
//     ),
//     LocationModel.create(
//       "34.0522",
//       "Los Angeles",
//       { lat: 34.0522, lng: -118.2437 },
//       "Landsat",
//       "May 13, 2024"
//     ),
//     LocationModel.create(
//       "40.7128",
//       "New York",
//       { lat: 40.7128, lng: -74.006 },
//       "Landsat",
//       "May 13, 2024"
//     ),
//   ]
// );
// activities: [
//   {
//     name: "John Miller",
//     avatarUrl: profileCat,
//     action: "last login on",
//     date: "Jul 13, 2024",
//     time: "05:36 PM",
//   },
// ],
// compensationHistory: [
//   {
//     amount: 862.0,
//     frequency: "month",
//     effectiveDate: "May 10, 2015",
//   },
// ],
// };
