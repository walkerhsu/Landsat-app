import React, { useState } from "react";
import styles from "./profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { AddTopicSelect } from "../../components/topic_selector";
import { IProfile, TLocation } from "@/types";

interface ProfileEditFormProps {
  editedProfile: IProfile;
  onSave: (profile: IProfile) => void;
  onCancel: () => void;
  onShowMap: () => void;
  setEditedProfile: React.Dispatch<React.SetStateAction<IProfile>>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  editedProfile,
  onSave,
  onCancel,
  onShowMap,
  setEditedProfile,
}) => {
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  const handleChange = (field: keyof IProfile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const handleRemoveLocation = (locationToRemove: TLocation) => {
    setEditedProfile((prev: IProfile) => ({
      ...prev,
      favoriteLocations: prev.favoriteLocations.filter(
        (loc) => loc !== locationToRemove
      ),
    }));
  };

  const handleAddTopic = (topic: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      favoriteTopics: [topic, ...prev.favoriteTopics],
    }));
    setIsAddingTopic(false);
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      favoriteTopics: prev.favoriteTopics.filter(
        (topic) => topic !== topicToRemove
      ),
    }));
  };

  return (
    <div className={styles.editModal}>
      <InputField
        label="Name"
        value={editedProfile.name}
        onChange={(value) => handleChange("name", value)}
      />
      <InputField
        label="Email"
        value={editedProfile.email}
        onChange={(value) => handleChange("email", value)}
      />
      <InputField
        label="Password"
        value={editedProfile.password}
        onChange={(value) => handleChange("password", value)}
        type="password"
      />

      <FavoriteLocations
        locations={editedProfile.favoriteLocations}
        onRemove={handleRemoveLocation}
        onAdd={onShowMap}
      />

      <FavoriteTopics
        topics={editedProfile.favoriteTopics}
        onRemove={handleRemoveTopic}
        onAdd={() => setIsAddingTopic(true)}
        isAdding={isAddingTopic}
        onAddComplete={handleAddTopic}
      />

      <div className={styles.buttonGroup}>
        <button
          className={styles.saveButton}
          onClick={() => onSave(editedProfile)}
        >
          Save
        </button>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}> = ({ label, value, onChange, type = "text" }) => (
  <div className={styles.inputGroup}>
    <label className={styles.inputLabel}>{label}</label>
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FavoriteLocations: React.FC<{
  locations: TLocation[];
  onRemove: (loc: TLocation) => void;
  onAdd: () => void;
}> = ({ locations, onRemove, onAdd }) => (
  <div className={styles.topicContainer}>
    <div className={styles.topicHeader}>
      Favorite Locations
      <span className={styles.addIcon} onClick={onAdd}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </span>
    </div>
    <ul className={styles.itemsList}>
      {locations.map((loc, index) => (
        <li key={index} className={styles.listItem}>
          <span className={styles.removeIcon} onClick={() => onRemove(loc)}>
            <FontAwesomeIcon icon={faCircleMinus} />
          </span>
          <span>
            ({loc.lng.toFixed(4)}, {loc.lat.toFixed(4)})
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const FavoriteTopics: React.FC<{
  topics: string[];
  onRemove: (topic: string) => void;
  onAdd: () => void;
  isAdding: boolean;
  onAddComplete: (topic: string) => void;
}> = ({ topics, onRemove, onAdd, isAdding, onAddComplete }) => (
  <div className={styles.topicContainer}>
    <div className={styles.topicHeader}>
      Favorite Topics
      <span className={styles.addIcon} onClick={onAdd}>
        <FontAwesomeIcon icon={faCirclePlus} />
      </span>
    </div>
    {isAdding && (
      <AddTopicSelect onSelect={onAddComplete} excludeTopics={topics} />
    )}
    <ul className={styles.itemsList}>
      {topics.map((topic) => (
        <li key={topic} className={styles.listItem}>
          <span className={styles.removeIcon} onClick={() => onRemove(topic)}>
            <FontAwesomeIcon icon={faCircleMinus} />
          </span>
          <span>{topic}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ProfileEditForm;
