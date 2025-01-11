"use client";

import Header from "@/components/Header";
import MapBox from "@/components/MapBox";

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <Header />
      <MapBox />
    </div>
  );
}
