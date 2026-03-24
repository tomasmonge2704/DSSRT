/**
 * One-time migration script: reads data/metrics.json and inserts into Supabase.
 *
 * Usage:
 *   npx tsx scripts/migrate-json-to-supabase.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key);

interface LegacyMetric {
  id: string;
  account: string;
  weekLabel: string;
  weekStartDate: string;
  weekEndDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  profileVisits: number;
  reach: number;
  interactions: number;
}

interface LegacyStore {
  weeklyMetrics: LegacyMetric[];
}

async function main() {
  const filePath = join(process.cwd(), "data", "metrics.json");
  const raw = readFileSync(filePath, "utf-8");
  const store: LegacyStore = JSON.parse(raw);

  console.log(`Found ${store.weeklyMetrics.length} metrics to migrate`);

  const rows = store.weeklyMetrics.map((m) => ({
    id: m.id,
    account_handle: m.account,
    week_label: m.weekLabel,
    week_start_date: m.weekStartDate,
    week_end_date: m.weekEndDate,
    views: m.views,
    likes: m.likes,
    comments: m.comments,
    shares: m.shares,
    followers: m.followers,
    profile_visits: m.profileVisits,
    reach: m.reach,
    interactions: m.interactions,
    source: "excel",
  }));

  const { error } = await sb
    .from("weekly_metrics")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }

  console.log(`Successfully migrated ${rows.length} metrics to Supabase`);
}

main();
