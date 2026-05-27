"use client";

import { CartProvider } from "@/lib/cart";
import { StoreProvider } from "@/lib/products-store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </StoreProvider>
  );
}
