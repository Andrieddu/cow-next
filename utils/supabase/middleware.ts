import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,

    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Questa chiamata rinfresca il token se è scaduto
  // e aggiorna i cookie usando il metodo setAll() definito sopra.
  // Invece di chiamarlo e basta, salviamo l'utente in una variabile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Leggiamo in quale pagina sta cercando di andare l'utente
  const pathname = request.nextUrl.pathname;

  // Definisci qui tutte le rotte che richiedono il login
  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/host");

  // Definisci qui le rotte di autenticazione (dove un loggato non dovrebbe stare)
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Caso A: Anonimo cerca di entrare in un'area privata -> Vai al Login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Caso B: Utente Loggato cerca di andare su login/signup -> Vai al Profilo
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // Se nessuna regola scatta, lascialo passare normalmente
  return supabaseResponse;
}
