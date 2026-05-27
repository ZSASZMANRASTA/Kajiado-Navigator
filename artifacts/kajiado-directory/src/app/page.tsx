"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/lib/cart";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Tab } from "@/components/layout/types";
import MerchantsSection from "@/components/ui/MerchantsSection";
import ShopSection from "@/components/ui/ShopSection";
import JobsSection from "@/components/ui/JobsSection";
import CartDrawer from "@/components/ui/CartDrawer";
import AdminSection from "@/components/ui/AdminSection";
import SubmitMerchantModal from "@/components/ui/SubmitMerchantModal";
import MapModal from "@/components/ui/MapModal";
import { Town, Shop } from "@/lib/types";
import { fetchTowns, fetchShops, usingLiveData } from "@/lib/supabase";

export default function HomePage() {
  const { itemCount } = useCart();
  const [towns, setTowns] = useState<Town[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar — desktop fixed, mobile overlay */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCartOpen={() => setShowCart(true)}
        onMapOpen={() => setShowMap(true)}
        onAdminOpen={() => setShowAdmin(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile top bar */}
      <TopBar
        onMenuOpen={() => setMobileSidebarOpen(true)}
        onCartOpen={() => setShowCart(true)}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="flex-1 sm:ml-60 pt-14 sm:pt-0 min-h-screen overflow-y-auto">
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

        {/* Data badge */}
        <div
          className="fixed bottom-4 right-4 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg"
          style={{ zIndex: 50 }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${usingLiveData ? "bg-acacia animate-pulse" : "bg-yellow-400"}`} />
          {usingLiveData ? "Live data" : "Demo data"}
        </div>
      </main>

      {/* Modals & overlays */}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      {showAdmin && <AdminSection onClose={() => setShowAdmin(false)} />}
      {showMap && (
        <MapModal towns={towns} shops={shops} selectedTown={selectedTown} onTownSelect={handleTownSelect} onClose={() => setShowMap(false)} />
      )}
      {showSubmit && (
        <SubmitMerchantModal towns={towns} defaultTownId={selectedTown?.id} onClose={() => setShowSubmit(false)} />
      )}
    </div>
  );
}
