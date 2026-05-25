"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { ALL_CATEGORIES, CATEGORY_COLORS } from "@/lib/data";

interface SearchBarProps {
  query: string;
  activeCategory: string | null;
  onQueryChange: (q: string) => void;
  onCategoryChange: (c: string | null) => void;
}

export default function SearchBar({
  query,
  activeCategory,
  onQueryChange,
  onCategoryChange,
}: SearchBarProps) {
  return (
    <div className="space-y-2">
      {/* Text search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search merchants…"
          className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        <SlidersHorizontal className="w-3 h-3 text-gray-400 shrink-0" />
        <button
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
            activeCategory === null
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
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
              onClick={() => onCategoryChange(isActive ? null : cat)}
              className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                isActive ? colorClass + " ring-2 ring-offset-1 ring-current/30" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
