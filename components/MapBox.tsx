"use client";
import React from "react";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  if (mapRef.current) {
    mapRef.current.on("click", (e) => {
      const clickedPosition = {
        lng: e.lngLat.lng.toFixed(4),
        lat: e.lngLat.lat.toFixed(4),
      };
      console.log(clickedPosition);
    });
  }

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12", // Add default style
        center: [-79, 44],
        zoom: 9,
      });

      // Clean up map on unmount
      return () => {
        mapRef.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []); // Add dependency array to prevent infinite re-renders

  return <div ref={mapContainerRef} className="h-screen w-full" />;
}
