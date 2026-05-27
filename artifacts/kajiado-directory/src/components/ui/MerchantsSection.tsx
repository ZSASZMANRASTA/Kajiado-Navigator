"use client";

import { useState, useMemo } from "react";
import { MapPin, Store, Search, X, SlidersHorizontal, ArrowLeft, Map } from "lucide-react";
import { Town, Shop } from "@/lib/types";
import { ALL_CATEGORIES, CATEGORY_COLORS } from "@/lib/data";
import MerchantCard from "./MerchantCard";

interface MerchantsSectionProps {
  towns: Town[];
  shops: Shop[];
  selectedTown: Town | null;
  onTownSelect: (town: Town) => void;
  onClearTown: () => void;
  onMapOpen: () => void;
}

export default function MerchantsSection({
  towns, shops, selectedTown, onTownSelect, onClearTown, onMapOpen,
}: MerchantsSectionProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayShops = useMemo(() => {
    let list = selectedTown ? shops.filter((s) => s.town_id === selectedTown.id) : shops;
    if (activeCategory) list = list.filter((s) => s.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [shops, selectedTown, activeCategory, query]);

  const isFiltering = query !== "" || activeCategory !== null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {!selectedTown ? (
        <div className="mb-8">
          {/* Hero row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">
                Kajiado's Best<br />
                <span className="text-ochre">Local Businesses</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1.5">
                {shops.length} merchants across {towns.length} towns
              </p>
            </div>
          </div>

          {/* Town pills + Map button row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={onClearTown}
              className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                !selectedTown ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              All Towns
            </button>
            {towns.map((town) => {
              const count = shops.filter((s) => s.town_id === town.id).length;
              return (
                <button
                  key={town.id}
                  onClick={() => onTownSelect(town)}
                  className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    selectedTown?.id === town.id
                      ? "bg-acacia text-white border-acacia"
                      : "bg-white text-gray-600 border-gray-200 hover:border-acacia/50"
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {town.name}
                  {count > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 shrink-0 mx-1" />

            {/* Map popup button */}
            <button
              onClick={onMapOpen}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-acacia/40 text-acacia bg-acacia/5 hover:bg-acacia/10 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              View on Map
            </button>
          </div>

          {/* Map teaser card */}
          <button
            onClick={onMapOpen}
            className="mt-4 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group relative"
          >
            {/* Fake satellite map background */}
            <div
              className="h-28 w-full relative"
              style={{
                background: "linear-gradient(135deg, #2d4a2d 0%, #3a5c3a 20%, #2a4020 40%, #4a6830 60%, #3d5528 80%, #2d4a2d 100%)",
              }}
            >
              {/* Grid overlay for satellite look */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)"
              }} />
              {/* Town pins */}
              {towns.map((town, i) => (
                <div
                  key={town.id}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${15 + i * 17}%`,
                    top: `${20 + (i % 2) * 35}%`,
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-ochre border-2 border-white shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="text-[8px] text-white font-bold mt-0.5 drop-shadow-md whitespace-nowrap">
                    {town.name}
                  </span>
                </div>
              ))}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <Map className="w-3.5 h-3.5 text-acacia" />
                  Open Satellite Map
                </div>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-3.5 h-3.5 text-acacia" />
                <span className="text-xs font-semibold text-gray-700">Kajiado County Satellite Map</span>
              </div>
              <span className="text-[10px] text-acacia font-semibold">Tap to explore →</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <button
            onClick={() => { onClearTown(); setQuery(""); setActiveCategory(null); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-ochre transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> All Towns
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ochre/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-ochre" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800">{selectedTown.name}</h2>
              <p className="text-sm text-gray-400">
                {shops.filter((s) => s.town_id === selectedTown.id).length} merchants
                <button onClick={onMapOpen} className="ml-2 text-acacia hover:underline text-xs font-semibold">
                  View on map →
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text" value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchants…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800 shadow-sm"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
              !activeCategory ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >All</button>
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const cls = CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600 border-gray-200";
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  isActive ? cls : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >{cat}</button>
            );
          })}
        </div>
      </div>

      {(isFiltering || selectedTown) && (
        <p className="text-xs text-gray-400 mb-4">
          {displayShops.length} result{displayShops.length !== 1 ? "s" : ""}
          {isFiltering && (
            <button onClick={() => { setQuery(""); setActiveCategory(null); }} className="ml-2 text-ochre hover:underline">
              Clear filters
            </button>
          )}
        </p>
      )}

      {displayShops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-600 mb-1">No merchants found</p>
          <p className="text-sm text-gray-400">
            {isFiltering ? "Try a different search or category." : "No merchants listed yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayShops.map((shop) => (
            <MerchantCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
