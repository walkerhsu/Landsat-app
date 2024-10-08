"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Suspense, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import FooterPanel from "@/components/footer-panel/footerPanel";
import ExpandableButton from "@/containers/expandable-fab";
import Panel from "@/containers/landsat-panel/panel";
import { useUser } from "@clerk/nextjs";
import { ProfileApi } from "@/apis/profile-api";
import Mapbox from "@/containers/mapbox/mapbox";
import CountdownTimer  from "@/containers/notification_panel";
import Graph from "@/components/footer-panel/graph";

const MainContent = () => {
  const profileApi = useMemo(() => ProfileApi.create(), []);
  const latlng = useSelector((state: RootState) => state.location);

  const { isSignedIn, user } = useUser();

  // const handleSaveProfile = async (initUserData: PersonModel) => {
  //   const [error, status] = await profileApi.saveProfile(initUserData);
  //   console.log("Profile saved");
  // };

  // useEffect(() => {
  //   if (isSignedIn && user) {
  //     console.log("User is signed in");
  //     const initUser: PersonModel = PersonModel.create(
  //       user.id,
  //       user.username || "anonymous",
  //       user.imageUrl,
  //       user.phoneNumbers[0]?.phoneNumber || "",
  //       user.emailAddresses[0].emailAddress,
  //       {
  //         street: "",
  //         cityState: "",
  //         postcode: "",
  //       },
  //       [
  //         { label: "Date of birth", field: "" },
  //         { label: "National ID", field: user.id },
  //         { label: "Profession", field: "" },
  //         {
  //           label: "Join Date",
  //           field: formatDate(user.createdAt || new Date()),
  //         },
  //       ],
  //       []
  //     );
  //     handleSaveProfile(initUser);
  //   }
  // }, [isSignedIn, user]);

  return (
    <div className={styles.mainPage}>
      {/* <Drawer isOpen={isDrawerOpen} onToggle={toggleDrawer} /> */}
      {/* <h1>Welcome to Landsat Explorer</h1> */}
      <div className={styles.panelContainer}>
        <Panel />
      </div>
      <div className={styles.mapContainer}>
        <Mapbox
          location={latlng}
          onLocationSelect={(location) => console.log(location)}
        />
      </div>

      <div style={
        {borderColor:"#FFFFFF", width:"275px",  
          backgroundColor: "rgba(40, 40, 40, 0.85)", 
          borderRadius: "10px", position: "absolute", 
          left: "10px", bottom: "50px", zIndex: "10", padding: "10px" ,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}
      }>
        <CountdownTimer />
      </div>

      <div
        style={{ position: "fixed", right: "1vw", top: "1vh", zIndex: "10" }}
      >
        <ExpandableButton />
      </div>
      <FooterPanel />
    </div>
  );
};

export default function MainPage() {
  return (
    // <Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
    // </Provider>
  );
}
