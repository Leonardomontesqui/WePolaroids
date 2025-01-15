import { useEffect, useRef, useState } from "react";

import { createCustomMarker } from "../utils/mapHelpers";
import { fetchMemories, subscribeToMemories } from "../services/memoryService";

export const useMemories = (mapRef: React.RefObject<mapboxgl.Map | null>) => {
  const [memories, setMemories] = useState<any[]>([]);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMemories = async () => {
      const data = await fetchMemories();
      setMemories(data);
    };

    loadMemories();

    const unsubscribe = subscribeToMemories((newMemory) => {
      setMemories((prev) => [...prev, newMemory]);
    });

    return () => {
      unsubscribe();
      Object.values(markersRef.current).forEach((marker) => marker.remove());
    };
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    memories.forEach((memory) => {
      const marker = createCustomMarker(memory)
        .setLngLat(memory.location)
        .addTo(mapRef.current!);

      markersRef.current[memory.id] = marker;
    });
  }, [memories]);

  return { memories, markersRef };
};
