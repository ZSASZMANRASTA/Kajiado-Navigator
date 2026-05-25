import { createClient } from "@supabase/supabase-js";
import type { Town, Shop, SubmitShopPayload } from "./types";
import { TOWNS, SHOPS } from "./data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchTowns(): Promise<Town[]> {
  if (!supabase) return TOWNS;
  const { data, error } = await supabase
    .from("towns")
    .select("*")
    .order("name");
  if (error || !data) return TOWNS;
  return data as Town[];
}

export async function fetchShops(townId?: string): Promise<Shop[]> {
  if (!supabase) {
    return townId ? SHOPS.filter((s) => s.town_id === townId) : SHOPS;
  }
  let query = supabase.from("shops").select("*").order("is_premium", { ascending: false });
  if (townId) query = query.eq("town_id", townId);
  const { data, error } = await query;
  if (error || !data) {
    return townId ? SHOPS.filter((s) => s.town_id === townId) : SHOPS;
  }
  return data as Shop[];
}

export async function submitShop(payload: SubmitShopPayload): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true };
  }
  const { error } = await supabase.from("shops").insert([
    { ...payload, is_premium: false, image_url: null },
  ]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export const usingLiveData = isConfigured;

/*
 * ─── Supabase SQL Schema ────────────────────────────────────────────────────
 *
 * Run the following SQL in the Supabase SQL Editor to create the required tables:
 *
 * -- Towns table
 * CREATE TABLE IF NOT EXISTS towns (
 *   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   name        TEXT NOT NULL,
 *   latitude    DOUBLE PRECISION NOT NULL,
 *   longitude   DOUBLE PRECISION NOT NULL,
 *   shop_count  INTEGER NOT NULL DEFAULT 0
 * );
 *
 * -- Shops table
 * CREATE TABLE IF NOT EXISTS shops (
 *   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   town_id     UUID NOT NULL REFERENCES towns(id) ON DELETE CASCADE,
 *   name        TEXT NOT NULL,
 *   description TEXT,
 *   category    TEXT,
 *   image_url   TEXT,
 *   is_premium  BOOLEAN NOT NULL DEFAULT FALSE,
 *   phone       TEXT,
 *   whatsapp    TEXT,
 *   hours       TEXT
 * );
 *
 * -- Enable Row Level Security (optional but recommended)
 * ALTER TABLE towns ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
 *
 * -- Public read policy
 * CREATE POLICY "Allow public read" ON towns FOR SELECT USING (true);
 * CREATE POLICY "Allow public read" ON shops  FOR SELECT USING (true);
 *
 * -- Allow anyone to submit a new shop (review manually in Supabase dashboard)
 * CREATE POLICY "Allow public insert" ON shops FOR INSERT WITH CHECK (true);
 *
 * ────────────────────────────────────────────────────────────────────────────
 */
