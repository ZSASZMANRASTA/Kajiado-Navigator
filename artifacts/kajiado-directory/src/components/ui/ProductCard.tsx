"use client";

import { useState } from "react";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
  onCartOpen?: () => void;
}

const CATEGORY_BG: Record<string, string> = {
  "Dry Goods": "bg-amber-50 text-amber-700 border-amber-200",
  "Oils & Fats": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Fresh Produce": "bg-green-50 text-green-700 border-green-200",
  Household: "bg-sky-50 text-sky-700 border-sky-200",
  Crafts: "bg-ochre/10 text-ochre border-ochre/30",
  Spices: "bg-red-50 text-red-700 border-red-200",
};

export default function ProductCard({ product, onCartOpen }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const catClass = CATEGORY_BG[product.category] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const inCart = items.find((i) => i.product.id === product.id);

  const handleAdd = () => {
    if (!product.in_stock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
    onCartOpen?.();
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col ${!product.in_stock ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ochre/10 to-acacia/10 flex items-center justify-center">
            <span className="text-4xl opacity-30">📦</span>
          </div>
        )}
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
        {inCart && (
          <div className="absolute top-2.5 right-2.5 bg-acacia text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ×{inCart.quantity} in cart
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catClass}`}>
          {product.category}
        </span>

        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1">{product.name}</h3>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-extrabold text-gray-900">KSh {product.price.toLocaleString()}</p>
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

        <button
          onClick={handleAdd}
          disabled={!product.in_stock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
            added
              ? "bg-acacia text-white"
              : "bg-ochre hover:bg-ochre/90 text-white"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {added ? "Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
