"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { Product } from "./types";
import { PRODUCTS as BASE_PRODUCTS, PRODUCT_CATEGORIES as BASE_CATEGORIES } from "./data";

export interface Order {
  id: string;
  name: string;
  phone: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  timestamp: number;
  status: "pending" | "confirmed" | "delivered";
}

interface StoreState {
  products: Product[];
  orders: Order[];
}

type StoreAction =
  | { type: "SET"; products: Product[] }
  | { type: "ADD"; product: Product }
  | { type: "UPDATE"; product: Product }
  | { type: "DELETE"; productId: string }
  | { type: "ADD_ORDER"; order: Order }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: Order["status"] }
  | { type: "LOAD"; state: StoreState };

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD":
      return { ...state, products: [...state.products, action.product] };
    case "UPDATE":
      return { ...state, products: state.products.map((p) => p.id === action.product.id ? action.product : p) };
    case "DELETE":
      return { ...state, products: state.products.filter((p) => p.id !== action.productId) };
    case "ADD_ORDER":
      return { ...state, orders: [action.order, ...state.orders] };
    case "UPDATE_ORDER_STATUS":
      return { ...state, orders: state.orders.map((o) => o.id === action.orderId ? { ...o, status: action.status } : o) };
    case "LOAD":
      return action.state;
    default:
      return state;
  }
}

const STORAGE_KEY = "kajiado_store_v1";

function loadFromStorage(): StoreState {
  if (typeof window === "undefined") return { products: BASE_PRODUCTS, orders: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { products: BASE_PRODUCTS, orders: [] };
    const parsed = JSON.parse(raw) as StoreState;
    return { products: parsed.products ?? BASE_PRODUCTS, orders: parsed.orders ?? [] };
  } catch {
    return { products: BASE_PRODUCTS, orders: [] };
  }
}

function saveToStorage(state: StoreState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "timestamp" | "status">) => string;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  categories: string[];
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { products: BASE_PRODUCTS, orders: [] });

  useEffect(() => {
    const loaded = loadFromStorage();
    dispatch({ type: "LOAD", state: loaded });
  }, []);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const addProduct = useCallback((p: Omit<Product, "id">) => {
    const id = "custom-" + Date.now();
    dispatch({ type: "ADD", product: { ...p, id } });
  }, []);

  const updateProduct = useCallback((p: Product) => {
    dispatch({ type: "UPDATE", product: p });
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    dispatch({ type: "DELETE", productId });
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "timestamp" | "status">): string => {
    const id = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    dispatch({ type: "ADD_ORDER", order: { ...order, id, timestamp: Date.now(), status: "pending" } });
    return id;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", orderId, status });
  }, []);

  const categories = Array.from(
    new Set(["All", ...BASE_CATEGORIES.filter((c) => c !== "All"), ...state.products.map((p) => p.category)])
  );

  return (
    <StoreContext.Provider value={{ products: state.products, orders: state.orders, addProduct, updateProduct, deleteProduct, addOrder, updateOrderStatus, categories }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
