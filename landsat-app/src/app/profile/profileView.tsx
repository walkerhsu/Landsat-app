import React from "react";
import styles from "../../styles/profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faMapMarkerAlt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { IProfile } from "@/types";

const ProfileView: React.FC<{ profile: IProfile }> = ({ profile }) => (
  <div className={styles.contentContainer}>
    <ProfileSection
      icon={faUser}
      title="Name"
      value={profile.name}
      subtitle="Your full name"
    />
    <ProfileSection
      icon={faEnvelope}
      title="Email"
      value={profile.email}
      subtitle="Your email address"
    />
    <ProfileSection
      icon={faLock}
      title="Password"
      value={profile.password ? "********" : "No password set"}
      subtitle="Your account password"
    />
    <ProfileSection
      icon={faMapMarkerAlt}
      title="Favorite Locations"
      value={profile.favoriteLocations
        .map((loc) => `(${loc.lng.toFixed(4)}, ${loc.lat.toFixed(4)})`)
        .join(", ")}
      subtitle="Your preferred geographical points"
    />
    <ProfileSection
      icon={faTags}
      title="Favorite Topics"
      value={profile.favoriteTopics.join(", ")}
      subtitle="Your areas of interest"
    />
  </div>
);

const ProfileSection: React.FC<{
  icon: any;
  title: string;
  value: string;
  subtitle: string;
}> = ({ icon, title, value, subtitle }) => (
  <div className={styles.profileSection}>
    <FontAwesomeIcon icon={icon} className={styles.icon} />
    <div className={styles.sectionContent}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <p className={styles.sectionValue}>{value}</p>
      <p className={styles.sectionSubtitle}>{subtitle}</p>
    </div>
  </div>
);

export default ProfileView;
