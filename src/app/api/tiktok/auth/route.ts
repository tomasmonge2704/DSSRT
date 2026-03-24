import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTikTokAuthUrl } from "@/lib/tiktok";

export async function GET() {
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  cookieStore.set("tiktok_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  const authUrl = getTikTokAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
