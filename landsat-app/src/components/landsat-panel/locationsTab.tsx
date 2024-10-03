import React, { useState } from "react";
import styles from "./styles/tab.module.css";
import { ListGroup, ListGroupItem } from "flowbite-react";
import { NoContentSection } from "../no-content-section";
import { LsText } from "../LsText";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const LocationsPage: React.FC = () => {
  const mockLocations = ["New York, USA", "Paris, France", "Tokyo, Japan"];

  // State to hold favorite locations
  const [favoriteLocations, setFavoriteLocations] =
    useState<string[]>(mockLocations);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Function to add a location to favorites
  const addLocationToFavorites = () => {
    if (searchTerm && !favoriteLocations.includes(searchTerm)) {
      setFavoriteLocations([...favoriteLocations, searchTerm]);
      setSearchTerm(""); // Reset search bar after adding
    }
  };

  // Function to remove a location from favorites
  const removeLocationFromFavorites = (location: string) => {
    setFavoriteLocations(favoriteLocations.filter((item) => item !== location));
  };

  return (
    <div className={styles.pageContainer}>
      <LsText>Saved Locations</LsText>

      {/* Location Search Bar */}
      <div className={styles.searchBar}>
        {/* <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a place"
          className={styles.input}
        /> */}
        <button onClick={addLocationToFavorites} className={styles.addButton}>
          Add to Favorites
        </button>
      </div>
      {/* <Geocoder
          accessToken={MAPBOX_TOKEN}
          options={{
            language: "en",
            country: "US",
          }}
        /> */}

      {/* List of Favorite Locations */}
      <div className={styles.locationList}>
        <div className="flex justify-center">
          <ListGroup className="w-full bg-transparent">
            {favoriteLocations.length > 0 ? (
              favoriteLocations.map((location, index) => (
                <ListGroupItem>
                  <LsText>{location}</LsText>
                </ListGroupItem>
              ))
            ) : (
              <NoContentSection message="No favorite locations saved." />
            )}
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
