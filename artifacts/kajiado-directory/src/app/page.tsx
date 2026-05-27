"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/lib/cart";
import Navbar, { Tab } from "@/components/ui/Navbar";
import MerchantsSection from "@/components/ui/MerchantsSection";
import ShopSection from "@/components/ui/ShopSection";
import JobsSection from "@/components/ui/JobsSection";
import CartDrawer from "@/components/ui/CartDrawer";
import SubmitMerchantModal from "@/components/ui/SubmitMerchantModal";
import MapModal from "@/components/ui/MapModal";
import { Town } from "@/lib/types";
import { fetchTowns, fetchShops, usingLiveData } from "@/lib/supabase";

export default function HomePage() {
  const { itemCount } = useCart();
  const [towns, setTowns] = useState<Town[]>([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [showCart, setShowCart] = useState(false);
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

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 bg-gray-50">
        <div className="w-10 h-10 border-2 border-ochre border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading…</p>
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
        cartCount={itemCount}
        onCartOpen={() => setShowCart(true)}
      />

      <main className="pt-14">
        {activeTab === "shop" && <ShopSection onCartOpen={() => setShowCart(true)} />}
        {activeTab === "merchants" && (
          <MerchantsSection
            towns={towns}
            shops={shops}
            selectedTown={selectedTown}
            onTownSelect={handleTownSelect}
            onClearTown={() => setSelectedTown(null)}
            onMapOpen={() => setShowMap(true)}
          />
        )}
        {activeTab === "jobs" && <JobsSection />}
      </main>

      <div
        className="fixed bottom-4 right-4 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg"
        style={{ zIndex: 60 }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${usingLiveData ? "bg-acacia animate-pulse" : "bg-yellow-400"}`} />
        {usingLiveData ? "Live data" : "Demo data"}
      </div>

      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}

      {showMap && (
        <MapModal
          towns={towns}
          shops={shops}
          selectedTown={selectedTown}
          onTownSelect={handleTownSelect}
          onClose={() => setShowMap(false)}
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
