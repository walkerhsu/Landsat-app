// import { LocationModel, TLocation } from "../models/location-model";
// import { parsePersonDto, serializePersonModel } from "../dtos/person-dto";

// export class MapApi {
//   static create() {
//     return new MapApi();
//   }

//   async fetchMapDatasets(
//     startDate: string,
//     endDate: string,
//     locations: TLocation[]
//   ): Promise<[error: Error | null, datasets: LocationModel | null]> {
//     try {
//       const response = await fetch(`/api/map/dataset?startDate=${startDate}&endDate=${endDate}&locations=${locations}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const { detail } = (await response.json()) as { detail: string };
//         return [new Error(detail), null];
//       } else {
//         const userProfileDto = await response.json();
//         return [null, parsePersonDto(userProfileDto)];
//       }
//     } catch (error: any) {
//       return [new Error(error.message), null];
//     }
//   }
//   async saveProfile(
//     userData: PersonModel
//   ): Promise<[error: Error | null, status: string | null]> {
//     try {
//       const response = await fetch("/api/profile/save", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         console.error("Failed to save profile");
//         const { detail } = (await response.json()) as { detail: string };
//         return [new Error(detail), null];
//       }

//       const { status, id } = (await response.json()) as {
//         status: string;
//         id: string;
//       };
//       console.log("in api", status, id);
//       return [null, status];
//     } catch (error: any) {
//       return [new Error(error.message), null];
//     }
//   }

//   async updateProfile(
//     userData: PersonModel
//   ): Promise<[error: Error | null, status: string | null]> {
//     try {
//       const response = await fetch("/api/profile/update", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(serializePersonModel(userData)),
//       });

//       if (!response.ok) {
//         const { detail } = (await response.json()) as { detail: string };
//         return [new Error(detail), null];
//       }

//       const { status, id } = (await response.json()) as {
//         status: string;
//         id: string;
//       };
//       return [null, status];
//     } catch (error: any) {
//       return [new Error(error.message), null];
//     }
//   }
// }
