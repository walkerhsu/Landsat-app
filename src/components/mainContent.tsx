'use client';

import { useSearchParams } from 'next/navigation';
import styles from '../styles/main.module.css';

export default function MainContent() {
  const searchParams = useSearchParams();
  const username = searchParams?.get('username');
  const lat = searchParams?.get('lat');
  const lng = searchParams?.get('lng');

  return (
    <div className={styles.mainPage}>
      <h1>Welcome to Landsat Explorer</h1>
      <div className={styles.userInfo}>
        <p>Username: {username}</p>
        <p><strong>Selected Location:</strong> Latitude: {lat}, Longitude: {lng}</p>
      </div>
      {/* Add more content for the main app here */}
    </div>
  );
}