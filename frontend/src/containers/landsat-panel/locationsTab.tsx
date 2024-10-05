import React, { useState } from "react";
import styles from "./styles/tab.module.css";
import { ListGroup, ListGroupItem } from "flowbite-react";
import { LsText } from "@/components/LsText";
import { NoContentSection } from "@/components/no-content-section";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import {
  addLocation,
  removeLocation,
  updateLocation,
} from "@/app/redux/person-slice";
import { LsColor } from "@/constants/ls-color";
import { setLatLng } from "@/app/redux/location-slice";
import { setDatasetLocations } from "@/app/redux/dataAttribute-slice";
import { LsCheckbox } from "@/components/LsCheckbox";
import { toggleCheckedItem } from "@/app/redux/checkedItems-slice";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const LocationsPage: React.FC = () => {
  const locationHistory = useSelector(
    (state: RootState) => state.person.locationHistory
  );
  const checkedItems = useSelector((state: RootState) => state.checkedItems);
  const dispatch = useDispatch();
  const favoriteLocations = locationHistory.map((location) => location.place);
  const mockLocations = ["New York, USA", "Paris, France", "Tokyo, Japan"];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredItem, setHoveredItem] = useState<string>("");
  // const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const addLocationToFavorites = () => {
    if (searchTerm && !favoriteLocations.includes(searchTerm)) {
      // dispatch(addLocation({place: searchTerm}));
      setSearchTerm(""); // Reset search bar after adding
    }
  };

  const removeLocationFromFavorites = (location: string) => {
    dispatch(removeLocation(location));
  };

  const handleViewportChange = (location) => {
    const latlng = location.latlng; // Assuming location object has a latlng property
    dispatch(setLatLng(latlng)); // Dispatch the action to store latlng
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
            {locationHistory.length > 0 ? (
              locationHistory.map((location, index) => (
                <ListGroupItem
                  key={index}
                  style={{ display: "flex", justifyContent: "space-between" }}
                  onClick={() => handleViewportChange(location)}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredItem(location.place);
                  }}
                  onMouseOut={(e) => {
                    e.stopPropagation();
                    setHoveredItem("");
                  }}
                >
                  <LsText
                    color={
                      hoveredItem === location.place
                        ? LsColor.DarkBlue
                        : LsColor.White
                    }
                  >
                    {location.place}
                  </LsText>
                  <LsCheckbox
                    checked={checkedItems.checkedItems.includes(location.place)}
                    onChange={() => {
                      dispatch(toggleCheckedItem(location.place));
                      dispatch(setDatasetLocations(location.place));
                    }}
                  />
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
