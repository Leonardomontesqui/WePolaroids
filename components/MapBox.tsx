"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReportForm } from "./ReportForm";

interface MarkerPosition {
  lng: number;
  lat: number;
}

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<MarkerPosition | null>(null);

  const clearCurrentMarker = () => {
    if (activeMarkerRef.current) {
      activeMarkerRef.current.remove();
      activeMarkerRef.current = null;
    }
    setSelectedLocation(null);
  };

  const createNewMarker = (lngLat: { lng: number; lat: number }) => {
    // Clear any existing marker first
    clearCurrentMarker();

    // Create custom marker element
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <div class="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
        <p class="text-xs text-gray-600 text-center">Selected Location</p>
      </div>
    `;

    // Create and add new marker
    const newMarker = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(mapRef.current!);

    // Update refs and state
    activeMarkerRef.current = newMarker;
    setSelectedLocation({ lng: lngLat.lng, lat: lngLat.lat });
  };

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
          createNewMarker(e.lngLat);
        });
      });

      // Clean up on unmount
      return () => {
        clearCurrentMarker();
        mapRef.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Report Form */}
      {selectedLocation && (
        <div className="absolute top-0 right-0 w-80">
          <ReportForm
            location={selectedLocation}
            onClose={clearCurrentMarker}
          />
        </div>
      )}

      <style jsx global>{`
        .custom-marker {
          transform: translate(-50%, -100%);
        }
      `}</style>
    </div>
  );
}
