'use client';

import React, { useState } from "react";
import Image from 'next/image';
import styles from "../../styles/profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("********");
  const [editField, setEditField] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [tempName, setTempName] = useState("");
  const handleEdit = (field: string) => {
    setEditField(field);
    if (field === "email") setTempEmail(email);
    if (field === "password") setTempPassword("");
    if (field === "name") setTempName(name);
  };

  const handleSave = () => {
    if (editField === "email") setEmail(tempEmail);
    if (editField === "password") setPassword(tempPassword);
    if (editField === "name") setName(tempName);
    setEditField(null);
  };

  const handleCancel = () => {
    setEditField(null);
    setTempEmail("");
    setTempPassword("");
  };

  return (
    <div className={styles.bookContainer}>
      <div className={styles.book}>
        <div className={styles.pages}>
          <div className={`${styles.page} ${styles.leftPage}`}>
            <div className={styles.profileHeader}>
              <div className={styles.profileImageContainer}>
                <Image
                  src="/default_profile.jpg" // Replace with actual image path
                  alt="Profile"
                  width={80}
                  height={80}
                  className={styles.profileImage}
                />
              </div>
              <h2 className={styles.profileName}>{name}</h2>
              <FontAwesomeIcon 
                icon={faPencilAlt} 
                className={styles.editIcon} 
                onClick={() => handleEdit("name")}
              />
            </div>
            <div className={styles.profileInfo}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
              <span>{email}</span>
              <FontAwesomeIcon 
                icon={faPencilAlt} 
                className={styles.editIcon} 
                onClick={() => handleEdit("email")}
              />
            </div>
            <div className={styles.profileInfo}>
              <FontAwesomeIcon icon={faLock} className={styles.icon} />
              <span>{password}</span>
              <FontAwesomeIcon 
                icon={faPencilAlt} 
                className={styles.editIcon} 
                onClick={() => handleEdit("password")}
              />
            </div>
          </div>
          <div className={`${styles.page} ${styles.rightPage}`}>
            {editField && (
              <div className={styles.editField}>
                <h3>Edit {editField}</h3>
                <input
                  className={styles.input}
                  type={editField === "password" ? "password" : "text"}
                  value={editField === "email" ? tempEmail : editField === "name" ? tempName : tempPassword}
                  onChange={(e) => {
                    if (editField === "email") setTempEmail(e.target.value);
                    else if (editField === "name") setTempName(e.target.value);
                    else setTempPassword(e.target.value);
                  }}
                />
                <div className={styles.buttonGroup}>
                  <button className={styles.button} onClick={handleSave}>
                    Save
                  </button>
                  <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;