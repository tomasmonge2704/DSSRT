import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET() {
  const sb = createServerSupabase();

  const { data, error } = await sb
    .from("sync_log")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
