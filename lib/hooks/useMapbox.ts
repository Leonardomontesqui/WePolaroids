import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

export const useMapbox = (mapContainerRef: React.RefObject<HTMLDivElement>) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-79.9178, 43.263],
      zoom: 2,
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.current?.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 15,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return {
    mapRef,
  };
};
