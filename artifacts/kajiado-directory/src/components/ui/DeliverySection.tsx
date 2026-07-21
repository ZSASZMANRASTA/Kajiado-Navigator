"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Truck, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore, BG_THEMES, AdSlide } from "@/lib/products-store";
import ProductCard from "./ProductCard";

function AdCarousel({ slides }: { slides: AdSlide[] }) {
  const active = slides.filter((s) => s.active);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + active.length) % active.length), [active.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % active.length), [active.length]);

  useEffect(() => { setCurrent(0); }, [active.length]);

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

interface DeliverySectionProps {
  onCartOpen: () => void;
}

export default function DeliverySection({ onCartOpen }: DeliverySectionProps) {
  const { products, categories, slides } = useStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const displayProducts = useMemo(() => {
    let filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.badge ?? "").toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [products, activeCategory, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <AdCarousel slides={slides} />

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight mb-0.5">
          Order &amp; <span className="text-ochre">Get Delivered</span>
        </h2>
        <p className="text-sm text-gray-400">Quality goods delivered across Kajiado County</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ochre/30 focus:border-ochre text-gray-800 shadow-sm transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === cat ? "bg-ochre text-white border-ochre" : "bg-white text-gray-500 border-gray-200 hover:border-ochre/50 hover:text-ochre"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-4">
        {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""}
        {activeCategory !== "All" && ` in ${activeCategory}`}
        {search.trim() && ` matching "${search.trim()}"`}
      </p>

      {displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Truck className="w-8 h-8 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-500">No products found</p>
          {search.trim() && <button onClick={() => setSearch("")} className="mt-2 text-xs text-ochre hover:underline">Clear search</button>}
          {!search.trim() && activeCategory !== "All" && <button onClick={() => setActiveCategory("All")} className="mt-2 text-xs text-ochre hover:underline">Show all products</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} onCartOpen={onCartOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
