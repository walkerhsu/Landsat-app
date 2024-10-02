"use client";

import { Suspense, useState } from "react";
// import { useSearchParams } from 'next/navigation';
import styles from "@/styles/main.module.css";
import Mapbox from "@/components/mapbox";
import Drawer from "@/components/drawer";

const MainContent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const searchParams = useSearchParams();
  // const username = searchParams?.get('username');
  // const lat = searchParams?.get('lat');
  // const lng = searchParams?.get('lng');

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className={styles.mainPage}>
      <Drawer isOpen={isDrawerOpen} onToggle={toggleDrawer} />
      <h1>Welcome to Landsat Explorer</h1>
      <Mapbox />
    </div>
  );
};

export default function MainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}
