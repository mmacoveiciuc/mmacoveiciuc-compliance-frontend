import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new NextResponse(
      JSON.stringify({ error: "missing code parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const clientId = process.env.NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.SUPABASE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse(
      JSON.stringify({ error: "missing client credentials" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Build the Basic Auth header
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    // Prepare the request body (URL-encoded)
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.NEXT_PUBLIC_SUPABASE_OAUTH_REDIRECT_URI ?? "",
    });

    // Make the POST request
    const tokenResponse = await fetch(
      "https://api.supabase.com/v1/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: params.toString(),
      }
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.json();
      console.error("Token exchange error:", errorBody);
      return new NextResponse(
        JSON.stringify({ error: "Failed to exchange token" }),
        {
          status: tokenResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    const cookie = await cookies();
    const maxAge = expires_in;
    cookie.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain: process.env.NEXT_COOKIE_DOMAIN,
      maxAge,
    });
    cookie.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain: process.env.NEXT_COOKIE_DOMAIN,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    cookie.set("token_expiration", String(Date.now() + expires_in * 1000), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain: process.env.NEXT_COOKIE_DOMAIN,
      path: "/",
      maxAge,
    });

    // Redirect to home page once autheticated
    const response = NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH ?? "/", request.url)
    );

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
