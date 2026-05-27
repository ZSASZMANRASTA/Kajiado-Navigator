"use client";

import { useState, useRef, useCallback } from "react";
import {
  Lock, Plus, Pencil, Trash2, X, Check, Package,
  ClipboardList, ChevronDown, AlertCircle, Upload, Link2, XCircle,
  Megaphone, ArrowUp, ArrowDown, ToggleLeft, ToggleRight
} from "lucide-react";
import { useStore, Order, AdSlide, BG_THEMES } from "@/lib/products-store";
import { Product } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/data";

const ADMIN_PASSWORD = "kajiado2025";

const BLANK_PRODUCT: Omit<Product, "id"> = {
  name: "", description: "", price: 0, unit: "",
  category: "Dry Goods", image_url: "", in_stock: true, badge: "",
};

const BLANK_SLIDE: Omit<AdSlide, "id"> = {
  label: "", headline: "", sub: "", bg: "green",
  emoji: "📢", cta: "Learn More", active: true, advertiser: "", link: "",
};

/* ─── Image resize helper ─────────────────────────────────────────────── */
function resizeToDataURL(file: File, maxPx = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas ctx"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── Product form ────────────────────────────────────────────────────── */
function ProductForm({ initial, onSave, onCancel }: {
  initial: Omit<Product, "id"> & { id?: string };
  onSave: (p: Omit<Product, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const [imgMode, setImgMode] = useState<"upload" | "url">(initial.image_url?.startsWith("http") ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeToDataURL(file);
      setForm((f) => ({ ...f, image_url: dataUrl }));
    } catch { alert("Could not process image."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }, []);

  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.price || form.price <= 0) e.price = "Enter a valid price";
    if (!form.unit.trim()) e.unit = "Required";
    setErr(e);
    return !Object.keys(e).length;
  };

  const cats = PRODUCT_CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Product" : "Add New Product"}</h3>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Name</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Unga (Maize Flour) 2kg"
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
        {err.name && <p className="text-xs text-red-500 mt-0.5">{err.name}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief product description…" rows={2}
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 resize-none ${err.description ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
        {err.description && <p className="text-xs text-red-500 mt-0.5">{err.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price (KSh)</label>
          <input type="number" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} placeholder="0"
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.price ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
          {err.price && <p className="text-xs text-red-500 mt-0.5">{err.price}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Unit</label>
          <input value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="e.g. 2 kg bag"
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.unit ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
          {err.unit && <p className="text-xs text-red-500 mt-0.5">{err.unit}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800 bg-white">
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
          <button onClick={() => set("in_stock", !form.in_stock)} type="button"
            className={`mt-1 w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-xl transition-all ${form.in_stock ? "bg-acacia/10 border-acacia/30 text-acacia" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
            <div className={`w-3 h-3 rounded-full ${form.in_stock ? "bg-acacia" : "bg-gray-400"}`} />
            {form.in_stock ? "In Stock" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Image */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image <span className="font-normal normal-case text-gray-400">(optional)</span></label>
          <div className="flex gap-1">
            <button type="button" onClick={() => setImgMode("upload")}
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${imgMode === "upload" ? "bg-acacia/10 text-acacia border-acacia/30" : "bg-white text-gray-400 border-gray-200"}`}>
              <Upload className="w-2.5 h-2.5" /> Upload
            </button>
            <button type="button" onClick={() => setImgMode("url")}
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${imgMode === "url" ? "bg-acacia/10 text-acacia border-acacia/30" : "bg-white text-gray-400 border-gray-200"}`}>
              <Link2 className="w-2.5 h-2.5" /> URL
            </button>
          </div>
        </div>
        {imgMode === "upload" ? (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {form.image_url && !form.image_url.startsWith("http") ? (
              <div className="relative">
                <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => { set("image_url", ""); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-gray-500" />
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} className="mt-1.5 w-full text-xs text-acacia font-semibold py-1 text-center hover:underline">Change photo</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-acacia/40 rounded-xl py-5 transition-colors disabled:opacity-60">
                {uploading ? <span className="w-5 h-5 border-2 border-acacia border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5 text-gray-300" />}
                <span className="text-xs text-gray-400">{uploading ? "Processing…" : "Tap to choose photo from device"}</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <input value={form.image_url?.startsWith("http") ? (form.image_url ?? "") : ""} onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://images.unsplash.com/…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
            {form.image_url?.startsWith("http") && (
              <img src={form.image_url} alt="" className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-200" onError={(e) => (e.currentTarget.style.display = "none")} />
            )}
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Badge <span className="font-normal normal-case text-gray-400">(optional)</span></label>
        <input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="Best Seller / Wholesale Price / New"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => { if (validate()) onSave(form); }}
          className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 transition-colors flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {form.id ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );
}

/* ─── Ad Slide form ───────────────────────────────────────────────────── */
function SlideForm({ initial, onSave, onCancel }: {
  initial: Omit<AdSlide, "id"> & { id?: string };
  onSave: (s: Omit<AdSlide, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.headline.trim()) e.headline = "Required";
    if (!form.advertiser.trim()) e.advertiser = "Required";
    setErr(e);
    return !Object.keys(e).length;
  };

  const preview = BG_THEMES[form.bg] ?? BG_THEMES["dark"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Ad Slide" : "New Ad Slide"}</h3>

      {/* Live mini-preview */}
      <div className={`w-full h-20 rounded-xl bg-gradient-to-br ${preview.gradient} relative overflow-hidden flex items-end p-3`}>
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:12px_12px]" />
        <div className="relative z-10 flex-1 min-w-0">
          <p className="text-white font-extrabold text-sm truncate leading-tight">{form.headline || "Headline preview"}</p>
          <p className="text-white/60 text-[10px] truncate">{form.sub || "Subtitle preview"}</p>
        </div>
        <span className="text-2xl ml-2 relative z-10">{form.emoji}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Advertiser Name</label>
          <input value={form.advertiser} onChange={(e) => set("advertiser", e.target.value)} placeholder="e.g. Jua Kali Hardware"
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.advertiser ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
          {err.advertiser && <p className="text-xs text-red-500 mt-0.5">{err.advertiser}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Label Pill</label>
          <input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="e.g. Special Offer"
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Headline</label>
        <input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Main ad headline"
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.headline ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
        {err.headline && <p className="text-xs text-red-500 mt-0.5">{err.headline}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Subtitle</label>
        <textarea value={form.sub} onChange={(e) => set("sub", e.target.value)} placeholder="Supporting text for the ad" rows={2}
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">CTA Button Text</label>
          <input value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="e.g. Shop Now"
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Emoji</label>
          <input value={form.emoji} onChange={(e) => set("emoji", e.target.value)} placeholder="📢"
            className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
        </div>
      </div>

      {/* Background theme selector */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Background Theme</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(BG_THEMES).map(([key, t]) => (
            <button key={key} type="button" onClick={() => set("bg", key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${form.bg === key ? "border-gray-400 shadow-sm ring-2 ring-offset-1" : "border-gray-200 hover:border-gray-300"}`}
              style={{ ringColor: t.swatch }}>
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.swatch }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Link URL */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Click-through URL <span className="font-normal normal-case text-gray-400">(optional)</span></label>
        <input value={form.link ?? ""} onChange={(e) => set("link", e.target.value)} placeholder="https://wa.me/254…"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
      </div>

      {/* Active toggle */}
      <button type="button" onClick={() => set("active", !form.active)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.active ? "bg-acacia/10 border-acacia/30 text-acacia" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
        {form.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
        {form.active ? "Active — visible in carousel" : "Inactive — hidden from carousel"}
      </button>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => { if (validate()) onSave(form); }}
          className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 transition-colors flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {form.id ? "Save Changes" : "Create Slide"}
        </button>
      </div>
    </div>
  );
}

/* ─── Order card ──────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<Order["status"], string> = {
  pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-acacia/10 text-acacia border-acacia/30",
  delivered: "bg-gray-100 text-gray-500 border-gray-200",
};

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, s: Order["status"]) => void }) {
  const [open, setOpen] = useState(false);
  const date = new Date(order.timestamp).toLocaleDateString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <ClipboardList className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{order.name}</p>
            <p className="text-xs text-gray-400">{order.id} · {date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>{order.status}</span>
          <span className="text-sm font-bold text-gray-700">KSh {order.total.toLocaleString()}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          <div className="space-y-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600">
                <span>{item.productName} × {item.quantity}</span>
                <span className="font-semibold">KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <p className="text-xs text-gray-500">Phone: <span className="font-semibold text-gray-700">{order.phone}</span></p>
            <div className="flex gap-1.5">
              {(["pending", "confirmed", "delivered"] as Order["status"][]).map((s) => (
                <button key={s} onClick={() => onStatusChange(order.id, s)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${order.status === s ? STATUS_COLORS[s] : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main AdminSection ───────────────────────────────────────────────── */
interface AdminSectionProps { onClose: () => void }

export default function AdminSection({ onClose }: AdminSectionProps) {
  const [unlocked, setUnlocked] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("kajiado_admin") === "1");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"products" | "orders" | "ads">("products");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<string | null>(null);

  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editSlide, setEditSlide] = useState<AdSlide | null>(null);
  const [deleteConfirmSlide, setDeleteConfirmSlide] = useState<string | null>(null);

  const { products, orders, slides, addProduct, updateProduct, deleteProduct, updateOrderStatus, addSlide, updateSlide, deleteSlide, reorderSlides } = useStore();

  const handleUnlock = () => {
    if (pwInput === ADMIN_PASSWORD) { sessionStorage.setItem("kajiado_admin", "1"); setUnlocked(true); }
    else { setPwError(true); setTimeout(() => setPwError(false), 1500); }
  };

  const handleSaveProduct = (p: Omit<Product, "id"> & { id?: string }) => {
    if (p.id) updateProduct(p as Product); else addProduct(p);
    setShowProductForm(false); setEditProduct(null);
  };

  const handleSaveSlide = (s: Omit<AdSlide, "id"> & { id?: string }) => {
    if (s.id) updateSlide(s as AdSlide); else addSlide(s);
    setShowSlideForm(false); setEditSlide(null);
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const arr = [...slides];
    const next = idx + dir;
    if (next < 0 || next >= arr.length) return;
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    reorderSlides(arr);
  };

  if (!unlocked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200 }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
          <h2 className="font-extrabold text-gray-800 text-lg mb-1">Admin Panel</h2>
          <p className="text-sm text-gray-400 mb-5">Enter your admin password to continue.</p>
          <input type="password" value={pwInput} onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()} placeholder="Admin password" autoFocus
            className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 text-center mb-3 transition-all ${pwError ? "border-red-400 ring-2 ring-red-200 animate-pulse" : "border-gray-200 focus:ring-acacia/30"}`} />
          {pwError && <p className="flex items-center justify-center gap-1 text-xs text-red-500 mb-2"><AlertCircle className="w-3.5 h-3.5" /> Incorrect password</p>}
          <button onClick={handleUnlock} className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors">Unlock</button>
          <button onClick={onClose} className="mt-3 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 200 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:mx-auto sm:my-8 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-extrabold text-gray-800">Admin Panel</h2>
            <p className="text-xs text-gray-400">Manage shop, orders and advertising</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 shrink-0 overflow-x-auto">
          {([
            { id: "products", icon: Package,     label: "Products",    badge: null },
            { id: "orders",   icon: ClipboardList, label: "Orders",   badge: orders.filter((o) => o.status === "pending").length || null },
            { id: "ads",      icon: Megaphone,   label: "Carousel Ads", badge: null },
          ] as const).map(({ id, icon: Icon, label, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 py-3 px-1 mr-5 text-sm font-semibold border-b-2 transition-all shrink-0 ${tab === id ? "border-acacia text-acacia" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              <Icon className="w-4 h-4" /> {label}
              {badge ? <span className="w-4 h-4 bg-ochre text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">{badge}</span> : null}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          {/* ── Products tab ── */}
          {tab === "products" && (
            <>
              {!showProductForm && !editProduct && (
                <button onClick={() => setShowProductForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-acacia/30 text-acacia text-sm font-semibold rounded-2xl hover:bg-acacia/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              )}
              {showProductForm && <ProductForm initial={BLANK_PRODUCT} onSave={handleSaveProduct} onCancel={() => setShowProductForm(false)} />}
              {editProduct && <ProductForm initial={editProduct} onSave={handleSaveProduct} onCancel={() => setEditProduct(null)} />}
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {deleteConfirmProduct === product.id ? (
                    <div className="p-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-700 font-semibold">Delete "{product.name}"?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirmProduct(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                        <button onClick={() => { deleteProduct(product.id); setDeleteConfirmProduct(null); }} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-gray-400" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">KSh {product.price.toLocaleString()} · {product.unit}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${product.in_stock ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-500"}`}>{product.in_stock ? "In stock" : "Out of stock"}</span>
                          <span className="text-[9px] text-gray-400">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => { setEditProduct(product); setShowProductForm(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                        <button onClick={() => setDeleteConfirmProduct(product.id)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-gray-600" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ── Orders tab ── */}
          {tab === "orders" && (
            orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ClipboardList className="w-8 h-8 text-gray-300 mb-3" />
                <p className="font-semibold text-gray-500">No orders yet</p>
                <p className="text-xs text-gray-400 mt-1">Orders placed through the shop will appear here.</p>
              </div>
            ) : orders.map((order) => <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />)
          )}

          {/* ── Ads tab ── */}
          {tab === "ads" && (
            <>
              <div className="bg-ochre/8 border border-ochre/20 rounded-2xl px-4 py-3 mb-1">
                <p className="text-xs font-bold text-ochre mb-0.5">Paid Advertising Carousel</p>
                <p className="text-[11px] text-gray-500">Slides run on the main Shop page. Charge advertisers, add their slide here, toggle active when paid. Drag handles let you reorder.</p>
              </div>

              {!showSlideForm && !editSlide && (
                <button onClick={() => setShowSlideForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-ochre/30 text-ochre text-sm font-semibold rounded-2xl hover:bg-ochre/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Ad Slide
                </button>
              )}
              {showSlideForm && <SlideForm initial={BLANK_SLIDE} onSave={handleSaveSlide} onCancel={() => setShowSlideForm(false)} />}
              {editSlide && <SlideForm initial={editSlide} onSave={handleSaveSlide} onCancel={() => setEditSlide(null)} />}

              {slides.map((slide, idx) => {
                const theme = BG_THEMES[slide.bg] ?? BG_THEMES["dark"];
                return (
                  <div key={slide.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {deleteConfirmSlide === slide.id ? (
                      <div className="p-4 flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-700 font-semibold">Delete this ad slide?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteConfirmSlide(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                          <button onClick={() => { deleteSlide(slide.id); setDeleteConfirmSlide(null); }} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3">
                        {/* Colour swatch */}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-lg shrink-0`}>
                          {slide.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-sm font-bold text-gray-800 truncate">{slide.headline}</p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${slide.active ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-500"}`}>
                              {slide.active ? "Live" : "Hidden"}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate">{slide.advertiser} · {theme.label}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Reorder */}
                          <div className="flex flex-col gap-0.5">
                            <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} className="w-6 h-5 rounded flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"><ArrowUp className="w-3 h-3 text-gray-600" /></button>
                            <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} className="w-6 h-5 rounded flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"><ArrowDown className="w-3 h-3 text-gray-600" /></button>
                          </div>
                          {/* Toggle active */}
                          <button onClick={() => updateSlide({ ...slide, active: !slide.active })}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${slide.active ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-400"}`}>
                            {slide.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditSlide(slide); setShowSlideForm(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                          <button onClick={() => setDeleteConfirmSlide(slide.id)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-gray-600" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
