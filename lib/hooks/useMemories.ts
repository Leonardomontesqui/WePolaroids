import { useEffect, useRef, useState } from "react";

import { createCustomMarker } from "../utils/mapHelpers";
import { fetchPosts, subscribeToMemories } from "./useUser";
import { Post } from "../types";

export const useMemories = (mapRef: React.RefObject<mapboxgl.Map | null>) => {
  const [memories, setMemories] = useState<Post[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Post | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapRef.current) return;

    fetchPosts().then(setMemories);

    const unsubscribe = subscribeToMemories((newMemory) => {
      setMemories((prev) => [...prev, newMemory as Post]);
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
      const marker = createCustomMarker(memory, setSelectedMemory)
        .setLngLat(memory.location)
        .addTo(mapRef.current!);

      markersRef.current[memory.id] = marker;
    });
  }, [memories]);

  return { memories, markersRef, selectedMemory, setSelectedMemory };
};
