"use client";

import { useState } from "react";
import {
  Lock, Plus, Pencil, Trash2, X, Check, Package,
  ClipboardList, ChevronDown, AlertCircle
} from "lucide-react";
import { useStore, Order } from "@/lib/products-store";
import { Product } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/data";

const ADMIN_PASSWORD = "kajiado2025";

const BLANK_PRODUCT: Omit<Product, "id"> = {
  name: "", description: "", price: 0, unit: "",
  category: "Dry Goods", image_url: "", in_stock: true, badge: "",
};

function ProductForm({
  initial, onSave, onCancel,
}: {
  initial: Omit<Product, "id"> & { id?: string };
  onSave: (p: Omit<Product, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.price || form.price <= 0) e.price = "Enter a valid price";
    if (!form.unit.trim()) e.unit = "Required";
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(form);
  };

  const cats = PRODUCT_CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-800 text-sm">{form.id ? "Edit Product" : "Add New Product"}</h3>

      {/* Name */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Name</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Unga (Maize Flour) 2kg"
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.name ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
        {err.name && <p className="text-xs text-red-500 mt-0.5">{err.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
          placeholder="Brief product description…" rows={2}
          className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 resize-none ${err.description ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
        {err.description && <p className="text-xs text-red-500 mt-0.5">{err.description}</p>}
      </div>

      {/* Price + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price (KSh)</label>
          <input type="number" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))}
            placeholder="0"
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.price ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
          {err.price && <p className="text-xs text-red-500 mt-0.5">{err.price}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Unit</label>
          <input value={form.unit} onChange={(e) => set("unit", e.target.value)}
            placeholder="e.g. 2 kg bag"
            className={`mt-1 w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 ${err.unit ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-acacia/30"}`} />
          {err.unit && <p className="text-xs text-red-500 mt-0.5">{err.unit}</p>}
        </div>
      </div>

      {/* Category + In Stock */}
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
          <button onClick={() => set("in_stock", !form.in_stock)}
            className={`mt-1 w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-xl transition-all ${form.in_stock ? "bg-acacia/10 border-acacia/30 text-acacia" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
            <div className={`w-3 h-3 rounded-full ${form.in_stock ? "bg-acacia" : "bg-gray-400"}`} />
            {form.in_stock ? "In Stock" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image URL <span className="font-normal normal-case text-gray-400">(optional)</span></label>
        <input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)}
          placeholder="https://images.unsplash.com/…"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
        {form.image_url && (
          <img src={form.image_url} alt="" className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-200" onError={(e) => (e.currentTarget.style.display = "none")} />
        )}
      </div>

      {/* Badge */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Badge <span className="font-normal normal-case text-gray-400">(optional, e.g. Best Seller)</span></label>
        <input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)}
          placeholder="Best Seller / Wholesale Price / New"
          className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-acacia/30 text-gray-800" />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleSubmit}
          className="flex-1 py-2.5 bg-acacia text-white rounded-xl text-sm font-bold hover:bg-acacia/90 transition-colors flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          {form.id ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
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
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
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
            <p className="text-xs text-gray-500">
              Phone: <span className="font-semibold text-gray-700">{order.phone}</span>
            </p>
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

interface AdminSectionProps {
  onClose: () => void;
}

export default function AdminSection({ onClose }: AdminSectionProps) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("kajiado_admin") === "1";
    return false;
  });
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();

  const handleUnlock = () => {
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("kajiado_admin", "1");
      setUnlocked(true);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 1500);
    }
  };

  const handleSave = (p: Omit<Product, "id"> & { id?: string }) => {
    if (p.id) updateProduct(p as Product);
    else addProduct(p);
    setShowForm(false);
    setEditProduct(null);
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
          <input
            type="password" value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="Admin password"
            className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 text-gray-800 text-center mb-3 transition-all ${pwError ? "border-red-400 ring-2 ring-red-200 animate-pulse" : "border-gray-200 focus:ring-acacia/30"}`}
            autoFocus
          />
          {pwError && (
            <p className="flex items-center justify-center gap-1 text-xs text-red-500 mb-2">
              <AlertCircle className="w-3.5 h-3.5" /> Incorrect password
            </p>
          )}
          <button onClick={handleUnlock}
            className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors">
            Unlock
          </button>
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
            <p className="text-xs text-gray-400">Manage your shop and orders</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 shrink-0">
          <button onClick={() => setTab("products")}
            className={`flex items-center gap-2 py-3 px-1 mr-5 text-sm font-semibold border-b-2 transition-all ${tab === "products" ? "border-acacia text-acacia" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <Package className="w-4 h-4" /> Products ({products.length})
          </button>
          <button onClick={() => setTab("orders")}
            className={`flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all ${tab === "orders" ? "border-acacia text-acacia" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <ClipboardList className="w-4 h-4" />
            Orders
            {orders.filter((o) => o.status === "pending").length > 0 && (
              <span className="w-5 h-5 bg-ochre text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                {orders.filter((o) => o.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {tab === "products" && (
            <>
              {!showForm && !editProduct && (
                <button onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-acacia/30 text-acacia text-sm font-semibold rounded-2xl hover:bg-acacia/5 transition-colors">
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              )}

              {showForm && (
                <ProductForm initial={BLANK_PRODUCT} onSave={handleSave} onCancel={() => setShowForm(false)} />
              )}

              {editProduct && (
                <ProductForm initial={editProduct} onSave={handleSave} onCancel={() => setEditProduct(null)} />
              )}

              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {deleteConfirm === product.id ? (
                    <div className="p-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-700 font-semibold">Delete "{product.name}"?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Cancel</button>
                        <button onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }}
                          className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">KSh {product.price.toLocaleString()} · {product.unit}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${product.in_stock ? "bg-acacia/10 text-acacia" : "bg-gray-100 text-gray-500"}`}>
                            {product.in_stock ? "In stock" : "Out of stock"}
                          </span>
                          <span className="text-[9px] text-gray-400">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => { setEditProduct(product); setShowForm(false); }}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-acacia/10 flex items-center justify-center transition-colors">
                          <Pencil className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-50 flex items-center justify-center transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {tab === "orders" && (
            orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ClipboardList className="w-8 h-8 text-gray-300 mb-3" />
                <p className="font-semibold text-gray-500">No orders yet</p>
                <p className="text-xs text-gray-400 mt-1">Orders placed through the shop will appear here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
