"use client";

import { MapPin, Map, Plus } from "lucide-react";

type Tab = "merchants" | "shop";

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onMapToggle: () => void;
  onSubmitClick: () => void;
}

export default function Navbar({ activeTab, onTabChange, onMapToggle, onSubmitClick }: NavbarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 bg-savanna border-b border-gray-200 shadow-sm"
      style={{ zIndex: 100 }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-ochre flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-gray-800 leading-tight">Kajiado Directory</h1>
            <p className="text-[10px] text-gray-400 leading-tight">Kajiado County, Kenya</p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-1 max-w-xs mx-auto">
          <button
            onClick={() => onTabChange("merchants")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "merchants"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Merchants
          </button>
          <button
            onClick={() => onTabChange("shop")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "shop"
                ? "bg-ochre text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Our Shop
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={onMapToggle}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-acacia border border-gray-200 hover:border-acacia/50 px-3 py-1.5 rounded-xl transition-all"
          >
            <Map className="w-3.5 h-3.5" />
            Map
          </button>
          <button
            onClick={onSubmitClick}
            className="flex items-center gap-1.5 text-xs font-semibold bg-acacia text-white px-3 py-1.5 rounded-xl hover:bg-acacia/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List Business</span>
            <span className="sm:hidden">List</span>
          </button>
        </div>
      </div>
    </header>
  );
}
