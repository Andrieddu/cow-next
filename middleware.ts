import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Aggiorna la sessione di Supabase prima di caricare la pagina
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Applica il middleware a tutte le rotte tranne:
     * - api (rotte API)
     * - _next/static (file statici)
     * - _next/image (immagini ottimizzate)
     * - favicon.ico (file pubblici)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
