import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mindtrade.co";
  const response = NextResponse.redirect(new URL("/dashboard", siteUrl));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.signInWithPassword({
    email: "demo@mindtrade.co",
    password: "Demo1234!",
  });

  return response;
}
