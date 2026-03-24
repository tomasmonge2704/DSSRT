import { NextResponse } from "next/server";

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  const res = await fetch(`${appUrl}/api/tiktok/sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cronSecret}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
