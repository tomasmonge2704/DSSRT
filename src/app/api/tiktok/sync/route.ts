import { NextRequest, NextResponse } from "next/server";
import { getAccounts, upsertMetrics } from "@/lib/data";
import { getValidAccessToken, getUserInfo, getVideoList } from "@/lib/tiktok";
import { aggregateVideosToWeeklyMetrics } from "@/lib/tiktok-aggregator";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await getAccounts();
  const connectedAccounts = accounts.filter((a) => a.isConnected);

  if (connectedAccounts.length === 0) {
    return NextResponse.json({ message: "No connected accounts" });
  }

  const sb = createServerSupabase();
  const results: { account: string; status: string; count?: number; error?: string }[] = [];

  for (const account of connectedAccounts) {
    // Log sync start
    const { data: logEntry } = await sb
      .from("sync_log")
      .insert({
        account_handle: account.handle,
        status: "running",
      })
      .select("id")
      .single();

    try {
      const accessToken = await getValidAccessToken(account.handle);
      const userInfo = await getUserInfo(accessToken);
      const videos = await getVideoList(accessToken, 100);

      const weeklyMetrics = aggregateVideosToWeeklyMetrics({
        videos,
        accountHandle: account.handle,
        followerCount: userInfo.follower_count,
      });

      if (weeklyMetrics.length > 0) {
        await upsertMetrics(weeklyMetrics);
      }

      // Log success
      if (logEntry?.id) {
        await sb
          .from("sync_log")
          .update({
            status: "success",
            metrics_count: weeklyMetrics.length,
            finished_at: new Date().toISOString(),
          })
          .eq("id", logEntry.id);
      }

      results.push({
        account: account.handle,
        status: "success",
        count: weeklyMetrics.length,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      // Log error
      if (logEntry?.id) {
        await sb
          .from("sync_log")
          .update({
            status: "error",
            error_message: message,
            finished_at: new Date().toISOString(),
          })
          .eq("id", logEntry.id);
      }

      results.push({
        account: account.handle,
        status: "error",
        error: message,
      });
    }
  }

  return NextResponse.json({ results });
}
