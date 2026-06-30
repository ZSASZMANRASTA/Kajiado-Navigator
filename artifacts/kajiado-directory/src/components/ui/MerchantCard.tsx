"use client";

import { Star, Phone, MessageCircle, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Shop } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/data";

interface MerchantCardProps {
  shop: Shop;
}

export default function MerchantCard({ shop }: MerchantCardProps) {
  const catClass = CATEGORY_COLORS[shop.category] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const accent = shop.color ?? "#6b7280";

  return (
    <Link
      href={`/merchant/${shop.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        {shop.image_url ? (
          <img
            src={shop.image_url}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `${accent}20` }}>
            <div className="w-12 h-12 rounded-full opacity-30" style={{ background: accent }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {shop.is_premium && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-ochre text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-white" />
            PREMIUM
          </div>
        )}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm bg-white/90 ${catClass}`}>
            {shop.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-ochre transition-colors">
            {shop.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-ochre shrink-0 mt-0.5 transition-colors" />
        </div>

        {shop.tagline && (
          <p className="text-xs font-medium mb-1.5" style={{ color: accent }}>{shop.tagline}</p>
        )}

        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{shop.description}</p>

        {/* Footer row — use div/span instead of <a> to avoid nested anchor tags */}
        <div className="flex items-center justify-between gap-2">
          {shop.hours && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400 min-w-0">
              <Clock className="w-3 h-3 shrink-0" />
              <span className="truncate">{shop.hours.split(",")[0]}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            {shop.phone && (
              <span
                role="img"
                aria-label="Call"
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${accent}15` }}
              >
                <Phone className="w-3.5 h-3.5" style={{ color: accent }} />
              </span>
            )}
            {shop.whatsapp && (
              <span
                role="img"
                aria-label="WhatsApp"
                className="w-7 h-7 rounded-lg bg-[#25D366]/10 flex items-center justify-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
