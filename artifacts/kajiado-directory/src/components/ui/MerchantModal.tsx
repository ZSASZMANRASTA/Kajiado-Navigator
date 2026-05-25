"use client";

import { X, Star, Tag, Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { Shop, Town } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/data";
import { useEffect } from "react";

interface MerchantModalProps {
  shop: Shop;
  town: Town | null;
  onClose: () => void;
}

export default function MerchantModal({ shop, town, onClose }: MerchantModalProps) {
  const categoryClass =
    CATEGORY_COLORS[shop.category] ?? "bg-gray-100 text-gray-600 border-gray-200";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ zIndex: 200 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-savanna w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header stripe */}
        <div className="bg-gradient-to-r from-ochre to-ochre/80 px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {shop.is_premium && (
                  <div className="flex items-center gap-1 bg-white/20 text-white rounded-full px-2 py-0.5">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span className="text-[10px] font-semibold">Premium</span>
                  </div>
                )}
              </div>
              <h2 className="text-white font-bold text-lg leading-tight truncate">
                {shop.name}
              </h2>
              {town && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-white/70" />
                  <span className="text-white/70 text-xs">{town.name}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Category */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${categoryClass}`}>
              {shop.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {shop.description}
          </p>

          {/* Contact info */}
          {(shop.phone || shop.whatsapp || shop.hours) && (
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {shop.hours && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Hours</p>
                    <p className="text-sm text-gray-700">{shop.hours}</p>
                  </div>
                </div>
              )}
              {shop.phone && (
                <a
                  href={`tel:${shop.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-acacia/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-acacia" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Phone</p>
                    <p className="text-sm text-acacia font-medium">{shop.phone}</p>
                  </div>
                </a>
              )}
              {shop.whatsapp && (
                <a
                  href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">WhatsApp</p>
                    <p className="text-sm text-green-600 font-medium">Chat on WhatsApp</p>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Safe area for mobile */}
        <div className="h-safe-bottom pb-4" />
      </div>
    </div>
  );
}
