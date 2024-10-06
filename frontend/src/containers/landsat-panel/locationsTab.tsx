import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles/tab.module.css";
import { ListGroup, ListGroupItem } from "flowbite-react";
import { LsText } from "@/components/LsText";
import { NoContentSection } from "@/components/no-content-section";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { LsColor } from "@/constants/ls-color";
import { setLatLng } from "@/app/redux/location-slice";
import { setDatasetAttributeOfLocations } from "@/app/redux/dataAttribute-slice";
import { LsCheckbox } from "@/components/LsCheckbox";
import { toggleCheckedItem } from "@/app/redux/checkedItems-slice";
import { LsIcon } from "@/components/LsIcon";
import { LsIconName } from "@/constants/ls-icon";
import { ProfileApi } from "@/apis/profile-api";
import { PersonModel } from "@/models/person-model";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSignIn } from "@clerk/clerk-react";
import { LocationModel } from "@/models/location-model";
import { TLocation } from "@/types";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/magicui/skeleton";
import { SkeletonDemo } from "../../components/skeleton-card";
import { MapApi } from "@/apis/map-api";
import { formatLocationId } from "../utils/format-locations";

const mockLocations = ["New York, USA", "Paris, France", "Tokyo, Japan"];
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type LocationProps = {
  isEditMode: boolean;
};

const LocationsPage: React.FC<LocationProps> = ({ isEditMode }) => {
  const profileApi = useMemo(() => ProfileApi.create(), []);
  const mapApi = useMemo(() => new MapApi(), []);
  const { isLoaded, signIn } = useSignIn();
  const { user } = useUser();
  const currentViewport = useSelector(
    (state: RootState) => state.currentViewport
  );

  const checkedItems = useSelector((state: RootState) => state.checkedItems);
  const dispatch = useDispatch();

  const [addHovered, setAddHovered] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredItem, setHoveredItem] = useState<string>("");

  const [userProfile, setUserProfile] = useState<PersonModel | null>(null);
  const [userLocation, setUserLocation] = useState<LocationModel[] | null>(
    null
  );

  const [isProcessingAddingLocation, setIsProcessingAddingLocation] =
    useState<boolean>(false);

  const [isloading, setIsLoading] = useState<boolean>(false);

  const handlefetchUserProfile = useCallback(
    async (userId: string) => {
      if (!userId) {
        return null;
      }
      setIsLoading(true);
      const [error, returnedUserProfile] = await profileApi.fetchUserProfile(
        userId
      );
      // console.log(error, returnedUserProfile);
      if (error) {
        // notify users
        return error;
      }
      if (!returnedUserProfile) {
        console.log("User profile not found");
        setIsLoading(false);
        return null;
      }
      setUserProfile(returnedUserProfile);
      setUserLocation(returnedUserProfile.getLocationHistory());
      setIsLoading(false);
      return null;
    },
    [profileApi, setUserLocation]
  );

  useEffect(() => {
    if (isLoaded && signIn && user?.id) {
      handlefetchUserProfile(user.id);
    }
  }, [handlefetchUserProfile, signIn, user]);

  const handleAddLocations = useCallback(async () => {
    if (!currentViewport) {
      return;
    }
    setIsProcessingAddingLocation(true);
    if (userProfile) {
      const newUserProfile: PersonModel = userProfile;
      const fullAddress = await mapApi.getReverseGeocode(
        currentViewport.center.lat,
        currentViewport.center.lng,
        MAPBOX_TOKEN
      );
      console.log(fullAddress);
      const address =
        fullAddress?.features?.[0]?.properties?.full_address ||
        "Address not found";
      newUserProfile.pushLocationHistory(
        LocationModel.create(
          `${currentViewport.center.lat}+${currentViewport.center.lng}`,
          address,
          {
            lat: currentViewport.center.lat,
            lng: currentViewport.center.lng,
          },
          "",
          formatDate(new Date())
        )
      );
      setUserProfile((user) => {
        if (!user) {
          return null;
        }
        return newUserProfile;
      });
    }

    if (userProfile) {
      let [error, status] = await profileApi.updateProfile(userProfile);
      console.log("Profile successfully updated");
      if (error) {
        console.error("Failed to update profile");
        setIsProcessingAddingLocation(false);
        return;
      }
      setIsProcessingAddingLocation(false);
      return;
    }
    console.log("failed to update profile");
    // error = await handlefetchUserProfile(draftUserProfile.getId());
    // if (error) {
    //   console.error("Failed to save profile");
    //   return;
    // }

    // if (userProfile) {
    //   dispatch(setEditablePerson(userProfile));
    // }
  }, [currentViewport, userProfile, profileApi]);

  const addLocationToFavoritesByLatLng = () => {
    // if (searchTerm && !favoriteLocations.includes(searchTerm)) {
    //   // dispatch(addLocation({place: searchTerm}));
    //   setSearchTerm(""); // Reset search bar after adding
    // }
  };

  const handleViewportChange = (location: TLocation) => {
    dispatch(setLatLng(location)); // Dispatch the action to store latlng
  };

  return (
    <div className={styles.pageContainer}>
      <div
        style={{
          display: "flex",
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          marginBottom: "1rem",
        }}
      >
        <LsText>Saved Locations</LsText>
        {isEditMode ? (
          <button
            onClick={handleAddLocations}
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: addHovered ? LsColor.Grey600 : "transparent",
              borderRadius: "50%",
            }}
            onMouseEnter={() => setAddHovered(true)}
            onMouseLeave={() => setAddHovered(false)}
          >
            {isProcessingAddingLocation ? (
              <LsIcon name={LsIconName.Processing}></LsIcon>
            ) : (
              <LsIcon name={LsIconName.Plus} />
            )}
          </button>
        ) : null}
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
      {/* {isloading && <SkeletonDemo />} */}
      {
        <div className={styles.locationList}>
          <div className="flex justify-center">
            <ListGroup className="w-full bg-transparent">
              {userLocation && userLocation.length > 0 ? (
                userLocation.map((location, index) => (
                  <ListGroupItem
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      transition: "transform 0.5s ease",
                      transform: "translateY(-5px)",
                    }}
                    onClick={() => handleViewportChange(location.getLatlng())}
                    onMouseEnter={(e) => {
                      // e.stopPropagation();
                      setHoveredItem(location.getPlace());
                    }}
                    onMouseOut={(e) => {
                      // e.stopPropagation();
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
                      checked={
                        isEditMode
                          ? checkedItems.checkedItems.includes(
                              formatLocationId(
                                location.getLatlng().lat,
                                location.getLatlng().lng
                              )
                            )
                          : checkedItems.checkedItems.length === 1 &&
                            checkedItems.checkedItems[0] ===
                              formatLocationId(
                                location.getLatlng().lat,
                                location.getLatlng().lng
                              )
                      }
                      onChange={() => {
                        if (!isEditMode) {
                          // Clear all selections and select the new one
                          dispatch(
                            toggleCheckedItem({
                              item: formatLocationId(
                                location.getLatlng().lat,
                                location.getLatlng().lng
                              ),
                              clear: true,
                            })
                          );
                        } else {
                          // Multi-select in edit mode
                          dispatch(
                            toggleCheckedItem({
                              item: formatLocationId(
                                location.getLatlng().lat,
                                location.getLatlng().lng
                              ),
                            })
                          );
                        }
                        if (isEditMode) {
                          dispatch(
                            setDatasetAttributeOfLocations(location.getLatlng())
                          );
                        }
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
      }
    </div>
  );
};

export default LocationsPage;
