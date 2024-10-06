"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layer, MapRef, Marker, Source } from "react-map-gl";
import { MapMouseEvent } from "mapbox-gl";
import MapGL from "react-map-gl";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { TLocation } from "../../types";
import { dataLayer } from "./map-style";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { GeoJson } from "@/app/redux/selectedDataset-slice";
import { mockGeoJson } from "./map-geojson";
import Feature from "react-map-gl";
import { setViewport } from "@/app/redux/current-viewport-slice";
import { MapApi } from "@/apis/map-api";
import { SkeletonCard } from "../../components/skeleton-card";
import { calcGeoJson } from "../utils/calc-geojson";
import { setSRData } from "@/app/redux/srData-slice";
import { setShowTutorial } from "@/app/redux/tutorial-slice";
import Tutorial from "@/components/tutorial";

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

interface IAllGridsCoordinates {
  allCorners: number[][][] | undefined;
}

export default function Mapbox({ location, onLocationSelect }: IMapboxProps) {
  const tutorial = useSelector((state: RootState) => state.tutorial);
  const mapApi = useMemo(() => new MapApi(), []);
  const viewport = useSelector((state: RootState) => state.currentViewport);
  const dispatch = useDispatch();
  const selectedDataset = useSelector(
    (state: RootState) => state.selectedDataset
  );
  const [showMarker, setShowMarker] = useState<boolean>(false);

  // const [viewport, setViewport] = useState({
  //   latitude: 25.13680057687235,
  //   longitude: 121.50427011487547,
  //   zoom: 15,
  // });

  const initviewport = {
    latitude: 25.13680057687235,
    longitude: 121.50427011487547,
    zoom: 15,
  };
  const mapRef = useRef<MapRef | null>(null);
  // const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleViewportChange({
      latitude: location.lat,
      longitude: location.lng,
      zoom: 15,
    });
  }, [location]);

  const handleSaveFavoriteLocations = useCallback(() => {}, [viewport]);

  const handleViewportChange = useCallback(
    (newViewport: Viewport) => {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [newViewport.longitude, newViewport.latitude],
          zoom: newViewport.zoom ?? viewport.zoom,
        });
      }
      dispatch(
        setViewport({
          center: { lat: newViewport.latitude, lng: newViewport.longitude },
          zoom: newViewport.zoom ?? viewport.zoom,
        })
      );
    },
    [viewport, mapRef.current]
  );

  const [isloading, setIsLoading] = useState<boolean>(false);

  const handleMapLoad = () => {
    setIsLoading(true);
    if (mapRef.current) {
      // console.log("Map loaded");
      setIsLoading(false);
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

  const [allGeoJsons, setAllGeoJsons] = useState<GeoJson | null>(null);

  const handleMapClick = (event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    const SR_data = calcGeoJson({ lng, lat }, allGeoJsons!);
    if (SR_data) {
      dispatch(setSRData(SR_data));
    }
    event.originalEvent.stopPropagation();
    handleViewportChange({
      latitude: lat,
      longitude: lng,
      zoom: 18.5,
    });
    setShowMarker(true);
    onLocationSelect({ lat, lng });
  };

  const handleFetchGeoJson = useCallback(async () => {
    console.log(selectedDataset);
    if (!selectedDataset) return;
    const [error, returnedGeoJson] = await mapApi.fetchGeoJson(
      selectedDataset.datasetID,
      selectedDataset.location
    );
    if (error) {
      console.log(error);
      return;
    }
    setAllGeoJsons(returnedGeoJson);
    handleViewportChange({
      latitude: selectedDataset.location.lat,
      longitude: selectedDataset.location.lng,
      zoom: 18.5,
    });
    return null;
  }, [mapApi, setAllGeoJsons, selectedDataset]);

  const allGeoJsonsData = useMemo(() => {
    // console.log("allGeoJsons: ", allGeoJsons);
    return allGeoJsons;
  }, [allGeoJsons]);

  useEffect(() => {
    console.log(selectedDataset);
    if (
      mapRef.current &&
      selectedDataset.datasetID.length &&
      selectedDataset.location
    ) {
      console.log(selectedDataset.datasetID);
      handleFetchGeoJson();
    }
  }, [selectedDataset]);

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };

  return (
    <>
      {isloading ? (
        <SkeletonCard />
      ) : (
        <>
          <MapGL
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={initviewport}
            mapStyle="mapbox://styles/mapbox/standard-satellite"
            onClick={handleMapClick}
            onLoad={handleMapLoad}
          >
            {/* {allGeoJsonsData && ( */}
            {/* <div onClick={() => console.log("clicked")}> */}
            {!isloading && allGeoJsonsData && (
              <Source type="geojson" data={allGeoJsonsData}>
                <Layer {...dataLayer} />
              </Source>
            )}
            {/* </div> */}
            {/* )} */}

            {showMarker && location && (
              <Marker
                longitude={viewport.center.lng}
                latitude={viewport.center.lat}
                color="red"
              />
            )}
          </MapGL>
          {tutorial.showTutorial && (
            <Tutorial onClose={() => dispatch(setShowTutorial(false))} />
          )}
        </>
      )}
    </>
  );
}
