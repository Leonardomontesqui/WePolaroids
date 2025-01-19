import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

export const useMapbox = (mapContainerRef: React.RefObject<HTMLDivElement>) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  const clearCurrentMarker = () => {
    if (activeMarkerRef.current) {
      activeMarkerRef.current.remove();
      activeMarkerRef.current = null;
    }
    setSelectedLocation(null);
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    const lngLat = e.lngLat;

    clearCurrentMarker();

    const el = document.createElement("div");
    el.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 border border-gray-200 flex flex-col items-center">
        <div class="w-4 h-4 bg-red-500 rounded-full mb-1"></div>
        <p class="text-xs text-gray-600 text-center">Selected Location</p>
      </div>
    `;

    const newMarker = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(lngLat)
      .addTo(mapRef.current!);

    activeMarkerRef.current = newMarker;
    setSelectedLocation({ lng: lngLat.lng, lat: lngLat.lat }); // so the form can show
  };

  useEffect(() => {
    //simply sets up the map
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

    mapRef.current.on("load", () => {
      mapRef.current?.on("click", handleMapClick);
    });

    return () => {
      clearCurrentMarker();
      mapRef.current?.remove();
    };
  }, []);

  return {
    mapRef,
    selectedLocation,
    setSelectedLocation,
    clearCurrentMarker,
    handleMapClick,
  };
};
