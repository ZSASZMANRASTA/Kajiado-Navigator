"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/ui/Navbar";
import MerchantsSection from "@/components/ui/MerchantsSection";
import ShopSection from "@/components/ui/ShopSection";
import MerchantModal from "@/components/ui/MerchantModal";
import SubmitMerchantModal from "@/components/ui/SubmitMerchantModal";
import MapModal from "@/components/ui/MapModal";
import { Town, Shop } from "@/lib/types";
import { fetchTowns, fetchShops, usingLiveData } from "@/lib/supabase";

type Tab = "merchants" | "shop";

export default function HomePage() {
  const [towns, setTowns] = useState<Town[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("merchants");
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMap, setShowMap] = useState(false);

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
    setActiveTab("merchants");
  }, []);

  const selectedTownForShop = selectedShop
    ? towns.find((t) => t.id === selectedShop.town_id) ?? null
    : null;

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-savanna gap-4">
        <div className="w-10 h-10 border-2 border-ochre border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading directory…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMapToggle={() => setShowMap(true)}
        onSubmitClick={() => setShowSubmitModal(true)}
      />

      {/* Page content */}
      <main className="pt-14">
        {activeTab === "merchants" ? (
          <MerchantsSection
            towns={towns}
            shops={shops}
            selectedTown={selectedTown}
            onTownSelect={handleTownSelect}
            onClearTown={() => setSelectedTown(null)}
            onMerchantClick={setSelectedShop}
            onMapOpen={() => setShowMap(true)}
          />
        ) : (
          <ShopSection />
        )}
      </main>

      {/* Data source badge */}
      <div
        className="fixed bottom-4 right-4 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg"
        style={{ zIndex: 60 }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${usingLiveData ? "bg-acacia animate-pulse" : "bg-yellow-400"}`} />
        {usingLiveData ? "Live data" : "Demo data"}
      </div>

      {/* Modals */}
      {showMap && (
        <MapModal
          towns={towns}
          shops={shops}
          selectedTown={selectedTown}
          onTownSelect={handleTownSelect}
          onClose={() => setShowMap(false)}
        />
      )}

      {selectedShop && (
        <MerchantModal
          shop={selectedShop}
          town={selectedTownForShop}
          onClose={() => setSelectedShop(null)}
        />
      )}

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
