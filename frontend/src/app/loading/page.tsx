'use client'

import React, { useEffect, useMemo } from "react";
import styles from "./loading.module.css";
import { formatDate } from "@/lib/utils";
import { PersonModel } from "@/models/person-model";
import { useUser } from "@clerk/nextjs";
import { ProfileApi } from "@/apis/profile-api";
import { useDispatch } from "react-redux";
import { parsePersonModel, setEditablePerson } from "../redux/person-slice";

const LoadingPage = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const profileApi = useMemo(() => ProfileApi.create(), []);

  const handleSaveProfile = async (initUserData: PersonModel) => {
    const [error, status] = await profileApi.saveProfile(initUserData);
    console.log("Profile saved");
  };

  const redirectToMainPage = () => {
    window.location.href = "/";
  }

  useEffect(() => {
    if (user) {
      console.log("User is signed up");
      const initUser: PersonModel = PersonModel.create(
        user.id,
        user.username || "anonymous",
        user.imageUrl,
        user.phoneNumbers[0]?.phoneNumber || "",
        user.emailAddresses[0].emailAddress,
        {
          street: "",
          cityState: "",
          postcode: "",
        },
        [
          { label: "Date of birth", field: "" },
          { label: "National ID", field: user.id },
          { label: "Profession", field: "" },
          {
            label: "Join Date",
            field: formatDate(user.createdAt || new Date()),
          },
        ],
        []
      );
      handleSaveProfile(initUser);
      dispatch(setEditablePerson(parsePersonModel(initUser)));
      redirectToMainPage();
    }
  }, [user]);
  return (
    <div className={styles.loading_container}>
      <div className={styles.spinner}></div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default LoadingPage;
