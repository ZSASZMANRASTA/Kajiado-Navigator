"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { Town } from "@/lib/types";
import { ALL_CATEGORIES } from "@/lib/data";
import { submitShop } from "@/lib/supabase";

interface SubmitMerchantModalProps {
  towns: Town[];
  defaultTownId?: string;
  onClose: () => void;
}

export default function SubmitMerchantModal({
  towns,
  defaultTownId,
  onClose,
}: SubmitMerchantModalProps) {
  const [form, setForm] = useState({
    town_id: defaultTownId ?? towns[0]?.id ?? "",
    name: "",
    description: "",
    category: ALL_CATEGORIES[0],
    phone: "",
    whatsapp: "",
    hours: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await submitShop({
      town_id: form.town_id,
      name: form.name,
      description: form.description,
      category: form.category,
      phone: form.phone || undefined,
      whatsapp: form.whatsapp || undefined,
      hours: form.hours || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ zIndex: 200 }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-savanna w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-800 text-base">List Your Business</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Add your merchant to the Kajiado Directory</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-acacia/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-acacia" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-1">Listing Submitted!</h3>
              <p className="text-sm text-gray-500">
                Your business has been submitted for review. It will appear in the directory once approved.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-acacia text-white text-sm font-semibold rounded-xl hover:bg-acacia/90 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Town */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Town *</label>
                <select
                  value={form.town_id}
                  onChange={(e) => set("town_id", e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 text-gray-800"
                >
                  {towns.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Business name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Business Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  placeholder="e.g. Savanna Hardware"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 text-gray-800"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  required
                  rows={3}
                  placeholder="Tell customers what you offer…"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800 resize-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Opening Hours</label>
                <input
                  type="text"
                  value={form.hours}
                  onChange={(e) => set("hours", e.target.value)}
                  placeholder="e.g. Mon–Sat 8am–6pm"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-acacia focus:ring-2 focus:ring-acacia/20 placeholder:text-gray-300 text-gray-800"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 shrink-0">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-ochre text-white text-sm font-semibold rounded-xl hover:bg-ochre/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting…" : "Submit Listing"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
