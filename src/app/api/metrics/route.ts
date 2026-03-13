import { NextRequest, NextResponse } from "next/server";
import { getFilteredMetrics, upsertMetrics } from "@/lib/data";
import type { AccountHandle, WeeklyMetrics } from "@/types/metrics";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accountsParam = searchParams.get("accounts");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const accounts: AccountHandle[] = accountsParam
    ? (accountsParam.split(",") as AccountHandle[])
    : [];

  const dateRange =
    startDate && endDate ? { start: startDate, end: endDate } : null;

  const metrics = await getFilteredMetrics({ accounts, dateRange });
  return NextResponse.json(metrics);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as WeeklyMetrics[];
  const count = await upsertMetrics(body);
  return NextResponse.json({ success: true, count });
}
