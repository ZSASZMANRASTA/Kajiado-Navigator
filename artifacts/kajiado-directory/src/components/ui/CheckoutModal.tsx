"use client";

import { useState, FormEvent } from "react";
import { X, CheckCircle, User, Phone } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useStore } from "@/lib/products-store";

const DELIVERY_FEE = 200;

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onCartClose: () => void;
}

export default function CheckoutModal({ total, onClose, onCartClose }: CheckoutModalProps) {
  const { items, subtotal, clear } = useCart();
  const { addOrder } = useStore();
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = () => {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!phone.trim()) e.phone = "Please enter your phone number";
    else if (!/^[0-9+\s-]{9,14}$/.test(phone.trim())) e.phone = "Enter a valid phone number";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const id = addOrder({
      name: name.trim(),
      phone: phone.trim(),
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      total,
    });
    setOrderId(id);
    setDone(true);
    setLoading(false);
    clear();
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex: 300 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {!done ? (
          <>
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">Confirm Order</h2>
                <p className="text-xs text-gray-400 mt-0.5">KSh {total.toLocaleString()} · {items.length} item{items.length !== 1 ? "s" : ""} + delivery</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
              {/* Order summary - compact */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-xs text-gray-600">
                    <span>{product.name} ×{quantity}</span>
                    <span className="font-semibold">KSh {(product.price * quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs text-gray-400 pt-1 border-t border-gray-200">
                  <span>Delivery</span><span>KSh {DELIVERY_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-0.5">
                  <span>Total</span><span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5" /> Your Name
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Kamau" autoFocus
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 text-gray-800 ${errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30 focus:border-acacia"}`} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 text-gray-800 ${errors.phone ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30 focus:border-acacia"}`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-ochre hover:bg-ochre/90 disabled:opacity-60 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : "Place Order — KSh " + total.toLocaleString()}
              </button>
              <p className="text-[10px] text-gray-400 text-center">We'll call you to arrange delivery.</p>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-acacia/10 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-acacia" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 mb-1">Order Placed!</h2>
              <p className="text-sm text-gray-500">Thanks, <strong>{name}</strong>. We'll call <strong>{phone}</strong> shortly.</p>
            </div>
            <div className="bg-acacia/5 border border-acacia/20 rounded-xl px-6 py-3 w-full">
              <p className="text-xs text-gray-500 mb-0.5">Reference</p>
              <p className="font-extrabold text-acacia text-lg tracking-widest">{orderId}</p>
            </div>
            <button onClick={() => { onClose(); onCartClose(); }}
              className="w-full py-3 bg-gray-800 text-white font-bold rounded-2xl text-sm hover:bg-gray-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
