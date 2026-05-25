import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
 *   is_premium  BOOLEAN NOT NULL DEFAULT FALSE
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
 * ────────────────────────────────────────────────────────────────────────────
 */
