"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/ui/Navbar";
import TownSidebar from "@/components/ui/TownSidebar";
import MerchantModal from "@/components/ui/MerchantModal";
import SubmitMerchantModal from "@/components/ui/SubmitMerchantModal";
import { Town, Shop } from "@/lib/types";
import { fetchTowns, fetchShops, usingLiveData } from "@/lib/supabase";

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
  const [towns, setTowns] = useState<Town[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const [t, s] = await Promise.all([fetchTowns(), fetchShops()]);
      setTowns(t);
      setShops(s);
      setLoading(false);
    }
    load();
  }, []);

  const handleTownSelect = useCallback((town: Town) => {
    setSelectedTown(town);
    setSidebarOpen(true);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedTown(null);
  }, []);

  const handleMerchantClick = useCallback((shop: Shop) => {
    setSelectedShop(shop);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedShop(null);
  }, []);

  const selectedTownForShop = selectedShop
    ? towns.find((t) => t.id === selectedShop.town_id) ?? null
    : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      {/* Live data badge */}
      {!loading && (
        <div
          className="fixed bottom-4 left-4 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg"
          style={{ zIndex: 60 }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${usingLiveData ? "bg-acacia animate-pulse" : "bg-yellow-400"}`} />
          {usingLiveData ? "Live Supabase data" : "Demo data"}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden pt-14">
        {/* Map — always full width on mobile, left side on desktop */}
        <div className="flex-1 relative" style={{ zIndex: 0 }}>
          <div className="absolute inset-0">
            {!loading && (
              <MapComponent
                towns={towns}
                shops={shops}
                selectedTown={selectedTown}
                onTownSelect={handleTownSelect}
              />
            )}
            {loading && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-ochre border-t-transparent rounded-full animate-spin" />
                  <p className="text-savanna/70 text-sm">Loading…</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop sidebar — always visible on md+ */}
        <div
          className="hidden md:flex w-80 xl:w-96 shrink-0 border-l border-gray-200 overflow-hidden"
          style={{ zIndex: 50 }}
        >
          <div className="w-full">
            <TownSidebar
              towns={towns}
              shops={shops}
              selectedTown={selectedTown}
              onTownSelect={handleTownSelect}
              onClearSelection={handleClearSelection}
              onMerchantClick={handleMerchantClick}
              onSubmitClick={() => setShowSubmitModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile drawer — slides up from bottom */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ zIndex: 90, top: "3.5rem" }}
      >
        {/* Drawer backdrop */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
            style={{ zIndex: -1 }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-savanna rounded-t-2xl shadow-2xl overflow-hidden"
          style={{ height: "75vh" }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>
          <div className="h-full overflow-hidden pb-4">
            <TownSidebar
              towns={towns}
              shops={shops}
              selectedTown={selectedTown}
              onTownSelect={handleTownSelect}
              onClearSelection={handleClearSelection}
              onMerchantClick={handleMerchantClick}
              onSubmitClick={() => setShowSubmitModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Merchant detail modal */}
      {selectedShop && (
        <MerchantModal
          shop={selectedShop}
          town={selectedTownForShop}
          onClose={handleCloseModal}
        />
      )}

      {/* Submit merchant modal */}
      {showSubmitModal && (
        <SubmitMerchantModal
          towns={towns}
          defaultTownId={selectedTown?.id}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
