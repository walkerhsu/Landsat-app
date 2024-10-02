"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useCallback, useRef, useState } from "react";
// import { useRouter } from 'next/navigation';
import { MapRef, Marker } from "react-map-gl";
import styles from "@/components/styles/mapbox.module.css";
import { MapMouseEvent } from "mapbox-gl";
import MapGL from "react-map-gl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { TLocation } from "../types";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number | undefined;
};

interface IMapboxProps {
  location: TLocation | null;
  onLocationSelect: (location: TLocation) => void;
}

export default function Mapbox({ location, onLocationSelect }: IMapboxProps) {
  // const [location, setLocation] = useState({ lat: 0, lng: 0 });
  // const [mapInstance, setMapInstance] = useState<MapRef | null>(null);
  const [showMarker, setShowMarker] = useState<boolean>(false);

  const [viewport, setViewport] = useState({
    latitude: 25.13680057687235,
    longitude: 121.50427011487547,
    zoom: 15,
  });
  const mapRef = useRef<MapRef | null>(null);
  // const geocoderContainerRef = useRef<HTMLDivElement>(null);

  const handleViewportChange = useCallback(
    (newViewport: Viewport) => {
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
    // const { x: cursorX, y: cursorY } = event.point;
    // setLocation({ lat, lng });
    handleViewportChange({
      latitude: lat,
      longitude: lng,
      zoom: 16,
    });
    setShowMarker(true);
    onLocationSelect({ lat, lng });
    // setShowMap(false);
  };
  const handleMapLoad = () => {
    // setMapInstance(map);
    if (mapRef.current) {
      mapRef.current.addControl(
        new MapboxGeocoder({
          accessToken: MAPBOX_TOKEN,
          mapboxgl: mapboxgl,
          marker: true,
          zoom: viewport.zoom,
        }),
        "top-left"
      );
      mapRef.current.addControl(new mapboxgl.NavigationControl());
    }
  };

  return (
    // <div className={styles.mapOverlay}>
      <div className={styles.mapContainer}>
        {
          <MapGL
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={viewport}
            style={{ height: "30vw", width: "50vw" }}
            mapStyle="mapbox://styles/mapbox/standard-satellite"
            onClick={handleMapClick}
            onLoad={handleMapLoad}
          >
            {showMarker && location && (
              <Marker
                longitude={location.lng}
                latitude={location.lat}
                color="red"
              />
            )}
          </MapGL>
        }
      </div>
    // </div>
  );
}
