"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation"; // AGGIUNTO useRouter
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  ShieldCheck,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Lock,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";

// IMPORT DATI MOCK
import { getSpacesWithAggregates, SpaceType } from "@/lib/mock-data";

// Helper Tipologia
const formatSpaceType = (type: SpaceType) => {
  const types: Record<SpaceType, string> = {
    FLEX_DESK: "Flex Desk",
    FIXED_DESK: "Scrivania Fissa",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    PODCAST_ROOM: "Sala Podcast",
  };
  return types[type] || type;
};

// --- COMPONENTE LOGICO PRINCIPALE ---
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // INIZIALIZZATO IL ROUTER
  const spaceId = searchParams.get("spaceId");

  // Cerchiamo lo spazio nel nostro "database"
  const space = getSpacesWithAggregates().find((s) => s.id === spaceId);

  // Stato per gestire il caricamento del pagamento finto
  const [isProcessing, setIsProcessing] = useState(false);

  // Se arriviamo sulla pagina senza ID o l'ID è sbagliato
  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Spazio non trovato</h1>
        <p className="text-muted-foreground">Nessuna prenotazione in corso.</p>
        <Button variant="outline" asChild>
          <Link href="/search">Torna alla ricerca</Link>
        </Button>
      </div>
    );
  }

  const isHourly = !!space.hourlyPrice;
  const oreSelezionate = 4;
  const basePrice = space.hourlyPrice || space.dailyPrice || 0;
  const totalPrice = isHourly ? basePrice * oreSelezionate : basePrice;
  const priceLabel = isHourly
    ? `€${basePrice.toFixed(2)} x ${oreSelezionate} ore`
    : `Tariffa giornaliera`;

  // GESTIONE PAGAMENTO CON REDIRECT
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simuliamo 2 secondi di elaborazione carta di credito
    setTimeout(() => {
      setIsProcessing(false);
      // Passiamo l'ID alla pagina di success
      // Generiamo un risultato casuale: 50% successo, 50% errore
      const isSuccessful = Math.random() > 0.5;

      const params = `?spaceId=${space.id}&duration=${oreSelezionate}`;

      if (isSuccessful) {
        router.push(`/checkout/success${params}`);
      } else {
        router.push(`/checkout/error${params}`);
      }
    }, 2000);
  };

  return (
    <div className="container max-w-6xl mx-auto px-6 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* =========================================
            COLONNA SINISTRA: DATI E PAGAMENTO
            ========================================= */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          {/* SEZIONE 1: La tua prenotazione */}
          <FieldSet>
            <FieldLegend className="text-2xl font-bold tracking-tight mb-6">
              La tua prenotazione
            </FieldLegend>
            <FieldGroup className="space-y-6 bg-secondary/5 rounded-[2rem] p-6 border border-border/50">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-accent" /> Date
                  </span>
                  <span className="text-muted-foreground font-medium">
                    Domani
                  </span>
                </div>
                <Link
                  href={`/space/${space.id}`}
                  className="font-bold text-accent hover:underline underline-offset-4 text-sm"
                >
                  Modifica
                </Link>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" /> Orario
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {isHourly ? "09:00 - 13:00 (4 ore)" : "Giornata Intera"}
                  </span>
                </div>
                <Link
                  href={`/space/${space.id}`}
                  className="font-bold text-accent hover:underline underline-offset-4 text-sm"
                >
                  Modifica
                </Link>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" /> Ospiti
                  </span>
                  <span className="text-muted-foreground font-medium">
                    1 partecipante
                  </span>
                </div>
                <Link
                  href={`/space/${space.id}`}
                  className="font-bold text-accent hover:underline underline-offset-4 text-sm"
                >
                  Modifica
                </Link>
              </div>
            </FieldGroup>
          </FieldSet>

          <Separator className="bg-border/50" />

          {/* FORM DI PAGAMENTO */}
          <form onSubmit={handlePayment} className="space-y-10">
            {/* SEZIONE 2: Metodo di pagamento */}
            <FieldSet>
              <div className="flex items-center justify-between mb-6">
                <FieldLegend className="text-2xl font-bold tracking-tight mb-0">
                  Paga con
                </FieldLegend>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Crittografato
                  </span>
                </div>
              </div>

              <FieldGroup>
                <RadioGroup defaultValue="card" className="gap-4">
                  {/* Opzione: Carta di Credito */}
                  <div className="relative flex flex-col p-6 rounded-[2rem] border-2 border-border/50 bg-background transition-all [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="border-accent text-accent"
                        />
                        <label
                          htmlFor="card"
                          className="font-bold text-base cursor-pointer flex items-center gap-2"
                        >
                          <CreditCard className="h-5 w-5 text-accent" /> Carta
                          di credito o debito
                        </label>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">
                          VISA
                        </div>
                        <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center text-[8px] font-bold text-white">
                          MC
                        </div>
                      </div>
                    </div>

                    {/* Form Carta */}
                    <FieldGroup className="space-y-4">
                      <Field>
                        <FieldLabel>Numero della carta</FieldLabel>
                        <div className="relative">
                          <Input
                            required
                            placeholder="0000 0000 0000 0000"
                            className="h-12 rounded-xl font-mono text-base border-border/50 bg-background pl-10 focus-visible:ring-accent/20"
                          />
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>Scadenza</FieldLabel>
                          <Input
                            required
                            placeholder="MM/AA"
                            className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-accent/20"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>CVC</FieldLabel>
                          <Input
                            required
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-accent/20"
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  </div>

                  {/* Opzione: PayPal */}
                  <div className="flex items-center justify-between p-6 rounded-[2rem] border-2 border-border/50 bg-background transition-all [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="border-accent text-accent"
                      />
                      <label
                        htmlFor="paypal"
                        className="font-bold text-base cursor-pointer flex items-center gap-2"
                      >
                        <Wallet className="h-5 w-5 text-accent" /> PayPal
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </FieldGroup>
            </FieldSet>

            <Separator className="bg-border/50" />

            {/* SEZIONE 3: Regole e Conferma */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  Regole dello spazio
                </h2>
                <p className="text-muted-foreground font-medium leading-relaxed mb-4">
                  Chiediamo a tutti gli ospiti di ricordare alcune semplici
                  regole per mantenere uno spazio di lavoro produttivo e
                  rispettoso per tutti.
                </p>
                <ul className="list-disc list-inside text-sm font-bold text-foreground space-y-2">
                  <li>Nessun party o evento non autorizzato.</li>
                  <li>
                    Mantenere il livello di rumore adeguato agli altri
                    professionisti.
                  </li>
                  <li>Lasciare la sala pulita come è stata trovata.</li>
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-sm font-medium">
                Cliccando su "Paga e prenota", accetti le nostre{" "}
                <span className="font-bold text-primary underline underline-offset-4 cursor-pointer">
                  Condizioni del Servizio
                </span>{" "}
                e la{" "}
                <span className="font-bold text-primary underline underline-offset-4 cursor-pointer">
                  Politica di Cancellazione
                </span>{" "}
                dell'Host.
              </div>

              {/* BOTTONE PAGA DINAMICO */}
              <Button
                type="submit"
                disabled={isProcessing}
                size="lg"
                className="w-full h-16 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Elaborazione in corso...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" /> Paga €
                    {totalPrice.toFixed(2)} e prenota
                  </>
                )}
              </Button>
            </section>
          </form>
        </div>

        {/* =========================================
            COLONNA DESTRA: RIEPILOGO STICKY DINAMICO
            ========================================= */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-2xl shadow-border/10 overflow-hidden">
            {/* Miniatura Spazio Dinamica */}
            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border/50">
              <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0 border border-border/50 bg-muted">
                <Image
                  src={space.imageUrls[0]}
                  alt={space.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {formatSpaceType(space.type)}
                </span>
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
                  {space.title}
                </h3>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                  <span>{space.rating}</span>
                  <span className="text-muted-foreground font-medium">
                    ({space.reviewsCount})
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Prezzo Dinamico */}
            <h4 className="text-xl font-bold tracking-tight mb-6">
              Dettagli del prezzo
            </h4>
            <div className="space-y-4 mb-6 text-base">
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">{priceLabel}</span>
                <span className="font-bold text-foreground">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground underline underline-offset-4 cursor-help">
                  Costi di servizio CoW
                </span>
                <span className="font-bold text-foreground">€0,00</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-dashed border-border/50 mb-8">
              <span className="text-xl font-bold">Totale (EUR)</span>
              <span className="text-3xl font-extrabold text-accent">
                €{totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Box Cancellazione */}
            <div className="bg-secondary/5 rounded-2xl p-5 border border-border/50 flex gap-3">
              <CalendarIcon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm mb-1">
                  Cancellazione gratuita prima di domani
                </h5>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Rimborso completo in caso di cancellazione fino a 24 ore prima
                  del check-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// WRAPPER PRINCIPALE CON SUSPENSE
export default function CheckoutPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background pb-20">
      <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/search"
            className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Annulla
          </Link>
          <div className="font-bold text-xl tracking-tight">
            Conferma e paga
          </div>
          <div className="w-24" />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-[50vh] items-center justify-center text-muted-foreground font-bold">
            Caricamento checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
