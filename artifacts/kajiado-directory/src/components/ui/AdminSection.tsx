"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  Lock, Plus, Pencil, Trash2, X, Check, Package, ClipboardList,
  ChevronDown, AlertCircle, Upload, Link2, XCircle, Megaphone,
  ArrowUp, ArrowDown, ToggleLeft, ToggleRight, Store, Briefcase,
  BarChart3, Settings2, Download, RefreshCw, ShieldAlert,
  TrendingUp, Users, ShoppingBag, MapPin, Phone,
} from "lucide-react";
import { useStore, Order, AdSlide, BG_THEMES } from "@/lib/products-store";
import { Product, Shop, Job } from "@/lib/types";
import { PRODUCT_CATEGORIES, ALL_CATEGORIES, TOWNS, JOB_CATEGORIES } from "@/lib/data";

/* ─── Password helpers ───────────────────────────────────────────────── */
const ADMIN_PW_KEY = "kajiado_admin_pw";
function getAdminPassword(): string {
  if (typeof window === "undefined") return "kajiado2025";
  return localStorage.getItem(ADMIN_PW_KEY) ?? "kajiado2025";
}
function setAdminPassword(pw: string): void {
  if (typeof window !== "undefined") localStorage.setItem(ADMIN_PW_KEY, pw);
}

/* ─── Image resize ───────────────────────────────────────────────────── */
function resizeToDataURL(file: File, maxPx = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
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

/* ─── Shared helpers ─────────────────────────────────────────────────── */
function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {label}{hint && <span className="font-normal normal-case text-gray-400 ml-1">{hint}</span>}
      </label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const INPUT = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800 bg-white";
const INPUT_ERR = "w-full px-3 py-2 text-sm border border-red-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 text-gray-800 bg-white";

/* ─── Status row ─────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<Order["status"], string> = {
  pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-acacia/10 text-acacia border-acacia/30",
  delivered: "bg-gray-100 text-gray-500 border-gray-200",
};

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT FORM
═══════════════════════════════════════════════════════════════════════ */
const BLANK_PRODUCT: Omit<Product, "id"> = { name: "", description: "", price: 0, unit: "", category: "Dry Goods", image_url: "", in_stock: true, badge: "" };

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
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { setForm(f => ({ ...f, image_url: "" })); const d = await resizeToDataURL(file); setForm(f => ({ ...f, image_url: d })); }
    catch { alert("Could not process image."); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.price || form.price <= 0) e.price = "Enter valid price";
    if (!form.unit.trim()) e.unit = "Required";
    setErr(e); return !Object.keys(e).length;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Product" : "Add Product"}</h3>
      <Field label="Name" error={err.name}><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Unga 2kg" className={err.name ? INPUT_ERR : INPUT} /></Field>
      <Field label="Description" error={err.description}><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} className={`${err.description ? INPUT_ERR : INPUT} resize-none`} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (KSh)" error={err.price}><input type="number" value={form.price || ""} onChange={e => set("price", Number(e.target.value))} className={err.price ? INPUT_ERR : INPUT} /></Field>
        <Field label="Unit" error={err.unit}><input value={form.unit} onChange={e => set("unit", e.target.value)} placeholder="2 kg bag" className={err.unit ? INPUT_ERR : INPUT} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <select value={form.category} onChange={e => set("category", e.target.value)} className={INPUT}>
            {PRODUCT_CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <button type="button" onClick={() => set("in_stock", !form.in_stock)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-xl transition-all ${form.in_stock ? "bg-acacia/10 border-acacia/30 text-acacia" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
            <div className={`w-3 h-3 rounded-full ${form.in_stock ? "bg-acacia" : "bg-gray-400"}`} />
            {form.in_stock ? "In Stock" : "Out of Stock"}
          </button>
        </Field>
      </div>
      <Field label="Image" hint="(optional)">
        <div className="flex gap-1 mb-1.5">
          {(["upload", "url"] as const).map(m => (
            <button key={m} type="button" onClick={() => setImgMode(m)}
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${imgMode === m ? "bg-acacia/10 text-acacia border-acacia/30" : "bg-white text-gray-400 border-gray-200"}`}>
              {m === "upload" ? <Upload className="w-2.5 h-2.5" /> : <Link2 className="w-2.5 h-2.5" />} {m === "upload" ? "Upload" : "URL"}
            </button>
          ))}
        </div>
        {imgMode === "upload" ? (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {form.image_url && !form.image_url.startsWith("http") ? (
              <div className="relative">
                <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => set("image_url", "")} className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center"><XCircle className="w-4 h-4 text-gray-500" /></button>
                <button type="button" onClick={() => fileRef.current?.click()} className="mt-1 w-full text-xs text-acacia font-semibold py-1 text-center hover:underline">Change photo</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-acacia/40 rounded-xl py-5 transition-colors disabled:opacity-60">
                {uploading ? <span className="w-5 h-5 border-2 border-acacia border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5 text-gray-300" />}
                <span className="text-xs text-gray-400">{uploading ? "Processing…" : "Tap to upload"}</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <input value={form.image_url?.startsWith("http") ? (form.image_url ?? "") : ""} onChange={e => set("image_url", e.target.value)} placeholder="https://…" className={INPUT} />
            {form.image_url?.startsWith("http") && <img src={form.image_url} alt="" className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-200" onError={e => (e.currentTarget.style.display = "none")} />}
          </div>
        )}
      </Field>
      <Field label="Badge" hint="(optional)"><input value={form.badge ?? ""} onChange={e => set("badge", e.target.value)} placeholder="Best Seller / New" className={INPUT} /></Field>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {form.id ? "Save" : "Add Product"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ORDER CARD
═══════════════════════════════════════════════════════════════════════ */
function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, s: Order["status"]) => void }) {
  const [open, setOpen] = useState(false);
  const date = new Date(order.timestamp).toLocaleDateString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><ClipboardList className="w-4 h-4 text-gray-400" /></div>
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
          <div className="space-y-1">{order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs text-gray-600">
              <span>{item.productName} × {item.quantity}</span>
              <span className="font-semibold">KSh {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}</div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <p className="text-xs text-gray-500">Phone: <span className="font-semibold text-gray-700">{order.phone}</span></p>
            <div className="flex gap-1.5">
              {(["pending", "confirmed", "delivered"] as Order["status"][]).map(s => (
                <button key={s} onClick={() => onStatusChange(order.id, s)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${order.status === s ? STATUS_COLORS[s] : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MERCHANT FORM
═══════════════════════════════════════════════════════════════════════ */
const BLANK_SHOP: Omit<Shop, "id"> = { name: "", town_id: "kitengela", description: "", category: "Grocery", is_premium: false, image_url: null, tagline: "", phone: "", whatsapp: "", hours: "", color: "#C36F48" };

function MerchantForm({ initial, onSave, onCancel }: {
  initial: Omit<Shop, "id"> & { id?: string };
  onSave: (s: Omit<Shop, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErr(e); return !Object.keys(e).length;
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Merchant" : "Add Merchant"}</h3>
      <Field label="Business Name" error={err.name}><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Savanna Supermarket" className={err.name ? INPUT_ERR : INPUT} /></Field>
      <Field label="Tagline" hint="(optional)"><input value={form.tagline ?? ""} onChange={e => set("tagline", e.target.value)} placeholder="Short catchy description" className={INPUT} /></Field>
      <Field label="Description" error={err.description}><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className={`${err.description ? INPUT_ERR : INPUT} resize-none`} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Town">
          <select value={form.town_id} onChange={e => set("town_id", e.target.value)} className={INPUT}>
            {TOWNS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={e => set("category", e.target.value)} className={INPUT}>
            {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone" hint="(optional)"><input value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+254 7xx xxx xxx" className={INPUT} /></Field>
        <Field label="WhatsApp" hint="(optional)"><input value={form.whatsapp ?? ""} onChange={e => set("whatsapp", e.target.value)} placeholder="+254 7xx xxx xxx" className={INPUT} /></Field>
      </div>
      <Field label="Opening Hours" hint="(optional)"><input value={form.hours ?? ""} onChange={e => set("hours", e.target.value)} placeholder="Mon–Sat 8am–6pm" className={INPUT} /></Field>
      <Field label="Image URL" hint="(optional)"><input value={form.image_url ?? ""} onChange={e => set("image_url", e.target.value || null)} placeholder="https://images.unsplash.com/…" className={INPUT} /></Field>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Field label="Brand Colour"><input type="color" value={form.color ?? "#C36F48"} onChange={e => set("color", e.target.value)} className="w-full h-9 rounded-xl border border-gray-200 cursor-pointer px-1 py-1" /></Field>
        </div>
        <div className="flex-1">
          <Field label="Premium Listing">
            <button type="button" onClick={() => set("is_premium", !form.is_premium)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-xl transition-all ${form.is_premium ? "bg-ochre/10 border-ochre/30 text-ochre" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
              {form.is_premium ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />} {form.is_premium ? "⭐ Premium" : "Standard"}
            </button>
          </Field>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {form.id ? "Save" : "Add Merchant"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   JOB FORM
═══════════════════════════════════════════════════════════════════════ */
const BLANK_JOB: Omit<Job, "id"> = { title: "", company: "", town: "Kitengela", type: "Full-time", salary: "", description: "", requirements: [], posted_days_ago: 0, whatsapp: "", category: "Retail" };

function JobForm({ initial, onSave, onCancel }: {
  initial: Omit<Job, "id"> & { id?: string };
  onSave: (j: Omit<Job, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [reqText, setReqText] = useState(initial.requirements.join("\n"));
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.whatsapp.trim()) e.whatsapp = "Required";
    setErr(e); return !Object.keys(e).length;
  };
  const handleSave = () => {
    if (!validate()) return;
    const requirements = reqText.split("\n").map(r => r.trim()).filter(Boolean);
    onSave({ ...form, requirements, posted_days_ago: 0 });
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Job" : "Post a Job"}</h3>
      <Field label="Job Title" error={err.title}><input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Retail Sales Associate" className={err.title ? INPUT_ERR : INPUT} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Company" error={err.company}><input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Business name" className={err.company ? INPUT_ERR : INPUT} /></Field>
        <Field label="Town"><input value={form.town} onChange={e => set("town", e.target.value)} placeholder="Kitengela" className={INPUT} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <select value={form.type} onChange={e => set("type", e.target.value as Job["type"])} className={INPUT}>
            {["Full-time", "Part-time", "Contract", "Casual"].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={e => set("category", e.target.value)} className={INPUT}>
            {JOB_CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Salary" hint="(optional)"><input value={form.salary ?? ""} onChange={e => set("salary", e.target.value)} placeholder="e.g. KSh 20,000–30,000 /month" className={INPUT} /></Field>
      <Field label="Job Description" error={err.description}><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className={`${err.description ? INPUT_ERR : INPUT} resize-none`} /></Field>
      <Field label="Requirements" hint="(one per line)"><textarea value={reqText} onChange={e => setReqText(e.target.value)} rows={3} placeholder={"KCSE Certificate\nHonest and hardworking"} className={`${INPUT} resize-none`} /></Field>
      <Field label="WhatsApp to Apply" error={err.whatsapp}><input value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="+254 7xx xxx xxx" className={err.whatsapp ? INPUT_ERR : INPUT} /></Field>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {form.id ? "Save" : "Post Job"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   AD SLIDE FORM
═══════════════════════════════════════════════════════════════════════ */
const BLANK_SLIDE: Omit<AdSlide, "id"> = { label: "", headline: "", sub: "", bg: "green", emoji: "📢", cta: "Learn More", active: true, advertiser: "", link: "" };

function SlideForm({ initial, onSave, onCancel }: {
  initial: Omit<AdSlide, "id"> & { id?: string };
  onSave: (s: Omit<AdSlide, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.headline.trim()) e.headline = "Required";
    if (!form.advertiser.trim()) e.advertiser = "Required";
    setErr(e); return !Object.keys(e).length;
  };
  const preview = BG_THEMES[form.bg] ?? BG_THEMES["dark"];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Ad Slide" : "New Ad Slide"}</h3>
      <div className={`w-full h-20 rounded-xl bg-gradient-to-br ${preview.gradient} relative overflow-hidden flex items-end p-3`}>
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:12px_12px]" />
        <div className="relative z-10 flex-1 min-w-0">
          <p className="text-white font-extrabold text-sm truncate">{form.headline || "Headline preview"}</p>
          <p className="text-white/60 text-[10px] truncate">{form.sub || "Subtitle preview"}</p>
        </div>
        <span className="text-2xl ml-2 relative z-10">{form.emoji}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Advertiser" error={err.advertiser}><input value={form.advertiser} onChange={e => set("advertiser", e.target.value)} placeholder="Business name" className={err.advertiser ? INPUT_ERR : INPUT} /></Field>
        <Field label="Label Pill"><input value={form.label} onChange={e => set("label", e.target.value)} placeholder="e.g. Special Offer" className={INPUT} /></Field>
      </div>
      <Field label="Headline" error={err.headline}><input value={form.headline} onChange={e => set("headline", e.target.value)} placeholder="Main ad headline" className={err.headline ? INPUT_ERR : INPUT} /></Field>
      <Field label="Subtitle"><textarea value={form.sub} onChange={e => set("sub", e.target.value)} rows={2} className={`${INPUT} resize-none`} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA Text"><input value={form.cta} onChange={e => set("cta", e.target.value)} placeholder="Shop Now" className={INPUT} /></Field>
        <Field label="Emoji"><input value={form.emoji} onChange={e => set("emoji", e.target.value)} className={INPUT} /></Field>
      </div>
      <Field label="Background Theme">
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(BG_THEMES).map(([key, t]) => (
            <button key={key} type="button" onClick={() => set("bg", key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${form.bg === key ? "border-gray-400 shadow-sm scale-105" : "border-gray-200 hover:border-gray-300"}`}>
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.swatch }} />{t.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Click-through URL" hint="(optional)"><input value={form.link ?? ""} onChange={e => set("link", e.target.value)} placeholder="https://wa.me/254…" className={INPUT} /></Field>
      <button type="button" onClick={() => set("active", !form.active)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.active ? "bg-acacia/10 border-acacia/30 text-acacia" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
        {form.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
        {form.active ? "Active — visible in carousel" : "Inactive — hidden from carousel"}
      </button>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> {form.id ? "Save" : "Create Slide"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════ */
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl p-4 ${color}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-black font-mono">{value}</p>
      {sub && <p className="text-[11px] opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN AdminSection
═══════════════════════════════════════════════════════════════════════ */
type AdminTab = "products" | "orders" | "merchants" | "jobs" | "ads" | "analytics" | "settings";

interface AdminSectionProps { onClose: () => void }

export default function AdminSection({ onClose }: AdminSectionProps) {
  const [unlocked, setUnlocked] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("kajiado_admin") === "1");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<AdminTab>("products");

  /* product state */
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [delProduct, setDelProduct] = useState<string | null>(null);

  /* merchant state */
  const [showMerchantForm, setShowMerchantForm] = useState(false);
  const [editMerchant, setEditMerchant] = useState<Shop | null>(null);
  const [delMerchant, setDelMerchant] = useState<string | null>(null);

  /* job state */
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [delJob, setDelJob] = useState<string | null>(null);

  /* slide state */
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [editSlide, setEditSlide] = useState<AdSlide | null>(null);
  const [delSlide, setDelSlide] = useState<string | null>(null);

  /* settings state */
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const store = useStore();
  const { products, orders, slides, shops, jobs, addProduct, updateProduct, deleteProduct, updateOrderStatus, addSlide, updateSlide, deleteSlide, reorderSlides, addShop, updateShop, deleteShop, addJob, updateJob, deleteJob, resetToDefaults } = store;

  const handleUnlock = () => {
    if (pwInput === getAdminPassword()) { sessionStorage.setItem("kajiado_admin", "1"); setUnlocked(true); }
    else { setPwError(true); setTimeout(() => setPwError(false), 1500); }
  };

  const handleSaveProduct = (p: Omit<Product, "id"> & { id?: string }) => {
    if (p.id) updateProduct(p as Product); else addProduct(p);
    setShowProductForm(false); setEditProduct(null);
  };
  const handleSaveMerchant = (s: Omit<Shop, "id"> & { id?: string }) => {
    if (s.id) updateShop(s as Shop); else addShop(s);
    setShowMerchantForm(false); setEditMerchant(null);
  };
  const handleSaveJob = (j: Omit<Job, "id"> & { id?: string }) => {
    if (j.id) updateJob(j as Job); else addJob(j);
    setShowJobForm(false); setEditJob(null);
  };
  const handleSaveSlide = (s: Omit<AdSlide, "id"> & { id?: string }) => {
    if (s.id) updateSlide(s as AdSlide); else addSlide(s);
    setShowSlideForm(false); setEditSlide(null);
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const arr = [...slides]; const next = idx + dir;
    if (next < 0 || next >= arr.length) return;
    [arr[idx], arr[next]] = [arr[next], arr[idx]]; reorderSlides(arr);
  };

  /* analytics */
  const analytics = useMemo(() => {
    const delivered  = orders.filter(o => o.status === "delivered");
    const pending    = orders.filter(o => o.status === "pending");
    const confirmed  = orders.filter(o => o.status === "confirmed");
    const revenue    = delivered.reduce((s, o) => s + o.total, 0);
    const allRevenue = orders.reduce((s, o) => s + o.total, 0);
    const productFreq: Record<string, { name: string; count: number }> = {};
    for (const o of orders) for (const item of o.items) {
      productFreq[item.productId] = { name: item.productName, count: (productFreq[item.productId]?.count ?? 0) + item.quantity };
    }
    const topProducts = Object.values(productFreq).sort((a, b) => b.count - a.count).slice(0, 6);
    return { revenue, allRevenue, pending: pending.length, confirmed: confirmed.length, delivered: delivered.length, topProducts };
  }, [orders]);

  /* settings: change password */
  const handlePwChange = () => {
    if (pwOld !== getAdminPassword()) { setPwMsg({ ok: false, text: "Current password is incorrect." }); return; }
    if (pwNew.length < 6) { setPwMsg({ ok: false, text: "New password must be at least 6 characters." }); return; }
    if (pwNew !== pwConfirm) { setPwMsg({ ok: false, text: "New passwords do not match." }); return; }
    setAdminPassword(pwNew); setPwOld(""); setPwNew(""); setPwConfirm("");
    setPwMsg({ ok: true, text: "Password changed successfully." });
    setTimeout(() => setPwMsg(null), 3000);
  };

  /* settings: export JSON */
  const handleExport = () => {
    const data = { products, orders, slides, shops, jobs, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `kajiado-mtaani-export-${Date.now()}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  /* settings: reset */
  const handleReset = () => { resetToDefaults(); setResetConfirm(false); };

  const TABS: { id: AdminTab; icon: React.FC<{ className?: string }>; label: string; badge?: number }[] = [
    { id: "products",  icon: Package,      label: "Products",  badge: products.length },
    { id: "orders",    icon: ClipboardList, label: "Orders",   badge: orders.filter(o => o.status === "pending").length || undefined },
    { id: "merchants", icon: Store,        label: "Merchants", badge: shops.length },
    { id: "jobs",      icon: Briefcase,    label: "Jobs",      badge: jobs.length },
    { id: "ads",       icon: Megaphone,    label: "Ads" },
    { id: "analytics", icon: BarChart3,    label: "Analytics" },
    { id: "settings",  icon: Settings2,    label: "Settings" },
  ];

  /* ── Lock screen ─────────────────────────────────────────────────── */
  if (!unlocked) return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4"><Lock className="w-6 h-6 text-white" /></div>
        <h2 className="font-extrabold text-gray-800 text-lg mb-1">Admin Terminal</h2>
        <p className="text-xs text-gray-400 font-mono mb-5">kajiado-mtaani · restricted access</p>
        <input type="password" value={pwInput} onChange={e => setPwInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleUnlock()} placeholder="Admin password" autoFocus
          className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 text-center mb-3 transition-all font-mono ${pwError ? "border-red-400 ring-2 ring-red-200 animate-pulse" : "border-gray-200 focus:ring-acacia/30"}`} />
        {pwError && <p className="flex items-center justify-center gap-1 text-xs text-red-500 mb-2"><AlertCircle className="w-3.5 h-3.5" /> Incorrect password</p>}
        <button onClick={handleUnlock} className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors">Unlock</button>
        <button onClick={onClose} className="mt-3 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
      </div>
    </div>
  );

  /* ── Main terminal ───────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 200 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-2xl sm:mx-auto sm:my-6 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[92vh]">

        {/* Terminal header */}
        <div className="bg-gray-900 px-5 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <p className="text-white text-xs font-mono font-bold ml-2">kajiado-mtaani/admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
              <span className="text-acacia">●<span className="text-gray-400 ml-1">{products.length} products</span></span>
              <span className="text-ochre">●<span className="text-gray-400 ml-1">{orders.filter(o => o.status === "pending").length} pending</span></span>
              <span className="text-blue-400">●<span className="text-gray-400 ml-1">{shops.length} merchants</span></span>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><X className="w-3.5 h-3.5 text-white" /></button>
          </div>
        </div>

        {/* Tabs — horizontal scroll */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide shrink-0 bg-gray-50/50">
          {TABS.map(({ id, icon: Icon, label, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all shrink-0 ${tab === id ? "border-gray-900 text-gray-900 bg-white" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
              {badge != null && badge > 0 && (
                <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center ${tab === id ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"}`}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* ── PRODUCTS ── */}
          {tab === "products" && (
            <>
              {!showProductForm && !editProduct && (
                <button onClick={() => setShowProductForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-acacia/30 text-acacia text-sm font-semibold rounded-2xl hover:bg-acacia/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              )}
              {showProductForm && <ProductForm initial={BLANK_PRODUCT} onSave={handleSaveProduct} onCancel={() => setShowProductForm(false)} />}
              {editProduct && <ProductForm initial={editProduct} onSave={handleSaveProduct} onCancel={() => setEditProduct(null)} />}
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {delProduct === product.id ? (
                    <div className="p-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-700 font-semibold">Delete "{product.name}"?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDelProduct(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                        <button onClick={() => { deleteProduct(product.id); setDelProduct(null); }} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3">
                      {product.image_url ? <img src={product.image_url} alt={product.name} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100" /> : <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><Package className="w-4 h-4 text-gray-400" /></div>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">KSh {product.price.toLocaleString()} · {product.unit}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${product.in_stock ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-500"}`}>{product.in_stock ? "In stock" : "Out of stock"}</span>
                          <span className="text-[9px] text-gray-400">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => { setEditProduct(product); setShowProductForm(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                        <button onClick={() => setDelProduct(product.id)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ClipboardList className="w-8 h-8 text-gray-300 mb-3" />
                <p className="font-semibold text-gray-500">No orders yet</p>
                <p className="text-xs text-gray-400 mt-1">Orders placed through the shop appear here.</p>
              </div>
            ) : orders.map(order => <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />)
          )}

          {/* ── MERCHANTS ── */}
          {tab === "merchants" && (
            <>
              {!showMerchantForm && !editMerchant && (
                <button onClick={() => setShowMerchantForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-acacia/30 text-acacia text-sm font-semibold rounded-2xl hover:bg-acacia/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add Merchant
                </button>
              )}
              {showMerchantForm && <MerchantForm initial={BLANK_SHOP} onSave={handleSaveMerchant} onCancel={() => setShowMerchantForm(false)} />}
              {editMerchant && <MerchantForm initial={editMerchant} onSave={handleSaveMerchant} onCancel={() => setEditMerchant(null)} />}
              {shops.map(shop => {
                const town = TOWNS.find(t => t.id === shop.town_id);
                return (
                  <div key={shop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {delMerchant === shop.id ? (
                      <div className="p-4 flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-700 font-semibold">Delete "{shop.name}"?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDelMerchant(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                          <button onClick={() => { deleteShop(shop.id); setDelMerchant(null); }} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: shop.color ?? "#9ca3af" }}>
                          <Store className="w-5 h-5 opacity-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-gray-800 truncate">{shop.name}</p>
                            {shop.is_premium && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-ochre/10 text-ochre shrink-0">⭐ Premium</span>}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                            <MapPin className="w-3 h-3" />{town?.name ?? shop.town_id}
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{shop.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => { setEditMerchant(shop); setShowMerchantForm(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                          <button onClick={() => setDelMerchant(shop.id)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* ── JOBS ── */}
          {tab === "jobs" && (
            <>
              {!showJobForm && !editJob && (
                <button onClick={() => setShowJobForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-acacia/30 text-acacia text-sm font-semibold rounded-2xl hover:bg-acacia/5 transition-colors">
                  <Plus className="w-4 h-4" /> Post a Job
                </button>
              )}
              {showJobForm && <JobForm initial={BLANK_JOB} onSave={handleSaveJob} onCancel={() => setShowJobForm(false)} />}
              {editJob && <JobForm initial={editJob} onSave={handleSaveJob} onCancel={() => setEditJob(null)} />}
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {delJob === job.id ? (
                    <div className="p-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-700 font-semibold">Delete "{job.title}"?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDelJob(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                        <button onClick={() => { deleteJob(job.id); setDelJob(null); }} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><Briefcase className="w-5 h-5 text-blue-400" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{job.title}</p>
                        <p className="text-[11px] text-gray-500 truncate">{job.company} · {job.town}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">{job.type}</span>
                          {job.salary && <span className="text-[9px] text-gray-400 truncate">{job.salary}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => { setEditJob(job); setShowJobForm(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                        <button onClick={() => setDelJob(job.id)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ── ADS ── */}
          {tab === "ads" && (
            <>
              <div className="bg-ochre/8 border border-ochre/20 rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-ochre mb-0.5">Paid Advertising Carousel</p>
                <p className="text-[11px] text-gray-500">Slides play on the Shop page. Add advertisers, toggle active when paid, reorder with arrows.</p>
              </div>
              {!showSlideForm && !editSlide && (
                <button onClick={() => setShowSlideForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-ochre/30 text-ochre text-sm font-semibold rounded-2xl hover:bg-ochre/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add Ad Slide
                </button>
              )}
              {showSlideForm && <SlideForm initial={BLANK_SLIDE} onSave={handleSaveSlide} onCancel={() => setShowSlideForm(false)} />}
              {editSlide && <SlideForm initial={editSlide} onSave={handleSaveSlide} onCancel={() => setEditSlide(null)} />}
              {slides.map((slide, idx) => {
                const theme = BG_THEMES[slide.bg] ?? BG_THEMES["dark"];
                return (
                  <div key={slide.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {delSlide === slide.id ? (
                      <div className="p-4 flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-700 font-semibold">Delete this slide?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDelSlide(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                          <button onClick={() => { deleteSlide(slide.id); setDelSlide(null); }} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-xl shrink-0`}>{slide.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-sm font-bold text-gray-800 truncate">{slide.headline}</p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${slide.active ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-500"}`}>{slide.active ? "Live" : "Hidden"}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate">{slide.advertiser} · {theme.label}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="flex flex-col gap-0.5">
                            <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} className="w-6 h-5 rounded flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"><ArrowUp className="w-3 h-3 text-gray-600" /></button>
                            <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} className="w-6 h-5 rounded flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"><ArrowDown className="w-3 h-3 text-gray-600" /></button>
                          </div>
                          <button onClick={() => updateSlide({ ...slide, active: !slide.active })} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${slide.active ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-400"}`}>
                            {slide.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditSlide(slide); setShowSlideForm(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                          <button onClick={() => setDelSlide(slide.id)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* ── ANALYTICS ── */}
          {tab === "analytics" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Confirmed Revenue" value={`KSh ${analytics.revenue.toLocaleString()}`} sub="from delivered orders" color="bg-acacia/10 text-acacia" />
                <StatCard label="Pending Value" value={`KSh ${(analytics.allRevenue - analytics.revenue).toLocaleString()}`} sub="awaiting delivery" color="bg-yellow-50 text-yellow-700" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatCard label="Pending" value={analytics.pending} color="bg-yellow-50 text-yellow-700" />
                <StatCard label="Confirmed" value={analytics.confirmed} color="bg-acacia/10 text-acacia" />
                <StatCard label="Delivered" value={analytics.delivered} color="bg-gray-100 text-gray-600" />
              </div>

              {/* Order status bar */}
              {orders.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Status Breakdown</p>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                    {analytics.pending   > 0 && <div className="bg-yellow-400 transition-all" style={{ flex: analytics.pending }} />}
                    {analytics.confirmed > 0 && <div className="bg-acacia   transition-all" style={{ flex: analytics.confirmed }} />}
                    {analytics.delivered > 0 && <div className="bg-gray-300  transition-all" style={{ flex: analytics.delivered }} />}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Pending ({analytics.pending})</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-acacia inline-block" /> Confirmed ({analytics.confirmed})</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Delivered ({analytics.delivered})</span>
                  </div>
                </div>
              )}

              {/* System overview */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Directory Overview</p>
                <div className="space-y-2">
                  {[
                    { icon: ShoppingBag, label: "Total Products",  value: products.length, color: "text-acacia" },
                    { icon: Store,       label: "Active Merchants", value: shops.length,   color: "text-blue-500" },
                    { icon: Briefcase,   label: "Job Listings",     value: jobs.length,    color: "text-purple-500" },
                    { icon: Megaphone,   label: "Ad Slides",        value: `${slides.filter(s => s.active).length} live / ${slides.length} total`, color: "text-ochre" },
                    { icon: Users,       label: "Total Orders",     value: orders.length,  color: "text-gray-600" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2"><Icon className={`w-4 h-4 ${color}`} /><span className="text-xs text-gray-600">{label}</span></div>
                      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top products */}
              {analytics.topProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Top Products by Orders</p>
                  <div className="space-y-2">
                    {analytics.topProducts.map((p, i) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className="text-xs font-black text-gray-300 w-4 text-center">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                          <div className="mt-0.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-acacia rounded-full transition-all" style={{ width: `${Math.round((p.count / analytics.topProducts[0].count) * 100)}%` }} />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 font-mono shrink-0">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {orders.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm">No orders yet — analytics will appear as orders come in.</p>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === "settings" && (
            <div className="space-y-4">
              {/* Change password */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Change Admin Password</p>
                <input type="password" value={pwOld} onChange={e => setPwOld(e.target.value)} placeholder="Current password" className={INPUT} />
                <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="New password (min 6 chars)" className={INPUT} />
                <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="Confirm new password" className={INPUT} onKeyDown={e => e.key === "Enter" && handlePwChange()} />
                {pwMsg && <p className={`text-xs font-semibold ${pwMsg.ok ? "text-acacia" : "text-red-500"}`}>{pwMsg.ok ? "✓" : "✗"} {pwMsg.text}</p>}
                <button onClick={handlePwChange} className="w-full py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors">Update Password</button>
              </div>

              {/* Export */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Export Data</p>
                <p className="text-xs text-gray-400 mb-3">Download all products, orders, merchants, jobs and slides as a JSON backup.</p>
                <button onClick={handleExport} className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> Download kajiado-mtaani-export.json
                </button>
              </div>

              {/* Danger zone */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Danger Zone</p>
                <p className="text-xs text-red-500 mb-3">Reset all data back to factory defaults. This will delete all your custom products, orders, merchants, jobs and slides — and cannot be undone.</p>
                {resetConfirm ? (
                  <div className="flex gap-2">
                    <button onClick={() => setResetConfirm(false)} className="flex-1 py-2.5 border border-red-200 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">Cancel</button>
                    <button onClick={handleReset} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 flex items-center justify-center gap-1.5 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Yes, Reset Everything
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setResetConfirm(true)} className="w-full py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Reset to Defaults
                  </button>
                )}
              </div>

              {/* App info */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 font-mono text-[10px] text-gray-400 space-y-1">
                <p>app: kajiado-mtaani</p>
                <p>store: v3 · localStorage</p>
                <p>products: {products.length} · merchants: {shops.length} · jobs: {jobs.length}</p>
                <p>orders: {orders.length} · slides: {slides.length}</p>
                <p>built: 2025 · kajiado county, kenya</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
