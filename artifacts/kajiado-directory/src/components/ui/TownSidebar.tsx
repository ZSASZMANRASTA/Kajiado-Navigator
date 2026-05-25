"use client";

import { useState, useMemo } from "react";
import { MapPin, Store, ChevronRight, ArrowLeft, Plus } from "lucide-react";
import { Town, Shop } from "@/lib/types";
import MerchantCard from "./MerchantCard";
import SearchBar from "./SearchBar";

interface TownSidebarProps {
  towns: Town[];
  shops: Shop[];
  selectedTown: Town | null;
  onTownSelect: (town: Town) => void;
  onClearSelection: () => void;
  onMerchantClick: (shop: Shop) => void;
  onSubmitClick: () => void;
}

export default function TownSidebar({
  towns,
  shops,
  selectedTown,
  onTownSelect,
  onClearSelection,
  onMerchantClick,
  onSubmitClick,
}: TownSidebarProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const rawTownShops = useMemo(
    () => (selectedTown ? shops.filter((s) => s.town_id === selectedTown.id) : []),
    [shops, selectedTown]
  );

  const filteredShops = useMemo(() => {
    let result = rawTownShops;
    if (activeCategory) result = result.filter((s) => s.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rawTownShops, query, activeCategory]);

  const isFiltering = query !== "" || activeCategory !== null;

  return (
    <aside className="h-full flex flex-col bg-savanna overflow-hidden" style={{ zIndex: 50 }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        {selectedTown ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                  onClearSelection();
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ochre transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All towns
              </button>
              <button
                onClick={onSubmitClick}
                className="flex items-center gap-1 text-xs font-semibold text-ochre hover:text-ochre/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add listing
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ochre/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-ochre" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">{selectedTown.name}</h2>
                <p className="text-[11px] text-gray-500">
                  {rawTownShops.length} merchant{rawTownShops.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {rawTownShops.length > 0 && (
              <SearchBar
                query={query}
                activeCategory={activeCategory}
                onQueryChange={setQuery}
                onCategoryChange={setActiveCategory}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-800 text-sm">Towns</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Select a town to explore merchants
              </p>
            </div>
            <button
              onClick={onSubmitClick}
              className="flex items-center gap-1 text-xs font-semibold bg-ochre text-white px-3 py-1.5 rounded-lg hover:bg-ochre/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              List yours
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {selectedTown ? (
          <div className="p-3 space-y-2.5">
            {filteredShops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Store className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {isFiltering ? "No matches found" : "No merchants yet"}
                </p>
                <p className="text-xs text-gray-400">
                  {isFiltering
                    ? "Try a different search or category."
                    : `Merchants in ${selectedTown.name} will appear here once listed.`}
                </p>
                {isFiltering && (
                  <button
                    onClick={() => { setQuery(""); setActiveCategory(null); }}
                    className="mt-3 text-xs text-ochre hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredShops.map((shop) => (
                <MerchantCard key={shop.id} shop={shop} onClick={onMerchantClick} />
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
