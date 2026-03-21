import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

// Assicurati che il percorso import sia corretto per il tuo progetto
import { SpaceService } from "@/services/space-service";
import CheckoutClient from "@/components/checkout/CheckoutClient";

type Props = {
  searchParams: Promise<{ spaceId?: string }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const params = await searchParams;
  const spaceId = params.spaceId;

  // Se non c'è l'ID nell'URL, rimandiamo alla Home
  if (!spaceId) {
    redirect("/");
  }

  // Chiamata Reale al DB tramite Prisma
  const space = await SpaceService.getSpaceById(spaceId);

  // Se l'ID è sbagliato o lo spazio è stato rimosso
  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Spazio non trovato</h1>
        <p className="text-muted-foreground">
          L annuncio potrebbe essere stato rimosso.
        </p>
        <Link href="/search" className="text-accent hover:underline font-bold">
          Torna alla ricerca
        </Link>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      {/* HEADER STICKY GLOBALE */}
      <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href={`/space/${space.id}`}
            className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Annulla e torna indietro
          </Link>
          <div className="font-bold text-xl tracking-tight hidden md:block">
            Conferma e paga
          </div>
          <div className="w-24" />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-[50vh] items-center justify-center text-muted-foreground font-bold">
            Caricamento riepilogo...
          </div>
        }
      >
        {/* Passiamo il DB object reale al Client */}
        <CheckoutClient space={space} />
      </Suspense>
    </main>
  );
}
