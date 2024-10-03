"use client";

import React, { useState } from "react";
import styles from "./profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import ProfileView from "./profileView";
import ProfileEditForm from "./profileEditForm";
import MapModal from "./mapModal";
import { IProfile, TLocation } from "@/types";

const ProfilePage = () => {
  const [profile, setProfile] = useState<IProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "********",
    favoriteLocations: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 34.0522, lng: -118.2437 },
      { lat: 72.1724, lng: 37.3333 },
    ],
    favoriteTopics: ["water", "landscape"],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<TLocation | null>(
    null
  );
  const [editedProfile, setEditedProfile] = useState<IProfile>({ ...profile });

  const handleEdit = () => setIsEditing(true);
  const handleSave = (editedProfile: IProfile) => {
    setProfile(editedProfile);
    setIsEditing(false);
    setShowMap(false);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setShowMap(false);
  };
  const handleMapClose = () => {
    setSelectedLocation(null);
    setShowMap(false);
  };

  const handleMapConfirm = () => {
    if (selectedLocation) {
      console.log("selectedLocation", selectedLocation);
      setEditedProfile((prev) => ({
        ...prev,
        favoriteLocations: [selectedLocation, ...prev.favoriteLocations],
      }));
    }
    setShowMap(false);
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.fixedHeader}>
        <h1 className={styles.title}>
          {isEditing ? "Editing your profile" : "Your Profile"}
        </h1>
        {!isEditing && (
          <button className={styles.editButton} onClick={handleEdit}>
            <FontAwesomeIcon icon={faPencilAlt} /> Edit Profile
          </button>
        )}
      </div>

      <div
        className={`${styles.contentContainer} ${
          showMap ? styles.withMap : ""
        }`}
      >
        {!isEditing ? (
          <ProfileView profile={profile} />
        ) : (
          <>
            <ProfileEditForm
              editedProfile={editedProfile}
              setEditedProfile={setEditedProfile}
              onSave={handleSave}
              onCancel={handleCancel}
              onShowMap={() => setShowMap(true)}
            />
            <MapModal
              show={showMap}
              onClose={handleMapClose}
              onConfirm={handleMapConfirm}
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
