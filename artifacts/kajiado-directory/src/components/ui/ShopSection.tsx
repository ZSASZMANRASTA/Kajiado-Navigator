"use client";

import { useState, useMemo } from "react";
import { ShoppingBag, Truck, Shield, RefreshCw } from "lucide-react";
import { useStore } from "@/lib/products-store";
import ProductCard from "./ProductCard";

interface ShopSectionProps {
  onCartOpen: () => void;
}

export default function ShopSection({ onCartOpen }: ShopSectionProps) {
  const { products, categories } = useStore();
  const [activeCategory, setActiveCategory] = useState("All");

  const displayProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-ochre to-[#a85a35] p-6 sm:p-8 mb-8 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            Wholesale-Sourced Goods
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">Our Shop</h2>
          <p className="text-white/80 text-sm max-w-md">
            Quality goods sourced directly from trusted Kenyan wholesalers. Add to cart and we deliver to your door across Kajiado County.
          </p>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-white/70 text-xs"><Truck className="w-3.5 h-3.5" /><span>Delivery across Kajiado</span></div>
            <div className="flex items-center gap-1.5 text-white/70 text-xs"><Shield className="w-3.5 h-3.5" /><span>Trusted suppliers</span></div>
            <div className="flex items-center gap-1.5 text-white/70 text-xs"><RefreshCw className="w-3.5 h-3.5" /><span>Weekly restocking</span></div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
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
      </p>

      {displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="w-8 h-8 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-500">No products in this category</p>
          <button onClick={() => setActiveCategory("All")} className="mt-2 text-xs text-ochre hover:underline">Show all products</button>
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
