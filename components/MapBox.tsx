"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MarkerPosition {
  lng: number;
  lat: number;
}

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-79, 44],
        zoom: 9,
      });

      // Add click event listener after map loads
      mapRef.current.on("load", () => {
        mapRef.current?.on("click", (e) => {
          const { lng, lat } = e.lngLat;

          // Create a new marker
          const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);

          // Add popup with coordinates (optional)
          new mapboxgl.Popup()
            .setLngLat([lng, lat])
            .setHTML(
              `<p>Longitude: ${lng.toFixed(4)}<br>Latitude: ${lat.toFixed(
                4
              )}</p>`
            )
            .addTo(mapRef.current!);

          // Store marker reference for cleanup
          setMarkers((prevMarkers) => [...prevMarkers, marker]);

          console.log({
            lng: lng.toFixed(4),
            lat: lat.toFixed(4),
          });
        });
      });

      // Clean up map and markers on unmount
      return () => {
        markers.forEach((marker) => marker.remove());
        mapRef.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []); // Dependencies array remains empty as we want this to run once

  return <div ref={mapContainerRef} className="h-screen w-full" />;
}
