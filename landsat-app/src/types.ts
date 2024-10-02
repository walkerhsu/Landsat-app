export type TLocation = { lat: number; lng: number };

export interface IProfile {
  name: string;
  email: string;
  password: string;
  favoriteLocations: TLocation[];
  favoriteTopics: string[];
}
