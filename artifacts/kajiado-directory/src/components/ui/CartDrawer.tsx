"use client";

import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import CheckoutModal from "./CheckoutModal";

const DELIVERY_FEE = 200;

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, removeItem, setQuantity, subtotal, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const total = subtotal + DELIVERY_FEE;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0" style={{ zIndex: 150 }} onClick={onClose}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
        style={{ zIndex: 151 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ochre" />
            <h2 className="font-bold text-gray-800">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-ochre text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-500">Your cart is empty</p>
              <p className="text-xs text-gray-400">Add products from the shop to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-4 py-2">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="py-4 flex gap-3">
                  {/* Product image */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-ochre/10 flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>
                    <p className="text-sm font-bold text-ochre mt-1">
                      KSh {(product.price * quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-bold text-gray-700 w-5 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            {/* Delivery note */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-acacia/5 border border-acacia/20 rounded-xl px-3 py-2">
              <Truck className="w-3.5 h-3.5 text-acacia shrink-0" />
              <span>We deliver across Kajiado County</span>
            </div>

            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>KSh {DELIVERY_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-3.5 bg-ochre hover:bg-ochre/90 text-white font-bold rounded-2xl transition-colors text-sm"
            >
              Place Order
            </button>
          </div>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          total={total}
          onClose={() => setShowCheckout(false)}
          onCartClose={onClose}
        />
      )}
    </>
  );
}
