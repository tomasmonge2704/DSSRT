import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getTikTokAuthUrl,
  generateCodeVerifier,
  generateCodeChallenge,
} from "@/lib/tiktok";

export async function GET() {
  const state = crypto.randomUUID();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const cookieStore = await cookies();

  cookieStore.set("tiktok_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  cookieStore.set("tiktok_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const authUrl = await getTikTokAuthUrl(state, codeChallenge);
  return NextResponse.redirect(authUrl);
}
