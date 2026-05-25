"use client";

import { Star, Tag } from "lucide-react";
import { Shop } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/data";

interface MerchantCardProps {
  shop: Shop;
}

export default function MerchantCard({ shop }: MerchantCardProps) {
  const categoryClass =
    CATEGORY_COLORS[shop.category] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-4 hover:border-ochre/40 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-ochre transition-colors">
          {shop.name}
        </h3>
        {shop.is_premium && (
          <div className="flex items-center gap-1 bg-ochre/10 text-ochre border border-ochre/30 rounded-full px-2 py-0.5 shrink-0">
            <Star className="w-2.5 h-2.5 fill-ochre" />
            <span className="text-[10px] font-semibold">Premium</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {shop.description}
      </p>

      <div className="flex items-center gap-1.5">
        <Tag className="w-3 h-3 text-gray-400" />
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryClass}`}
        >
          {shop.category}
        </span>
      </div>
    </div>
  );
}
