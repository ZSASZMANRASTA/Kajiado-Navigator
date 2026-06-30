"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { Product, Shop, Job, Town } from "./types";
import { PRODUCTS as BASE_PRODUCTS, SHOPS as BASE_SHOPS, JOBS as BASE_JOBS, TOWNS as BASE_TOWNS, PRODUCT_CATEGORIES as BASE_CATEGORIES } from "./data";

/* ─── Order ──────────────────────────────────────────────────────────── */
export interface Order {
  id: string;
  name: string;
  phone: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  timestamp: number;
  status: "pending" | "confirmed" | "delivered";
}

/* ─── AdSlide ────────────────────────────────────────────────────────── */
export interface AdSlide {
  id: string;
  label: string;
  headline: string;
  sub: string;
  bg: string;
  emoji: string;
  cta: string;
  active: boolean;
  advertiser: string;
  link?: string;
}

export const BG_THEMES: Record<string, { label: string; gradient: string; swatch: string }> = {
  green:  { label: "Acacia Green", gradient: "from-acacia via-green-600 to-emerald-700",     swatch: "#16a34a" },
  ochre:  { label: "Ochre",        gradient: "from-ochre via-[#b86040] to-[#8b4a2f]",        swatch: "#C36F48" },
  dark:   { label: "Charcoal",     gradient: "from-gray-800 via-gray-700 to-slate-800",       swatch: "#374151" },
  purple: { label: "Violet",       gradient: "from-purple-700 via-violet-700 to-indigo-700",  swatch: "#7c3aed" },
  blue:   { label: "Sky Blue",     gradient: "from-blue-600 via-blue-500 to-cyan-600",        swatch: "#2563eb" },
  red:    { label: "Flame",        gradient: "from-red-700 via-orange-600 to-amber-600",      swatch: "#dc2626" },
  teal:   { label: "Teal",         gradient: "from-teal-700 via-teal-600 to-cyan-700",        swatch: "#0d9488" },
};

export const DEFAULT_SLIDES: AdSlide[] = [
  { id: "slide-1", label: "Duka Yetu",  headline: "Fresh Produce & Groceries",      sub: "Quality goods delivered to your door across Kajiado County",           bg: "green",  emoji: "🌽", cta: "Shop Now",       active: true, advertiser: "Kajiado Mtaani" },
  { id: "slide-2", label: "Bei Nafuu",  headline: "Wholesale Prices, Retail Ease",  sub: "Sourced directly from Nairobi markets — no middlemen, real savings",    bg: "ochre",  emoji: "💰", cta: "Browse Deals",   active: true, advertiser: "Kajiado Mtaani" },
  { id: "slide-3", label: "Delivery",   headline: "We Deliver Everywhere",           sub: "Kitengela · Rongai · Ngong · Kajiado Town · Namanga and more",          bg: "dark",   emoji: "🛵", cta: "Order Now",      active: true, advertiser: "Kajiado Mtaani" },
  { id: "slide-4", label: "Mpya",       headline: "New Arrivals Every Week",         sub: "Stock refreshed weekly — check back for fresh deals and new products",  bg: "purple", emoji: "✨", cta: "See What's New", active: true, advertiser: "Kajiado Mtaani" },
];

/* ─── State ──────────────────────────────────────────────────────────── */
interface StoreState {
  products: Product[];
  orders:   Order[];
  slides:   AdSlide[];
  shops:    Shop[];
  jobs:     Job[];
}

type StoreAction =
  | { type: "ADD_PRODUCT";    product: Product }
  | { type: "UPDATE_PRODUCT"; product: Product }
  | { type: "DELETE_PRODUCT"; productId: string }
  | { type: "ADD_ORDER";      order: Order }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: Order["status"] }
  | { type: "ADD_SLIDE";      slide: AdSlide }
  | { type: "UPDATE_SLIDE";   slide: AdSlide }
  | { type: "DELETE_SLIDE";   slideId: string }
  | { type: "REORDER_SLIDES"; slides: AdSlide[] }
  | { type: "ADD_SHOP";       shop: Shop }
  | { type: "UPDATE_SHOP";    shop: Shop }
  | { type: "DELETE_SHOP";    shopId: string }
  | { type: "ADD_JOB";        job: Job }
  | { type: "UPDATE_JOB";     job: Job }
  | { type: "DELETE_JOB";     jobId: string }
  | { type: "LOAD";           state: StoreState };

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_PRODUCT":    return { ...state, products: [...state.products, action.product] };
    case "UPDATE_PRODUCT": return { ...state, products: state.products.map(p => p.id === action.product.id ? action.product : p) };
    case "DELETE_PRODUCT": return { ...state, products: state.products.filter(p => p.id !== action.productId) };
    case "ADD_ORDER":      return { ...state, orders: [action.order, ...state.orders] };
    case "UPDATE_ORDER_STATUS": return { ...state, orders: state.orders.map(o => o.id === action.orderId ? { ...o, status: action.status } : o) };
    case "ADD_SLIDE":      return { ...state, slides: [...state.slides, action.slide] };
    case "UPDATE_SLIDE":   return { ...state, slides: state.slides.map(s => s.id === action.slide.id ? action.slide : s) };
    case "DELETE_SLIDE":   return { ...state, slides: state.slides.filter(s => s.id !== action.slideId) };
    case "REORDER_SLIDES": return { ...state, slides: action.slides };
    case "ADD_SHOP":       return { ...state, shops: [...state.shops, action.shop] };
    case "UPDATE_SHOP":    return { ...state, shops: state.shops.map(s => s.id === action.shop.id ? action.shop : s) };
    case "DELETE_SHOP":    return { ...state, shops: state.shops.filter(s => s.id !== action.shopId) };
    case "ADD_JOB":        return { ...state, jobs: [...state.jobs, action.job] };
    case "UPDATE_JOB":     return { ...state, jobs: state.jobs.map(j => j.id === action.job.id ? action.job : j) };
    case "DELETE_JOB":     return { ...state, jobs: state.jobs.filter(j => j.id !== action.jobId) };
    case "LOAD":           return action.state;
    default: return state;
  }
}

/* ─── Persistence ────────────────────────────────────────────────────── */
const STORAGE_KEY = "kajiado_store_v3";

function loadFromStorage(): StoreState {
  const defaults: StoreState = { products: BASE_PRODUCTS, orders: [], slides: DEFAULT_SLIDES, shops: BASE_SHOPS, jobs: BASE_JOBS };
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<StoreState>;
      return {
        products: p.products ?? BASE_PRODUCTS,
        orders:   p.orders   ?? [],
        slides:   p.slides   ?? DEFAULT_SLIDES,
        shops:    p.shops    ?? BASE_SHOPS,
        jobs:     p.jobs     ?? BASE_JOBS,
      };
    }
    // migrate v2
    const v2 = localStorage.getItem("kajiado_store_v2");
    if (v2) {
      const p = JSON.parse(v2) as Partial<StoreState>;
      return { products: p.products ?? BASE_PRODUCTS, orders: p.orders ?? [], slides: p.slides ?? DEFAULT_SLIDES, shops: BASE_SHOPS, jobs: BASE_JOBS };
    }
    return defaults;
  } catch { return defaults; }
}

function saveToStorage(state: StoreState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ─── Context ────────────────────────────────────────────────────────── */
interface StoreContextType {
  products: Product[];
  orders:   Order[];
  slides:   AdSlide[];
  shops:    Shop[];
  jobs:     Job[];
  towns:    Town[];
  categories: string[];
  // Products
  addProduct:    (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  // Orders
  addOrder:          (o: Omit<Order, "id" | "timestamp" | "status">) => string;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  // Slides
  addSlide:      (s: Omit<AdSlide, "id">) => void;
  updateSlide:   (s: AdSlide) => void;
  deleteSlide:   (id: string) => void;
  reorderSlides: (slides: AdSlide[]) => void;
  // Shops
  addShop:    (s: Omit<Shop, "id">) => void;
  updateShop: (s: Shop) => void;
  deleteShop: (id: string) => void;
  // Jobs
  addJob:    (j: Omit<Job, "id">) => void;
  updateJob: (j: Job) => void;
  deleteJob: (id: string) => void;
  // Reset
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    products: BASE_PRODUCTS, orders: [], slides: DEFAULT_SLIDES, shops: BASE_SHOPS, jobs: BASE_JOBS,
  });

  useEffect(() => { dispatch({ type: "LOAD", state: loadFromStorage() }); }, []);
  useEffect(() => { saveToStorage(state); }, [state]);

  const addProduct    = useCallback((p: Omit<Product, "id">) => dispatch({ type: "ADD_PRODUCT",    product: { ...p, id: "prod-" + Date.now() } }), []);
  const updateProduct = useCallback((p: Product)              => dispatch({ type: "UPDATE_PRODUCT", product: p }), []);
  const deleteProduct = useCallback((id: string)              => dispatch({ type: "DELETE_PRODUCT", productId: id }), []);

  const addOrder = useCallback((o: Omit<Order, "id" | "timestamp" | "status">): string => {
    const id = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    dispatch({ type: "ADD_ORDER", order: { ...o, id, timestamp: Date.now(), status: "pending" } });
    return id;
  }, []);
  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => dispatch({ type: "UPDATE_ORDER_STATUS", orderId, status }), []);

  const addSlide      = useCallback((s: Omit<AdSlide, "id">) => dispatch({ type: "ADD_SLIDE",      slide: { ...s, id: "ad-" + Date.now() } }), []);
  const updateSlide   = useCallback((s: AdSlide)              => dispatch({ type: "UPDATE_SLIDE",   slide: s }), []);
  const deleteSlide   = useCallback((id: string)              => dispatch({ type: "DELETE_SLIDE",   slideId: id }), []);
  const reorderSlides = useCallback((slides: AdSlide[])       => dispatch({ type: "REORDER_SLIDES", slides }), []);

  const addShop    = useCallback((s: Omit<Shop, "id">) => dispatch({ type: "ADD_SHOP",    shop: { ...s, id: "shop-" + Date.now() } }), []);
  const updateShop = useCallback((s: Shop)              => dispatch({ type: "UPDATE_SHOP", shop: s }), []);
  const deleteShop = useCallback((id: string)           => dispatch({ type: "DELETE_SHOP", shopId: id }), []);

  const addJob    = useCallback((j: Omit<Job, "id">) => dispatch({ type: "ADD_JOB",    job: { ...j, id: "job-" + Date.now() } }), []);
  const updateJob = useCallback((j: Job)              => dispatch({ type: "UPDATE_JOB", job: j }), []);
  const deleteJob = useCallback((id: string)          => dispatch({ type: "DELETE_JOB", jobId: id }), []);

  const resetToDefaults = useCallback(() => {
    const fresh: StoreState = { products: BASE_PRODUCTS, orders: [], slides: DEFAULT_SLIDES, shops: BASE_SHOPS, jobs: BASE_JOBS };
    dispatch({ type: "LOAD", state: fresh });
  }, []);

  const categories = Array.from(new Set(["All", ...BASE_CATEGORIES.filter(c => c !== "All"), ...state.products.map(p => p.category)]));

  return (
    <StoreContext.Provider value={{
      products: state.products, orders: state.orders, slides: state.slides, shops: state.shops, jobs: state.jobs, towns: BASE_TOWNS, categories,
      addProduct, updateProduct, deleteProduct, addOrder, updateOrderStatus,
      addSlide, updateSlide, deleteSlide, reorderSlides,
      addShop, updateShop, deleteShop,
      addJob, updateJob, deleteJob,
      resetToDefaults,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
