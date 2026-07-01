"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Tab } from "@/components/layout/types";
import MerchantsSection from "@/components/ui/MerchantsSection";
import ShopSection from "@/components/ui/ShopSection";
import JobsSection from "@/components/ui/JobsSection";
import CartDrawer from "@/components/ui/CartDrawer";
import AdminSection from "@/components/ui/AdminSection";
import MapModal from "@/components/ui/MapModal";
import SubmitMerchantModal from "@/components/ui/SubmitMerchantModal";
import { useStore } from "@/lib/products-store";
import { Town } from "@/lib/types";

export default function HomePage() {
  const { towns, shops } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const [selectedTown, setSelectedTown] = useState<Town | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleTownSelect = useCallback((town: Town) => {
    setSelectedTown(town);
    setActiveTab("merchants");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCartOpen={() => setShowCart(true)}
        onMapOpen={() => setShowMap(true)}
        onAdminOpen={() => setShowAdmin(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <TopBar
        onMenuOpen={() => setMobileSidebarOpen(true)}
        onCartOpen={() => setShowCart(true)}
      />

      <main className="flex-1 sm:ml-60 pt-14 sm:pt-0 min-h-screen overflow-y-auto">
        {activeTab === "shop" && <ShopSection onCartOpen={() => setShowCart(true)} />}
        {activeTab === "merchants" && (
          <MerchantsSection
            towns={towns}
            selectedTown={selectedTown}
            onTownSelect={handleTownSelect}
            onClearTown={() => setSelectedTown(null)}
            onMapOpen={() => setShowMap(true)}
            onSubmitOpen={() => setShowSubmit(true)}
          />
        )}
        {activeTab === "jobs" && <JobsSection />}
      </main>

      {showCart   && <CartDrawer onClose={() => setShowCart(false)} />}
      {showAdmin  && <AdminSection onClose={() => setShowAdmin(false)} />}
      {showMap    && <MapModal towns={towns} shops={shops} selectedTown={selectedTown} onTownSelect={handleTownSelect} onClose={() => setShowMap(false)} />}
      {showSubmit && <SubmitMerchantModal towns={towns} defaultTownId={selectedTown?.id} onClose={() => setShowSubmit(false)} />}
    </div>
  );
}
