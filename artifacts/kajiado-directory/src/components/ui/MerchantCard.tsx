"use client";

import { Star, Phone, MessageCircle, Clock, ChevronRight } from "lucide-react";
import { Shop } from "@/lib/types";
import { CATEGORY_COLORS, CATEGORY_ACCENT } from "@/lib/data";

interface MerchantCardProps {
  shop: Shop;
  onClick: (shop: Shop) => void;
}

export default function MerchantCard({ shop, onClick }: MerchantCardProps) {
  const catClass = CATEGORY_COLORS[shop.category] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const accent = CATEGORY_ACCENT[shop.category] ?? "#6b7280";

  return (
    <div
      onClick={() => onClick(shop)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Accent bar */}
      <div className="h-1" style={{ background: accent }} />

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {shop.is_premium && (
                <span className="inline-flex items-center gap-1 bg-ochre text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  PREMIUM
                </span>
              )}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catClass}`}>
                {shop.category}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-ochre transition-colors">
              {shop.name}
            </h3>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-ochre shrink-0 mt-1 transition-colors" />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {shop.description}
        </p>

        {/* Contact pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {shop.hours && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{shop.hours.split(",")[0]}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            {shop.phone && (
              <a
                href={`tel:${shop.phone.replace(/\s/g, "")}`}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg bg-acacia/10 hover:bg-acacia/20 flex items-center justify-center transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-acacia" />
              </a>
            )}
            {shop.whatsapp && (
              <a
                href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
