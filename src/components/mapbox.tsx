'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapRef, Marker } from 'react-map-gl';
import styles from '../styles/login.module.css';
import { MapMouseEvent } from 'mapbox-gl';
import MapGL from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Mapbox() {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [mapInstance, setMapInstance] = useState<MapRef | null>(null);
  const [showMap, setShowMap] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });
  const mapRef = useRef<MapRef | null>(null);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  const handleViewportChange = useCallback(
    (newViewport: any) => {
      setViewport({
        ...viewport,
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
        zoom: newViewport.zoom ?? viewport.zoom,
      });

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [newViewport.longitude, newViewport.latitude],
          zoom: newViewport.zoom ?? viewport.zoom,
        });
      }
    },
    [viewport]
  );

  const handleMapClick = (event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    const { x: cursorX, y: cursorY } = event.point;
    setLocation({ lat, lng });
    handleViewportChange({
      latitude: lat,
      longitude: lng,
      zoom: viewport.zoom,
    });
    setShowMap(false);
  };

  const handleMapLoad = (map: any) => {
    setMapInstance(map);
    if (mapRef.current) {
      mapRef.current.addControl(
        new MapboxGeocoder({
          accessToken: MAPBOX_TOKEN,
          mapboxgl: mapboxgl,
          marker: true,
          zoom: viewport.zoom
        }),
        'top-left'
      );
      mapRef.current.addControl(new mapboxgl.NavigationControl());
    }
  };

  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapContainer}>
        <MapGL
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 1
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/standard-satellite"
          onClick={handleMapClick}
          onLoad={handleMapLoad}
        >
          {location.lat !== 0 && location.lng !== 0 && (
            <Marker longitude={location.lng} latitude={location.lat} color="red" />
          )}
        </MapGL>
      </div>
    </div>
  );
}