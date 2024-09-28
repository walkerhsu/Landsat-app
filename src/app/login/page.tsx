'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './login.module.css';
import { MapMouseEvent } from 'mapbox-gl';

// Access the Mapbox token from environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Login() {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [showMap, setShowMap] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here
    router.push(`/main?username=${username}&lat=${location.lat}&lng=${location.lng}`);
  };

  const handleMapClick = (event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    setLocation({ lat, lng });
    setShowMap(false);
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="button" onClick={() => setShowMap(true)}>
          Select Location
        </button>
        {location.lat !== 0 && location.lng !== 0 && (
          <p>Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
        )}
        <button type="submit">Login</button>
      </form>

      {showMap && (
        <div className={styles.mapOverlay}>
          <div className={styles.mapContainer}>
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={{
                longitude: 0,
                latitude: 0,
                zoom: 1
              }}
              style={{width: 600, height: 400}}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onClick={handleMapClick}
            >
              {location.lat !== 0 && location.lng !== 0 && (
                <Marker longitude={location.lng} latitude={location.lat} color="red" />
              )}
            </Map>
            <button className={styles.closeButton} onClick={() => setShowMap(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}