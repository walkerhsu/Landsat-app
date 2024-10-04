"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Suspense, useState } from "react";
import styles from "./page.module.css";
import Mapbox from "@/components/mapbox";
import FooterPanel from "@/components/footer-panel/footerPanel";
import ExpandableButton from "@/containers/expandable-fab";
import Panel from "@/containers/landsat-panel/panel";

const MainContent = () => {
  const latlng = useSelector((state: RootState) => state.location.latlng);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const searchParams = useSearchParams();
  // const username = searchParams?.get('username');
  // const lat = searchParams?.get('lat');
  // const lng = searchParams?.get('lng');

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

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
