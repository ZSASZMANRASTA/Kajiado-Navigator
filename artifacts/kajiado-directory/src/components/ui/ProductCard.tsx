"use client";

import { MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_BG: Record<string, string> = {
  "Dry Goods": "bg-amber-50 text-amber-700 border-amber-200",
  "Oils & Fats": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Fresh Produce": "bg-green-50 text-green-700 border-green-200",
  Household: "bg-sky-50 text-sky-700 border-sky-200",
  Crafts: "bg-ochre/10 text-ochre border-ochre/30",
  Spices: "bg-red-50 text-red-700 border-red-200",
};

export default function ProductCard({ product }: ProductCardProps) {
  const catClass = CATEGORY_BG[product.category] ?? "bg-gray-100 text-gray-600 border-gray-200";

  const handleOrder = () => {
    const msg = encodeURIComponent(
      `Hi! I'd like to order: *${product.name}* (${product.unit}) — KSh ${product.price.toLocaleString()}`
    );
    window.open(`https://wa.me/${(product.whatsapp_order ?? "").replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col ${!product.in_stock ? "opacity-60" : ""}`}>
      {/* Product image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ochre/10 to-acacia/10 flex items-center justify-center">
            <span className="text-4xl opacity-30">📦</span>
          </div>
        )}
        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
            product.badge === "Out of Stock"
              ? "bg-gray-800/70 text-white"
              : product.badge === "Best Seller"
              ? "bg-ochre text-white"
              : "bg-acacia text-white"
          }`}>
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category */}
        <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catClass}`}>
          {product.category}
        </span>

        {/* Name & description */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1">{product.name}</h3>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        {/* Price & stock */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-extrabold text-gray-900">
              KSh {product.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{product.unit}</p>
          </div>
          <div className="flex items-center gap-1">
            {product.in_stock
              ? <CheckCircle className="w-3.5 h-3.5 text-acacia" />
              : <XCircle className="w-3.5 h-3.5 text-gray-400" />}
            <span className={`text-[10px] font-semibold ${product.in_stock ? "text-acacia" : "text-gray-400"}`}>
              {product.in_stock ? "In stock" : "Out of stock"}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleOrder}
          disabled={!product.in_stock}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#25D366] hover:bg-[#20be5a] text-white"
        >
          <MessageCircle className="w-4 h-4" />
          Order on WhatsApp
        </button>
      </div>
    </div>
  );
}
