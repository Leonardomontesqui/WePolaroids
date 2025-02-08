"use client";
import React, { useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReportForm } from "./ReportForm";
import { useMapbox } from "@/lib/hooks/useMapbox";
import { useMemories } from "@/lib/hooks/useMemories";
import PostTab from "./PostTab";
import mapboxgl from "mapbox-gl";

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null!);
  const activeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { mapRef } = useMapbox(mapContainerRef);
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  const { selectedMemory, setSelectedMemory } = useMemories(mapRef);

  const clearCurrentMarker = () => {
    if (activeMarkerRef.current) {
      activeMarkerRef.current.remove();
      activeMarkerRef.current = null;
    }
    setSelectedLocation(null);
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (selectedMemory) return; // Do nothing if a memory is selected

    const lngLat = e.lngLat;

    clearCurrentMarker();

    const el = document.createElement("div");
    el.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 border border-gray-200 flex flex-col items-center">
        <div class="w-4 h-4 bg-red-500 rounded-full mb-1"></div>
        <p class="text-xs text-gray-600 text-center">Selected Location</p>
      </div>
    `;

    activeMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(mapRef.current!);

    setSelectedLocation({ lng: lngLat.lng, lat: lngLat.lat });
  };

  // Attach the click handler to the map when it's loaded
  React.useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current?.off("click", handleMapClick);
    };
  }, [mapRef, selectedMemory]);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {selectedMemory && (
        <PostTab post={selectedMemory} setSelectedPost={setSelectedMemory} />
      )}

      {selectedLocation && !selectedMemory && (
        <ReportForm location={selectedLocation} onClose={clearCurrentMarker} />
      )}

      <style jsx global>{`
        .custom-marker {
          transform: translate(-50%, -100%);
        }
        .memory-marker {
          transform: translate(-50%, -100%);
          cursor: pointer;
        }
        .memory-marker img {
          width: 64px;
          height: 80px;
          object-fit: cover;
        }
        .marker-container {
          position: relative;
        }
        .hover-card {
          z-index: 30;
          pointer-events: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .marker-container:hover .hover-card {
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
