"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import TownSidebar from "@/components/ui/TownSidebar";
import { Town } from "@/lib/types";
import { TOWNS, SHOPS } from "@/lib/data";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-ochre border-t-transparent rounded-full animate-spin" />
        <p className="text-savanna/70 text-sm">Loading satellite map…</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);

  const handleTownSelect = (town: Town) => {
    setSelectedTown(town);
  };

  const handleClearSelection = () => {
    setSelectedTown(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      {/* Main content below navbar */}
      <div className="flex flex-1 overflow-hidden pt-14">
        {/* Left: Satellite Map */}
        <div className="flex-1 relative" style={{ zIndex: 0 }}>
          <div className="absolute inset-0">
            <MapComponent
              towns={TOWNS}
              selectedTown={selectedTown}
              onTownSelect={handleTownSelect}
            />
          </div>
        </div>

        {/* Right: Town & Merchant Directory */}
        <div
          className="w-80 xl:w-96 shrink-0 border-l border-gray-200 overflow-hidden"
          style={{ zIndex: 50 }}
        >
          <TownSidebar
            towns={TOWNS}
            shops={SHOPS}
            selectedTown={selectedTown}
            onTownSelect={handleTownSelect}
            onClearSelection={handleClearSelection}
          />
        </div>
      </div>
    </div>
  );
}
