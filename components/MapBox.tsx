"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ReportForm } from "./ReportForm";
import { createSupabaseClient } from "@/lib/supabase/client";

interface MarkerPosition {
  lng: number;
  lat: number;
}

interface Memory {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  location: [number, number];
}

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const activeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<MarkerPosition | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);

  const supabase = createSupabaseClient();

  const clearCurrentMarker = () => {
    if (activeMarkerRef.current) {
      activeMarkerRef.current.remove();
      activeMarkerRef.current = null;
    }
    setSelectedLocation(null);
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    const lngLat = e.lngLat;

    // Clear any existing marker
    clearCurrentMarker();

    // Create a new marker element
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <div class="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
        <p class="text-xs text-gray-600 text-center">Selected Location</p>
      </div>
    `;

    // Create and add the new marker
    const newMarker = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(lngLat)
      .addTo(mapRef.current!);

    // Update refs and state
    activeMarkerRef.current = newMarker;
    setSelectedLocation({ lng: lngLat.lng, lat: lngLat.lat });
    console.log("Selected location:", lngLat);
  };

  const createCustomMarker = (memory: Memory) => {
    const el = document.createElement("div");
    el.className = "memory-marker";
    el.innerHTML = `
      <div class="marker-container">
        <div class="bg-white flex flex-col justify-center items-center rounded-lg shadow-lg p-2 border border-gray-200 w-[110px] h-[140px] hover:shadow-xl transition-all duration-300 my-auto">
          <img src="${memory.image_url}" 
               alt="${memory.title}"
               class="w-20 h-20 object-cover rounded-lg mb-1" />
        </div>
        
        <!-- Hover Card -->
        <div class="hover-card opacity-0 invisible pointer-events-none absolute left-1/2 bottom-full mb-2 w-64 bg-white rounded-lg shadow-xl p-4 transform -translate-x-1/2 transition-all duration-300">
          <h3 class="text-lg font-semibold mb-2">${memory.title}</h3>
          <p class="text-sm text-gray-600 mb-2">${
            memory.description || "No description available"
          }</p>
          <div class="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div class="w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
          </div>
        </div>
      </div>
    `;

    // Add hover event listeners
    const container = el.querySelector(".marker-container");
    const hoverCard = el.querySelector(".hover-card");

    container?.addEventListener("mouseenter", () => {
      hoverCard?.classList.remove("opacity-0", "invisible");
      hoverCard?.classList.add("opacity-100", "visible");
      el.style.zIndex = "1000";
    });

    container?.addEventListener("mouseleave", () => {
      hoverCard?.classList.add("opacity-0", "invisible");
      hoverCard?.classList.remove("opacity-100", "visible");
      el.style.zIndex = "auto";
    });

    return new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    });
  };

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-79.9178, 43.263],
        zoom: 15,
      });

      // Add click handler after map loads
      mapRef.current.on("load", () => {
        mapRef.current?.on("click", handleMapClick);
      });

      // Initial fetch of memories
      const fetchMemories = async () => {
        const { data, error } = await supabase.from("memories2").select("*");

        if (error) {
          console.error("Error fetching memories:", error);
          return;
        }

        setMemories(data);
      };

      fetchMemories();

      // Set up real-time subscription
      const subscription = supabase
        .channel("memories2_changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "memories2",
          },
          (payload) => {
            setMemories((memories) => [...memories, payload.new as Memory]);
          }
        )
        .subscribe();

      return () => {
        clearCurrentMarker();
        mapRef.current?.remove();
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  // Update markers when memories change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    memories.forEach((memory) => {
      const marker = createCustomMarker(memory)
        .setLngLat(memory.location)
        .addTo(mapRef.current!);

      markersRef.current[memory.id] = marker;
    });
  }, [memories]);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {selectedLocation && (
        <div className="absolute top-4 right-4 w-80">
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
