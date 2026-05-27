"use client";

import { useParams, useRouter } from "next/navigation";
import { Phone, MessageCircle, Clock, MapPin, Star, ArrowLeft, Store } from "lucide-react";
import { SHOPS, TOWNS, CATEGORY_COLORS } from "@/lib/data";

const THEMES: Record<string, {
  gradient: string; accent: string; lightBg: string; textAccent: string;
}> = {
  Grocery: {
    gradient: "from-green-700 via-emerald-600 to-green-500",
    accent: "#16a34a", lightBg: "bg-green-50", textAccent: "text-green-700",
  },
  "Crafts & Art": {
    gradient: "from-amber-700 via-orange-600 to-ochre",
    accent: "#C36F48", lightBg: "bg-amber-50", textAccent: "text-amber-700",
  },
  Hardware: {
    gradient: "from-gray-800 via-gray-700 to-gray-600",
    accent: "#374151", lightBg: "bg-gray-50", textAccent: "text-gray-700",
  },
  Electronics: {
    gradient: "from-blue-700 via-blue-600 to-blue-500",
    accent: "#2563eb", lightBg: "bg-blue-50", textAccent: "text-blue-700",
  },
  Restaurant: {
    gradient: "from-orange-700 via-orange-600 to-amber-500",
    accent: "#ea580c", lightBg: "bg-orange-50", textAccent: "text-orange-700",
  },
  "Health & Pharmacy": {
    gradient: "from-teal-700 via-teal-600 to-teal-500",
    accent: "#0d9488", lightBg: "bg-teal-50", textAccent: "text-teal-700",
  },
  Hospitality: {
    gradient: "from-purple-800 via-purple-700 to-violet-600",
    accent: "#7c3aed", lightBg: "bg-purple-50", textAccent: "text-purple-700",
  },
};

const DEFAULT_THEME = {
  gradient: "from-gray-700 to-gray-500",
  accent: "#6b7280", lightBg: "bg-gray-50", textAccent: "text-gray-700",
};

const CATEGORY_ICONS: Record<string, string> = {
  Grocery: "🛒",
  "Crafts & Art": "🎨",
  Hardware: "🔧",
  Electronics: "📱",
  Restaurant: "🍽️",
  "Health & Pharmacy": "💊",
  Hospitality: "🏨",
};

export default function MerchantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const shop = SHOPS.find((s) => s.id === id);
  const town = shop ? TOWNS.find((t) => t.id === shop.town_id) : null;

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Store className="w-7 h-7 text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-700">Merchant not found</h2>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-ochre hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  const theme = THEMES[shop.category] ?? DEFAULT_THEME;
  const catClass = CATEGORY_COLORS[shop.category] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const emoji = CATEGORY_ICONS[shop.category] ?? "🏪";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${theme.gradient} overflow-hidden`}>
        {/* Back button */}
        <div className="relative z-10 px-4 pt-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Hero image or gradient background */}
        {shop.image_url && (
          <div className="absolute inset-0">
            <img
              src={shop.image_url}
              alt={shop.name}
              className="w-full h-full object-cover opacity-25"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-80`} />
          </div>
        )}

        {/* Hero content */}
        <div className="relative z-10 px-4 pt-8 pb-10 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            {/* Icon bubble */}
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shrink-0 shadow-lg">
              {emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-white/70 text-xs font-semibold bg-white/10 px-2.5 py-0.5 rounded-full">
                  {shop.category}
                </span>
                {shop.is_premium && (
                  <span className="flex items-center gap-1 text-white text-[10px] font-bold bg-ochre px-2 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    PREMIUM
                  </span>
                )}
              </div>
              <h1 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight">{shop.name}</h1>
              {shop.tagline && (
                <p className="text-white/70 text-sm mt-1 font-medium italic">"{shop.tagline}"</p>
              )}
              {town && (
                <div className="flex items-center gap-1 mt-2 text-white/60 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {town.name}, Kajiado County
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick action buttons — float over hero bottom */}
      <div className="max-w-3xl mx-auto px-4 -mt-5 relative z-20 mb-6">
        <div className="flex gap-3">
          {shop.phone && (
            <a
              href={`tel:${shop.phone.replace(/\s/g, "")}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95"
              style={{ background: theme.accent, color: "white" }}
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] text-white text-sm font-bold shadow-lg transition-all active:scale-95 hover:bg-[#20be5a]"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 pb-12 space-y-5">
        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-3" style={{ color: theme.accent }}>
            About
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{shop.description}</p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hours */}
          {shop.hours && (
            <div className={`rounded-2xl border shadow-sm p-5 ${theme.lightBg} border-transparent`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-4 h-4" style={{ color: theme.accent }} />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Opening Hours</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{shop.hours}</p>
            </div>
          )}

          {/* Location */}
          {town && (
            <div className={`rounded-2xl border shadow-sm p-5 ${theme.lightBg} border-transparent`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <MapPin className="w-4 h-4" style={{ color: theme.accent }} />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{town.name}, Kajiado County</p>
              <p className="text-xs text-gray-400 mt-0.5">Kenya</p>
            </div>
          )}
        </div>

        {/* Contact details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <h2 className="font-bold text-sm uppercase tracking-wide text-gray-400">Contact</h2>
          </div>
          {shop.phone && (
            <a
              href={`tel:${shop.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${theme.accent}15` }}>
                <Phone className="w-4 h-4" style={{ color: theme.accent }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Phone</p>
                <p className="text-sm font-bold" style={{ color: theme.accent }}>{shop.phone}</p>
              </div>
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">WhatsApp</p>
                <p className="text-sm font-bold text-[#25D366]">Chat on WhatsApp</p>
              </div>
            </a>
          )}
        </div>

        {/* Category badge */}
        <div className="flex items-center justify-center">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${catClass}`}>
            {shop.category} · Kajiado Directory
          </span>
        </div>
      </div>
    </div>
  );
}
