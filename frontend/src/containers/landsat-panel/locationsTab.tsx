import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles/tab.module.css";
import { ListGroup, ListGroupItem } from "flowbite-react";
import { LsText } from "@/components/LsText";
import { NoContentSection } from "@/components/no-content-section";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { addLocation, removeLocation, setEditablePerson } from "@/app/redux/person-slice";
import { LsColor } from "@/constants/ls-color";
import { setLatLng } from "@/app/redux/location-slice";
import { setDatasetLocations } from "@/app/redux/dataAttribute-slice";
import { LsCheckbox } from "@/components/LsCheckbox";
import { toggleCheckedItem } from "@/app/redux/checkedItems-slice";
import { LsIcon } from "@/components/LsIcon";
import { LsIconName } from "@/constants/ls-icon";
import { ProfileApi } from "@/apis/profile-api";
import { PersonModel } from "@/models/person-model";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSignIn } from "@clerk/clerk-react";
import { LocationModel } from "@/models/location-model";

const LocationsPage: React.FC = () => {
  const profileApi = useMemo(() => ProfileApi.create(), []);
  const { isLoaded, signIn } = useSignIn();
  const { user } = useUser();
  const locationHistory = useSelector((state: RootState) =>
    state.person.getLocationHistory()
  );
  const checkedItems = useSelector((state: RootState) => state.checkedItems);
  const dispatch = useDispatch();
  const mockLocations = ["New York, USA", "Paris, France", "Tokyo, Japan"];

  const [addHovered, setAddHovered] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredItem, setHoveredItem] = useState<string>("");
  // const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const [userProfile, setUserProfile] = useState<PersonModel | null>(null);
  const [userLocation, setUserLocation] = useState<LocationModel[] | null>(
    null
  );

  const handlefetchUserProfile = useCallback(
    async (userId: string) => {
      const [error, returnedUserProfile] = await profileApi.fetchUserProfile(
        userId
      );
      console.log(error, returnedUserProfile);
      if (error) {
        // notify users
        return error;
      }
      if (!returnedUserProfile) {
        console.log("User profile not found");
        return null;
      }
      setUserProfile(returnedUserProfile);
      setUserLocation(returnedUserProfile.getLocationHistory());
      return null;
    },
    [profileApi, setUserLocation]
  );

  useEffect(() => {
    console.log(signIn, user?.id);
    if (isLoaded && signIn && user?.id) {
      console.log(user?.id);
      handlefetchUserProfile(user.id);
    }
  }, [handlefetchUserProfile, signIn, user]);

  const handleUpdateLocations = useCallback(async () => {
    if (!userLocation) {
      return;
    }
    setUserProfile((user) => {
      if (!user) {
        return null;
      }
      user.setLocationHistory(userLocation);
      return user;
    });

    console.log(userProfile);

    if (userProfile) {
      let [error, status] = await profileApi.updateProfile(userProfile);
      if (error) {
        console.error("Failed to update profile");
        return;
      }
    }
    // error = await handlefetchUserProfile(draftUserProfile.getId());
    // if (error) {
    //   console.error("Failed to save profile");
    //   return;
    // }

    if (userProfile) {
      dispatch(setEditablePerson(userProfile));
    }
    console.log("Profile successfully updated");
  }, [userProfile, profileApi, handlefetchUserProfile]);

  const addLocationToFavorites = () => {
    // if (searchTerm && !favoriteLocations.includes(searchTerm)) {
    //   // dispatch(addLocation({place: searchTerm}));
    //   setSearchTerm(""); // Reset search bar after adding
    // }
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
      <div
        style={{
          display: "flex",
          width: "90%",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <LsText>Saved Locations</LsText>
        <button
          onClick={addLocationToFavorites}
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: addHovered ? LsColor.Grey600 : "transparent",
            borderRadius: "50%",
          }}
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
        >
          <LsIcon name={LsIconName.Plus} />
        </button>
      </div>

      {/* Location Search Bar */}
      {/* <div className={styles.searchBar}>
        
      </div> */}
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
                    setHoveredItem(location.getPlace());
                  }}
                  onMouseOut={(e) => {
                    e.stopPropagation();
                    setHoveredItem("");
                  }}
                >
                  <LsText
                    color={
                      hoveredItem === location.getPlace()
                        ? LsColor.DarkBlue
                        : LsColor.White
                    }
                  >
                    {location.getPlace()}
                  </LsText>
                  <LsCheckbox
                    checked={checkedItems.checkedItems.includes(
                      location.getPlace()
                    )}
                    onChange={() => {
                      dispatch(toggleCheckedItem(location.getPlace()));
                      dispatch(setDatasetLocations(location.getPlace()));
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
