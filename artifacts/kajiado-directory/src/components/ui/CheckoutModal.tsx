"use client";

import { useState, FormEvent } from "react";
import { X, CheckCircle, Truck, User, Phone, MapPin, FileText } from "lucide-react";
import { useCart } from "@/lib/cart";
import { TOWNS } from "@/lib/data";

const DELIVERY_FEE = 200;

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onCartClose: () => void;
}

type Step = "form" | "confirm";

function generateOrderId() {
  return "KJD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CheckoutModal({ total, onClose, onCartClose }: CheckoutModalProps) {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>("form");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    town: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^[0-9+\s-]{9,14}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (!form.town) e.town = "Select a delivery area";
    if (!form.address.trim()) e.address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const id = generateOrderId();
    setOrderId(id);
    setStep("confirm");
    setLoading(false);
    clear();
  };

  const handleDone = () => {
    onClose();
    onCartClose();
  };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ zIndex: 300 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {step === "form" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Place Your Order</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in your delivery details</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="px-5 py-4 space-y-4">
                {/* Order summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Order Summary</p>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-xs text-gray-600">
                      <span>{product.name} × {quantity}</span>
                      <span className="font-semibold">KSh {(product.price * quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-1.5 mt-1.5 flex justify-between text-xs text-gray-500">
                    <span>Delivery</span>
                    <span>KSh {DELIVERY_FEE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900">
                    <span>Total</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Kamau"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 text-gray-800 ${
                      errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30 focus:border-acacia"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <input
                    type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0712 345 678"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 text-gray-800 ${
                      errors.phone ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30 focus:border-acacia"
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                {/* Town */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Area
                  </label>
                  <select
                    value={form.town}
                    onChange={(e) => setForm({ ...form, town: e.target.value })}
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 text-gray-800 bg-white ${
                      errors.town ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30 focus:border-acacia"
                    }`}
                  >
                    <option value="">Select town / area…</option>
                    {TOWNS.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    <option value="Other">Other (mention in notes)</option>
                  </select>
                  {errors.town && <p className="text-xs text-red-500 mt-1">{errors.town}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Truck className="w-3.5 h-3.5" /> Street / Estate / Landmark
                  </label>
                  <input
                    type="text" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. Pipeline Road, near Equity Bank"
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 text-gray-800 ${
                      errors.address ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30 focus:border-acacia"
                    }`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5" /> Order Notes <span className="font-normal normal-case text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any special instructions?"
                    rows={2}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-acacia/30 focus:border-acacia text-gray-800 resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="px-5 pb-5 pt-2 shrink-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-ochre hover:bg-ochre/90 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Confirm Order · KSh " + total.toLocaleString()
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  Our team will call you to confirm delivery before dispatch.
                </p>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation screen */
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-acacia/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-acacia" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 mb-1">Order Received!</h2>
              <p className="text-sm text-gray-500">
                Thank you, <strong>{form.name}</strong>. We'll call <strong>{form.phone}</strong> to confirm your delivery.
              </p>
            </div>
            <div className="bg-acacia/5 border border-acacia/20 rounded-xl px-6 py-4 w-full">
              <p className="text-xs text-gray-500 mb-1">Order Reference</p>
              <p className="font-extrabold text-acacia text-xl tracking-wider">{orderId}</p>
              <p className="text-xs text-gray-400 mt-1">Delivery to: {form.town}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 w-full text-left">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Delivery Info</p>
              <p className="text-xs text-gray-600">{form.address}</p>
              {form.notes && <p className="text-xs text-gray-400 mt-1">Note: {form.notes}</p>}
            </div>
            <button
              onClick={handleDone}
              className="w-full py-3 bg-gray-800 text-white font-bold rounded-2xl text-sm hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
