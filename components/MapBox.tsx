"use client";
import React, { useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReportForm } from "./ReportForm";
import { useMapbox } from "@/lib/hooks/useMapbox";
import { useMemories } from "@/lib/hooks/useMemories";
import PostTab from "./PostTab";

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null!);
  const { mapRef, selectedLocation, clearCurrentMarker } =
    useMapbox(mapContainerRef);

  const { selectedMemory } = useMemories(mapRef);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {selectedLocation && !selectedMemory && (
        <ReportForm location={selectedLocation} onClose={clearCurrentMarker} />
      )}

      {selectedMemory && <PostTab {...selectedMemory} />}

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
