"use client";

import { MapPin, Map, Plus, ShoppingBag, Store, Briefcase, ShoppingCart } from "lucide-react";

export type Tab = "shop" | "merchants" | "jobs";

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onMapToggle: () => void;
  onSubmitClick: () => void;
  cartCount?: number;
  onCartOpen?: () => void;
}

const TABS: { id: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "shop", label: "Our Shop", icon: ShoppingBag },
  { id: "merchants", label: "Merchants", icon: Store },
  { id: "jobs", label: "Jobs", icon: Briefcase },
];

export default function Navbar({
  activeTab, onTabChange, onMapToggle, onSubmitClick, cartCount = 0, onCartOpen,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm" style={{ zIndex: 100 }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-ochre flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-sm font-bold text-gray-800">Kajiado</p>
            <p className="text-[10px] text-gray-400">County, Kenya</p>
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 mx-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? id === "shop"
                    ? "bg-ochre text-white shadow-sm"
                    : id === "jobs"
                    ? "bg-gray-800 text-white shadow-sm"
                    : "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onMapToggle}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-acacia border border-gray-200 hover:border-acacia/50 px-3 py-1.5 rounded-xl transition-all"
          >
            <Map className="w-3.5 h-3.5" />
            Map
          </button>

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-ochre hover:text-ochre transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ochre text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onSubmitClick}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gray-800 text-white px-3 py-1.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List Business</span>
          </button>
        </div>
      </div>
    </header>
  );
}
