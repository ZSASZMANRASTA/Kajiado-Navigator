"use client";

import { ShoppingBag, Store, Briefcase, ShoppingCart, MapPin, X, Settings, Map } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Tab } from "./types";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onCartOpen: () => void;
  onMapOpen: () => void;
  onAdminOpen: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV: { id: Tab; label: string; icon: React.FC<{ className?: string }>; accent?: string }[] = [
  { id: "shop", label: "Our Shop", icon: ShoppingBag, accent: "text-ochre" },
  { id: "merchants", label: "Merchants", icon: Store },
  { id: "jobs", label: "Jobs", icon: Briefcase },
];

export default function Sidebar({ activeTab, onTabChange, onCartOpen, onMapOpen, onAdminOpen, mobileOpen, onMobileClose }: SidebarProps) {
  const { itemCount } = useCart();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ochre flex items-center justify-center shrink-0">
            <MapPin className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-gray-800 text-sm leading-tight">Kajiado Directory</p>
            <p className="text-[10px] text-gray-400 leading-tight">Kajiado County, Kenya</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 flex-1 space-y-0.5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Menu</p>
        {NAV.map(({ id, label, icon: Icon, accent }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { onTabChange(id); onMobileClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? id === "shop"
                    ? "bg-ochre text-white shadow-sm"
                    : "bg-gray-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : (accent ?? "text-gray-400")}`} />
              {label}
            </button>
          );
        })}

        {/* Cart */}
        <div className="pt-3 mt-3 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Shopping</p>
          <button
            onClick={() => { onCartOpen(); onMobileClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
          >
            <div className="relative shrink-0">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-ochre text-white text-[8px] font-extrabold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </div>
            <span>My Cart</span>
            {itemCount > 0 && (
              <span className="ml-auto text-xs font-bold text-ochre bg-ochre/10 px-2 py-0.5 rounded-full">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
            )}
          </button>
          <button
            onClick={() => { onMapOpen(); onMobileClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
          >
            <Map className="w-4 h-4 text-gray-400 shrink-0" />
            View Map
          </button>
        </div>
      </nav>

      {/* Admin */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <button
          onClick={() => { onAdminOpen(); onMobileClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <Settings className="w-4 h-4 text-gray-400 shrink-0" />
          Admin Panel
        </button>
        <p className="text-[10px] text-gray-300 px-3 mt-2">© 2025 Kajiado Directory</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 shadow-sm z-50">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-[150]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-end px-4 pt-4">
              <button onClick={onMobileClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
