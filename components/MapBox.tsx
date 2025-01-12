"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";
import { ReportForm } from "./ReportForm";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MarkerPosition {
  lit: number;
  lat: number;
}

export default function MapBox() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MarkerPosition | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Save marker to Supabase
  const saveMarker = async (
    lit: number,
    lat: number,
    title: string,
    description: string,
    image_url: string,
    type: string
  ) => {
    try {
      const { error } = await supabase.from("memories3").insert([
        {
          title,
          description,
          image_url,
          lit, // separate lit and lat
          lat,
          type,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving marker to Supabase:", error);
    }
  };

  // Load markers from Supabase
  const loadMarkers = async () => {
    try {
      const { data, error } = await supabase
        .from("memories3") // Updated to memories3
        .select("title, description, image_url, lit, lat, type");

      if (error) throw error;

      if (data && mapRef.current) {
        const newMarkers = data.map((markerData) => {
          const { lit, lat } = markerData;

          const el = document.createElement("div");
          el.className = "custom-marker";
          el.innerHTML = `
            <div class="relative w-10 h-10 bg-black rounded-full flex justify-center items-center">
              <img src="${markerData.image_url}" alt="${markerData.title}" class="w-6 h-6 rounded-full object-cover" />
            </div>
          `;

          return new mapboxgl.Marker({ element: el, anchor: "bottom" })
            .setLngLat([lit, lat])
            .addTo(mapRef.current!);
        });

        setMarkers(newMarkers);
      }
    } catch (error) {
      console.error("Error loading markers from Supabase:", error);
    }
  };

  useEffect(() => {
    console.log(mapContainerRef.current);
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-79.9178, 43.263],
        zoom: 15.2,
      });

      mapRef.current.on("load", () => {
        loadMarkers();

        mapRef.current?.on("click", (e) => {
          const { lng: lit, lat } = e.lngLat;

          setSelectedLocation({ lit, lat });
          setShowForm(true);
        });
      });

      return () => {
        markers.forEach((marker) => marker.remove());
        mapRef.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainerRef} className="h-full w-full" />

      {showForm && selectedLocation && (
        <div className="absolute top-4 right-4 w-80">
          <ReportForm
            location={selectedLocation}
            onSave={async ({ title, description, image_url, type }) => {
              if (selectedLocation) {
                await saveMarker(
                  selectedLocation.lit,
                  selectedLocation.lat,
                  title,
                  description,
                  image_url,
                  type // Include 'type' field
                );
              }
              setShowForm(false);
              setSelectedLocation(null);
            }}
            onClose={() => {
              setShowForm(false);
              setSelectedLocation(null);
            }}
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
