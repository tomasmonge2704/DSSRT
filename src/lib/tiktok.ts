import { createServerSupabase } from "./supabase";

const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
const TIKTOK_VIDEO_LIST_URL = "https://open.tiktokapis.com/v2/video/list/";

const SCOPES = "user.info.profile,user.info.stats,video.list";

// --- Types ---

export interface TikTokTokenResponse {
  open_id: string;
  scope: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface TikTokUserInfo {
  open_id: string;
  display_name: string;
  avatar_url: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokVideo {
  id: string;
  title: string;
  create_time: number; // unix timestamp
  share_count: number;
  view_count: number;
  like_count: number;
  comment_count: number;
}

// --- PKCE helpers ---

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64;
}

// --- Auth ---

export async function getTikTokAuthUrl(
  state: string,
  codeChallenge: string
): Promise<string> {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    scope: SCOPES,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tiktok/callback`,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<TikTokTokenResponse> {
  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/tiktok/callback`,
      code_verifier: codeVerifier,
    }),
  });

  const data = await res.json();
  if (data.error?.code && data.error.code !== "ok") {
    throw new Error(`TikTok token error: ${data.error.message || data.error.code}`);
  }
  return data.data ?? data;
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TikTokTokenResponse> {
  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (data.error?.code && data.error.code !== "ok") {
    throw new Error(`TikTok refresh error: ${data.error.message || data.error.code}`);
  }
  return data.data ?? data;
}

// --- Token management ---

export async function getValidAccessToken(
  accountHandle: string
): Promise<string> {
  const sb = createServerSupabase();

  const { data: token, error } = await sb
    .from("tiktok_tokens")
    .select("*")
    .eq("account_handle", accountHandle)
    .single();

  if (error || !token) {
    throw new Error(`No token found for ${accountHandle}`);
  }

  // Check if access token is still valid (with 5min buffer)
  const expiresAt = new Date(token.access_token_expires_at);
  const bufferMs = 5 * 60 * 1000;
  if (expiresAt.getTime() > Date.now() + bufferMs) {
    return token.access_token;
  }

  // Check if refresh token is still valid
  const refreshExpiresAt = new Date(token.refresh_token_expires_at);
  if (refreshExpiresAt.getTime() < Date.now()) {
    throw new Error(
      `Refresh token expired for ${accountHandle}. Re-authorization required.`
    );
  }

  // Refresh the token
  const refreshed = await refreshAccessToken(token.refresh_token);

  await sb
    .from("tiktok_tokens")
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      access_token_expires_at: new Date(
        Date.now() + refreshed.expires_in * 1000
      ).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("account_handle", accountHandle);

  return refreshed.access_token;
}

// --- API calls ---

export async function getUserInfo(
  accessToken: string
): Promise<TikTokUserInfo> {
  // user.info.profile fields + user.info.stats fields
  const fields = [
    "open_id",
    "display_name",
    "avatar_url",
    "follower_count",
    "following_count",
    "likes_count",
    "video_count",
    "bio_description",
    "is_verified",
  ].join(",");

  const res = await fetch(`${TIKTOK_USER_INFO_URL}?fields=${fields}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  if (data.error?.code && data.error.code !== "ok") {
    throw new Error(
      `TikTok user info error: ${data.error.message || data.error.code}`
    );
  }
  if (!data.data?.user) {
    throw new Error(
      `TikTok user info: unexpected response: ${JSON.stringify(data)}`
    );
  }
  return data.data.user;
}

export async function getVideoList(
  accessToken: string,
  maxResults = 50
): Promise<TikTokVideo[]> {
  const fields = [
    "id",
    "title",
    "create_time",
    "share_count",
    "view_count",
    "like_count",
    "comment_count",
  ].join(",");

  const allVideos: TikTokVideo[] = [];
  let cursor: number | undefined;
  let hasMore = true;

  while (hasMore && allVideos.length < maxResults) {
    const body: Record<string, unknown> = {
      max_count: Math.min(20, maxResults - allVideos.length),
    };
    if (cursor !== undefined) {
      body.cursor = cursor;
    }

    const res = await fetch(`${TIKTOK_VIDEO_LIST_URL}?fields=${fields}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.error?.code && data.error.code !== "ok") {
      throw new Error(`TikTok video list error: ${data.error.message || data.error.code}`);
    }

    const videos = data.data?.videos ?? [];
    allVideos.push(...videos);

    hasMore = data.data?.has_more ?? false;
    cursor = data.data?.cursor;
  }

  return allVideos;
}
