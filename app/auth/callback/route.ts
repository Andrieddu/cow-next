import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

const DEFAULT_NEXT_PATH = "/reset-password";

function getSafeNextUrl(nextPath: string | null, origin: string) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return new URL(DEFAULT_NEXT_PATH, origin);
  }

  const candidate = new URL(nextPath, origin);

  if (candidate.origin !== origin) {
    return new URL(DEFAULT_NEXT_PATH, origin);
  }

  return candidate;
}

function redirectToLogin(origin: string, message: string) {
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return redirectToLogin(
      origin,
      "Il link di recupero non è valido o è scaduto.",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Auth Callback Error]:", error);
    return redirectToLogin(
      origin,
      "Il link di recupero non è valido o è scaduto.",
    );
  }

  const nextUrl = getSafeNextUrl(
    request.nextUrl.searchParams.get("next"),
    origin,
  );

  return NextResponse.redirect(nextUrl);
}
