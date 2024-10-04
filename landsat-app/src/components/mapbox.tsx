"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layer, MapRef, Marker, Source } from "react-map-gl";
import styles from "@/components/styles/mapbox.module.css";
import { MapMouseEvent } from "mapbox-gl";
import MapGL from "react-map-gl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { TLocation } from "../types";
import { dataLayer } from "./map-style";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { GeoJson } from "@/app/redux/selectedDataset-slice";
import { mockGeoJson } from "./map-geojson";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Viewport = {
  latitude: number;
  longitude: number;
  zoom: number | undefined;
};

interface IMapboxProps {
  location: TLocation;
  onLocationSelect: (location: TLocation) => void;
}

export default function Mapbox({ location, onLocationSelect }: IMapboxProps) {
  const selectedDataset = useSelector(
    (state: RootState) => state.selectedDataset
  );
  const [showMarker, setShowMarker] = useState<boolean>(false);

  const [viewport, setViewport] = useState({
    latitude: location.lat,
    longitude: location.lng,
    zoom: 15,
  });
  const mapRef = useRef<MapRef | null>(null);
  // const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleViewportChange({
      latitude: location.lat,
      longitude: location.lng,
      zoom: 15,
    });
  }, [location]);

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
          placeholder: "Search for a location",
        }),
        "top-right"
      );
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "right");
    }
  };
  const [allData, setAllData] = useState<GeoJson[] | null>(null);

  const data = useMemo(() => {
    // console.log(mockGeoJson);
    return allData;
    // return [mockGeoJson];
  }, [allData]);

  // const fetchGeoJson = async () => {
  //   try {
  //     const response = await fetch(
  //       'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
  //     );
  //     const json = await response.json();
  //     setAllData(json);
  //   } catch (error) {
  //     console.error('Could not load data', error);
  //   }
  // }

  useEffect(() => {
    // console.log(selectedDataset);
    // console.log(selectedDataset.locations.map((loc) => loc.geoJsons));
    setAllData(selectedDataset.locations.map((loc) => loc.geoJsons));
    // setAllData([mockGeoJson]);
    // fetchGeoJson();
  }, [selectedDataset]);

  return (
    // <div className={styles.mapOverlay}>
    // <div className={styles.mapContainer}>
    // {
    <MapGL
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={viewport}
      // style={{ height: "60vh", width: "90vw" }}
      mapStyle="mapbox://styles/mapbox/standard-satellite"
      onClick={handleMapClick}
      onLoad={handleMapLoad}
    >
      {data?.map((item, index) => (
        <Source key={index} type="geojson" data={item}>
          <Layer {...dataLayer} />
        </Source>
      ))}

      {showMarker && location && (
        <Marker
          longitude={viewport.longitude}
          latitude={viewport.latitude}
          color="red"
        />
      )}
    </MapGL>
    // }
    // </div>
    // </div>
  );
}
