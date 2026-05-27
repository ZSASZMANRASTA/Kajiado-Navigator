"use client";

import { Menu, MapPin, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

interface TopBarProps {
  onMenuOpen: () => void;
  onCartOpen: () => void;
}

export default function TopBar({ onMenuOpen, onCartOpen }: TopBarProps) {
  const { itemCount } = useCart();

  return (
    <header className="sm:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm z-[100] flex items-center justify-between px-4">
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-ochre flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="font-extrabold text-gray-800 text-sm">Kajiado</p>
      </div>

      <button
        onClick={onCartOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600"
      >
        <ShoppingCart className="w-4 h-4" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-ochre text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
    </header>
  );
}
