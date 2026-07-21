"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Store, Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useStore, BG_THEMES, AdSlide } from "@/lib/products-store";
import { ALL_CATEGORIES, CATEGORY_COLORS } from "@/lib/data";
import MerchantCard from "./MerchantCard";

function AdCarousel({ slides }: { slides: AdSlide[] }) {
  const active = slides.filter((s) => s.active);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + active.length) % active.length), [active.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % active.length), [active.length]);

  useEffect(() => {
    setCurrent(0);
  }, [active.length]);

  useEffect(() => {
    if (paused || active.length <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next, paused, active.length]);

  if (active.length === 0) return null;

  const idx = Math.min(current, active.length - 1);
  const slide = active[idx];
  const theme = BG_THEMES[slide.bg] ?? BG_THEMES["dark"];

  const handleClick = () => {
    if (slide.link) window.open(slide.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden mb-6 h-44 sm:h-52 select-none ${slide.link ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={handleClick}
    >
      {active.map((s, i) => {
        const t = BG_THEMES[s.bg] ?? BG_THEMES["dark"];
        return (
          <div key={s.id} className={`absolute inset-0 bg-gradient-to-br ${t.gradient} transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`} />
        );
      })}

      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:18px_18px]" />

      <div className="relative z-10 flex flex-col justify-between h-full px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-extrabold text-white/60 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-full">
            {slide.label}
          </span>
          <span className="text-3xl sm:text-4xl">{slide.emoji}</span>
        </div>
        <div>
          <h2 className="text-white font-extrabold text-xl sm:text-2xl leading-tight mb-1">{slide.headline}</h2>
          <p className="text-white/70 text-xs sm:text-sm max-w-xs leading-snug">{slide.sub}</p>
          {slide.cta && (
            <span className="inline-block mt-2 text-[10px] font-bold text-white/80 bg-white/15 px-3 py-1 rounded-full border border-white/20">
              {slide.cta} →
            </span>
          )}
        </div>
      </div>

      {active.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {active.map((s, i) => (
              <button key={s.id} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface ShopSectionProps {
  onCartOpen: () => void;
}

export default function ShopSection({ onCartOpen: _onCartOpen }: ShopSectionProps) {
  const { shops, slides } = useStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const displayShops = useMemo(() => {
    let list = shops;
    if (activeCategory) list = list.filter((s) => s.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.tagline ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [shops, activeCategory, search]);

  const isFiltering = search.trim() !== "" || activeCategory !== null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <AdCarousel slides={slides} />

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight mb-0.5">
          Browse <span className="text-ochre">Local Merchants</span>
        </h2>
        <p className="text-sm text-gray-400">{shops.length} businesses across Kajiado County</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search merchants by name, category…"
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ochre/30 focus:border-ochre text-gray-800 shadow-sm transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            !activeCategory ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const colorClass = CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600 border-gray-200";
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                isActive ? colorClass : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Result count + clear */}
      {isFiltering && (
        <p className="text-xs text-gray-400 mb-4">
          {displayShops.length} result{displayShops.length !== 1 ? "s" : ""}
          {activeCategory && ` in ${activeCategory}`}
          {search.trim() && ` matching "${search.trim()}"`}
          <button
            onClick={() => { setSearch(""); setActiveCategory(null); }}
            className="ml-2 text-ochre hover:underline"
          >
            Clear
          </button>
        </p>
      )}

      {/* Grid */}
      {displayShops.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-600 mb-1">No merchants found</p>
          <p className="text-sm text-gray-400">
            {isFiltering ? "Try a different search or category." : "No merchants listed yet."}
          </p>
          {isFiltering && (
            <button
              onClick={() => { setSearch(""); setActiveCategory(null); }}
              className="mt-3 text-xs text-ochre hover:underline"
            >
              Clear filters
            </button>
          )}
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
