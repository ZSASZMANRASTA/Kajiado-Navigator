"use client";

import { MapPin, Store, ChevronRight, ArrowLeft } from "lucide-react";
import { Town, Shop } from "@/lib/types";
import MerchantCard from "./MerchantCard";

interface TownSidebarProps {
  towns: Town[];
  shops: Shop[];
  selectedTown: Town | null;
  onTownSelect: (town: Town) => void;
  onClearSelection: () => void;
}

export default function TownSidebar({
  towns,
  shops,
  selectedTown,
  onTownSelect,
  onClearSelection,
}: TownSidebarProps) {
  const townShops = selectedTown
    ? shops.filter((s) => s.town_id === selectedTown.id)
    : [];

  return (
    <aside
      className="h-full flex flex-col bg-savanna overflow-hidden"
      style={{ zIndex: 50 }}
    >
      {/* Sidebar header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        {selectedTown ? (
          <div>
            <button
              onClick={onClearSelection}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ochre transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All towns
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ochre/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-ochre" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">
                  {selectedTown.name}
                </h2>
                <p className="text-[11px] text-gray-500">
                  {townShops.length} merchant{townShops.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-gray-800 text-sm">Towns</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Select a town to explore merchants
            </p>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {selectedTown ? (
          <div className="p-3 space-y-2.5">
            {townShops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Store className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  No merchants yet
                </p>
                <p className="text-xs text-gray-400">
                  Merchants in {selectedTown.name} will appear here once listed.
                </p>
              </div>
            ) : (
              townShops.map((shop) => (
                <MerchantCard key={shop.id} shop={shop} />
              ))
            )}
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {towns.map((town) => {
              const count = shops.filter((s) => s.town_id === town.id).length;
              return (
                <button
                  key={town.id}
                  onClick={() => onTownSelect(town)}
                  className="w-full text-left bg-white rounded-xl border border-gray-100 p-3.5 hover:border-acacia/50 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-acacia/10 flex items-center justify-center shrink-0 group-hover:bg-acacia/20 transition-colors">
                        <MapPin className="w-4 h-4 text-acacia" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-acacia transition-colors">
                          {town.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {count > 0
                            ? `${count} merchant${count !== 1 ? "s" : ""}`
                            : "No listings yet"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-acacia transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
