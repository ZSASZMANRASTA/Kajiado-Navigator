"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Town, Shop } from "@/lib/types";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="w-7 h-7 border-2 border-ochre border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface MapModalProps {
  towns: Town[];
  shops: Shop[];
  selectedTown: Town | null;
  onTownSelect: (town: Town) => void;
  onClose: () => void;
}

export default function MapModal({ towns, shops, selectedTown, onTownSelect, onClose }: MapModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0" style={{ zIndex: 200 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-4 sm:inset-8 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Map header */}
        <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between shrink-0">
          <p className="text-white text-sm font-semibold">Kajiado County — Satellite View</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex-1">
          <MapComponent
            towns={towns}
            shops={shops}
            selectedTown={selectedTown}
            onTownSelect={(town) => { onTownSelect(town); onClose(); }}
          />
        </div>
      </div>
    </div>
  );
}
