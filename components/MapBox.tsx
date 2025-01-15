"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReportForm } from "./ReportForm";
import { useMapbox } from "@/lib/hooks/useMapbox";
import { useMemories } from "@/lib/hooks/useMemories";

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null!);
  const {
    mapRef,
    selectedLocation,
    setSelectedLocation,
    clearCurrentMarker,
    handleMapClick,
  } = useMapbox(mapContainerRef);

  const { memories, markersRef } = useMemories(mapRef);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {selectedLocation && (
        <div className="absolute md:top-4 md:right-4 w-80 z-50 top-4 mr-4 ml-5">
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
        .memory-marker {
          transform: translate(-50%, -100%);
          cursor: pointer;
        }
        .memory-marker img {
          width: 64px;
          height: 64px;
          object-fit: cover;
        }
        .marker-container {
          position: relative;
        }
        .hover-card {
          z-index: 1000;
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
