import { startOfWeek, endOfWeek, format, getISOWeek, getISOWeekYear } from "date-fns";
import type { WeeklyMetrics } from "@/types/metrics";
import type { TikTokVideo } from "./tiktok";

interface AggregateInput {
  videos: TikTokVideo[];
  accountHandle: string;
  followerCount: number;
}

export function aggregateVideosToWeeklyMetrics({
  videos,
  accountHandle,
  followerCount,
}: AggregateInput): WeeklyMetrics[] {
  // Group videos by ISO week
  const weekMap = new Map<
    string,
    {
      views: number;
      likes: number;
      comments: number;
      shares: number;
      weekStart: Date;
      weekEnd: Date;
      weekNum: number;
      year: number;
    }
  >();

  for (const video of videos) {
    const videoDate = new Date(video.create_time * 1000);
    const year = getISOWeekYear(videoDate);
    const weekNum = getISOWeek(videoDate);
    const key = `${year}-W${String(weekNum).padStart(2, "0")}`;

    if (!weekMap.has(key)) {
      weekMap.set(key, {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        weekStart: startOfWeek(videoDate, { weekStartsOn: 1 }),
        weekEnd: endOfWeek(videoDate, { weekStartsOn: 1 }),
        weekNum,
        year,
      });
    }

    const entry = weekMap.get(key)!;
    entry.views += video.view_count || 0;
    entry.likes += video.like_count || 0;
    entry.comments += video.comment_count || 0;
    entry.shares += video.share_count || 0;
  }

  const handleKey = accountHandle.replace("@", "");

  return Array.from(weekMap.entries()).map(([weekKey, data]) => ({
    id: `${weekKey}-${handleKey}-api`,
    account: accountHandle,
    weekLabel: `Semana ${data.weekNum}`,
    weekStartDate: format(data.weekStart, "yyyy-MM-dd"),
    weekEndDate: format(data.weekEnd, "yyyy-MM-dd"),
    views: data.views,
    likes: data.likes,
    comments: data.comments,
    shares: data.shares,
    followers: followerCount,
    profileVisits: 0, // Not available from basic TikTok API
    reach: 0, // Not available from basic TikTok API
    interactions: data.likes + data.comments + data.shares,
    source: "tiktok_api" as const,
  }));
}
