import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken, getUserInfo } from "@/lib/tiktok";
import { createServerSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=missing_params`
    );
  }

  // Verify state and get code verifier
  const cookieStore = await cookies();
  const savedState = cookieStore.get("tiktok_oauth_state")?.value;
  const codeVerifier = cookieStore.get("tiktok_code_verifier")?.value;
  cookieStore.delete("tiktok_oauth_state");
  cookieStore.delete("tiktok_code_verifier");

  if (state !== savedState) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=invalid_state`
    );
  }

  if (!codeVerifier) {
    return NextResponse.redirect(
      `${appUrl}/settings?error=missing_code_verifier`
    );
  }

  try {
    // Exchange code for tokens
    const tokenData = await exchangeCodeForToken(code, codeVerifier);

    // Get user info
    const userInfo = await getUserInfo(tokenData.access_token);

    const sb = createServerSupabase();
    const handle = `@${userInfo.display_name.toLowerCase().replace(/\s+/g, "")}`;

    // Upsert account
    await sb.from("accounts").upsert(
      {
        handle,
        display_name: userInfo.display_name,
        tiktok_open_id: tokenData.open_id,
      },
      { onConflict: "handle" }
    );

    // Upsert tokens
    const now = new Date();
    await sb.from("tiktok_tokens").upsert(
      {
        account_handle: handle,
        open_id: tokenData.open_id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        access_token_expires_at: new Date(
          now.getTime() + tokenData.expires_in * 1000
        ).toISOString(),
        refresh_token_expires_at: new Date(
          now.getTime() + tokenData.refresh_expires_in * 1000
        ).toISOString(),
        scope: tokenData.scope,
        updated_at: now.toISOString(),
      },
      { onConflict: "open_id" }
    );

    return NextResponse.redirect(
      `${appUrl}/settings?success=connected&account=${encodeURIComponent(handle)}`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      `${appUrl}/settings?error=${encodeURIComponent(message)}`
    );
  }
}
