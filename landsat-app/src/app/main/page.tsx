"use client";

import { Suspense, useState } from "react";
// import { useSearchParams } from 'next/navigation';
import styles from "./main.module.css";
import Mapbox from "@/components/mapbox";
import Drawer from "@/components/drawer";
import Panel from "@/components/landsat-panel/panel";
import FooterPanel from "@/components/footer-panel/footerPanel";
import { SidebarComponent } from "@/components/side-bar";
import ExpandableButton from "@/components/expandable-fab";

const MainContent = () => {
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
          location={{ lat: 25.13680057687235, lng: 121.50427011487547 }}
          onLocationSelect={(location) => console.log(location)}
        />
      </div>
      <div style={{ position: 'fixed', right: '1vw', top: '1vh', zIndex: '10' }}>
        {/* <SidebarComponent /> */}
        <ExpandableButton />
      </div>
      <FooterPanel />
    </div >
  );
};

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}
