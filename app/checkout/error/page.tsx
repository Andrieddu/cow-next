"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  RefreshCcw,
  ArrowLeft,
  HelpCircle,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// IMPORT DATI MOCK
import { getSpacesWithAggregates } from "@/lib/mock-data";

function ErrorContent() {
  const searchParams = useSearchParams();
  const spaceId = searchParams.get("spaceId");
  const durationParam = searchParams.get("duration");

  const space = getSpacesWithAggregates().find((s) => s.id === spaceId);

  // Calcolo del prezzo fallito
  const totalPrice = useMemo(() => {
    if (!space) return 0;
    const isHourly = !!space.hourlyPrice;
    const oreSelezionate = durationParam ? parseInt(durationParam) : 4; // default
    const basePrice = space.hourlyPrice || space.dailyPrice || 0;
    return isHourly ? basePrice * oreSelezionate : basePrice;
  }, [space, durationParam]);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      {/* 1. ICONA E MESSAGGIO DI ERRORE */}
      <div className="h-24 w-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6 shadow-sm border border-destructive/20 animate-in zoom-in duration-500">
        <XCircle className="h-12 w-12" />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-4">
        Pagamento non riuscito
      </h1>
      <p className="text-muted-foreground text-center font-medium text-lg mb-10 max-w-md">
        Non siamo riusciti a elaborare la tua richiesta per{" "}
        <strong className="text-foreground">
          {space?.title || "questo spazio"}
        </strong>
        .{" "}
        <strong className="text-foreground">
          Non ti è stato addebitato alcun importo.
        </strong>
      </p>

      {/* 2. CARD RIEPILOGO ERRORE E SUGGERIMENTI */}
      <div className="w-full bg-background rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-destructive/5 border border-border/50 mb-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-destructive/10 rounded-2xl shrink-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              Cosa potrebbe essere successo?
            </h3>
            <ul className="text-muted-foreground font-medium text-sm space-y-2 list-disc list-inside">
              <li>Fondi insufficienti sulla carta selezionata.</li>
              <li>I dati della carta (CVC o scadenza) non sono corretti.</li>
              <li>La tua banca ha bloccato la transazione per sicurezza.</li>
              <li>Un problema temporaneo di connessione.</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-border/50 mb-8" />

        {/* Dettagli del tentativo */}
        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Dettagli del tentativo fallito
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex gap-4 p-5 rounded-2xl bg-secondary/5 border border-border/50">
            <CreditCard className="h-6 w-6 text-accent shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">Metodo usato</span>
              <span className="text-xs text-muted-foreground font-medium mt-1">
                Visa terminante con{" "}
                <strong className="text-foreground">4242</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center p-5 rounded-2xl bg-secondary/5 border border-border/50">
            <span className="font-bold text-sm">Importo non addebitato</span>
            <span className="text-xl font-extrabold text-foreground mt-1">
              €{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTONI FINALI */}
      <div className="flex flex-col sm:flex-row items-center w-full gap-4">
        {/* Il tasto riprova ti riporta al checkout con gli stessi parametri */}
        <Link
          href={spaceId ? `/checkout?spaceId=${spaceId}` : "/search"}
          className="w-full"
        >
          <Button className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2">
            <RefreshCcw className="h-5 w-5" /> Riprova il pagamento
          </Button>
        </Link>
        {/* Il tasto torna indietro ti riporta alla pagina dello spazio */}
        <Link
          href={spaceId ? `/space/${spaceId}` : "/search"}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl font-bold text-base border-border/50 hover:bg-secondary/10 shadow-sm gap-2"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" /> Torna allo
            spazio
          </Button>
        </Link>
      </div>

      {/* Supporto */}
      <Button
        variant="link"
        className="mt-8 text-muted-foreground hover:text-foreground font-medium gap-2"
      >
        <HelpCircle className="h-4 w-4" /> Hai bisogno di aiuto? Contatta
        l'assistenza
      </Button>
    </div>
  );
}

// WRAPPER PRINCIPALE CON SUSPENSE
export default function CheckoutErrorPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-secondary/5 py-12 md:py-20 px-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse font-bold text-muted-foreground">
              Caricamento dettagli errore...
            </div>
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </main>
  );
}
