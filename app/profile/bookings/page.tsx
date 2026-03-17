"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // Aggiunto per l'immagine nello Sheet
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Download,
  Star,
  Receipt,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

export default function BookingsPage() {
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-4xl mx-auto px-6 pt-8 md:pt-12">
        {/* Pulsante Indietro */}
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Profilo
        </Link>

        <Tabs defaultValue="in-arrivo" className="w-full">
          {/* Intestazione e Controlli Tab */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Le mie prenotazioni
              </h1>
              <p className="text-muted-foreground font-medium mt-2">
                Gestisci i tuoi prossimi spazi o rivedi lo storico.
              </p>
            </div>

            {/* Veri Tab interattivi di Shadcn */}
            <TabsList className="flex bg-background border border-border/50 rounded-xl p-1 shadow-sm h-auto w-fit">
              <TabsTrigger
                value="in-arrivo"
                className="px-5 py-2 rounded-lg font-bold text-sm text-muted-foreground data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:shadow-none transition-colors"
              >
                In arrivo
              </TabsTrigger>
              <TabsTrigger
                value="passate"
                className="px-5 py-2 rounded-lg font-bold text-sm text-muted-foreground data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:shadow-none transition-colors"
              >
                Passate
              </TabsTrigger>
            </TabsList>
          </div>

          {/* =========================================
              CONTENUTO: IN ARRIVO
              ========================================= */}
          <TabsContent
            value="in-arrivo"
            className="mt-0 flex flex-col gap-6 focus-visible:outline-none"
          >
            {/* CARD 1 (CON SHEET) */}
            <Sheet>
              <div className="bg-background rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/50 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent" />

                <div className="bg-accent/10 rounded-2xl w-24 h-24 flex flex-col items-center justify-center shrink-0 border border-accent/20">
                  <span className="text-sm font-bold text-accent uppercase tracking-widest">
                    Ott
                  </span>
                  <span className="text-3xl font-bold text-foreground leading-none mt-1">
                    15
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Sala Meeting
                    </div>
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                      Confermata
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">
                    Hub Innovazione Milano
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" /> 09:00 - 13:00 (4
                      ore)
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" /> Via Roma 10,
                      Milano
                    </span>
                  </div>
                </div>

                {/* I bottoni ora sono Trigger per aprire lo Sheet */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border/50 md:pl-6">
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl font-bold border-border/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                    >
                      Gestisci
                    </Button>
                  </SheetTrigger>
                </div>
              </div>

              {/* SHEET CONTENUTO - CARD 1 */}
              <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/50 overflow-y-auto z-[100] p-0 flex flex-col">
                <SheetHeader className="text-left pt-8 px-6 sm:px-8 mb-6">
                  <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-widest w-fit mb-4">
                    Confermata
                  </div>
                  <SheetTitle className="text-3xl font-bold tracking-tight">
                    Dettagli sessione
                  </SheetTitle>
                  <SheetDescription className="text-base font-medium">
                    Tutto pronto per la tua giornata all'Hub Innovazione Milano.
                  </SheetDescription>
                </SheetHeader>

                <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                      alt="Space"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="bg-secondary/5 border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                        Data e Ora
                      </span>
                      <span className="font-bold text-foreground">
                        Giovedì 15 Ottobre • 09:00 - 13:00
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                        Indirizzo
                      </span>
                      <span className="font-bold text-foreground">
                        Via Roma 10, Piano 2<br />
                        20121 Milano
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                        Codice Prenotazione
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        #COW-98234-MIL
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-y border-border/50 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full border border-border/50 bg-secondary/20 overflow-hidden shadow-sm">
                        <Image
                          src="https://github.com/shadcn.png"
                          alt="Host"
                          width={48}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          Ospitato da Copernico
                        </p>
                        <p className="text-xs text-muted-foreground font-medium text-accent">
                          Superhost
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                    >
                      <Receipt className="h-5 w-5 text-muted-foreground" />{" "}
                      Scarica Ricevuta
                    </Button>
                    <Link href="/spaces/1" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                      >
                        <MapPin className="h-5 w-5 text-muted-foreground" />{" "}
                        Rivedi annuncio
                      </Button>
                    </Link>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-4 shadow-sm"
                      >
                        <AlertTriangle className="h-5 w-5" /> Cancella
                        Prenotazione
                      </Button>
                    </SheetClose>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center font-medium pt-2">
                    Cancellazione gratuita disponibile fino al 14 Ottobre alle
                    09:00.
                  </p>
                </div>
              </SheetContent>
            </Sheet>

            {/* CARD 2 (CON SHEET) */}
            <Sheet>
              <div className="bg-background rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/50 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent" />

                <div className="bg-accent/10 rounded-2xl w-24 h-24 flex flex-col items-center justify-center shrink-0 border border-accent/20">
                  <span className="text-sm font-bold text-accent uppercase tracking-widest">
                    Ott
                  </span>
                  <span className="text-3xl font-bold text-foreground leading-none mt-1">
                    22
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Flex Desk
                    </div>
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-md">
                      Confermata
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Copernico Centrale</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" /> Intera Giornata
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" /> Via Copernico
                      38, Milano
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border/50 md:pl-6">
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl font-bold border-border/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                    >
                      Gestisci
                    </Button>
                  </SheetTrigger>
                </div>
              </div>

              {/* SHEET CONTENUTO - CARD 2 */}
              <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/50 overflow-y-auto z-[100] p-0 flex flex-col">
                <SheetHeader className="text-left pt-8 px-6 sm:px-8 mb-6">
                  <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-widest w-fit mb-4">
                    Confermata
                  </div>
                  <SheetTitle className="text-3xl font-bold tracking-tight">
                    Dettagli sessione
                  </SheetTitle>
                  <SheetDescription className="text-base font-medium">
                    Tutto pronto per la tua giornata al Copernico Centrale.
                  </SheetDescription>
                </SheetHeader>

                <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80"
                      alt="Space"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="bg-secondary/5 border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                        Data e Ora
                      </span>
                      <span className="font-bold text-foreground">
                        Giovedì 22 Ottobre • 09:00 - 18:00
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                        Indirizzo
                      </span>
                      <span className="font-bold text-foreground">
                        Via Copernico 38, Piano Terra
                        <br />
                        20125 Milano
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                        Codice Prenotazione
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        #COW-11456-MIL
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-y border-border/50 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full border border-border/50 bg-secondary/20 overflow-hidden shadow-sm">
                        <Image
                          src="https://github.com/shadcn.png"
                          alt="Host"
                          width={48}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          Ospitato da Copernico
                        </p>
                        <p className="text-xs text-muted-foreground font-medium text-accent">
                          Superhost
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                    >
                      <Receipt className="h-5 w-5 text-muted-foreground" />{" "}
                      Scarica Ricevuta
                    </Button>
                    <Link href="/spaces/2" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                      >
                        <MapPin className="h-5 w-5 text-muted-foreground" />{" "}
                        Rivedi annuncio
                      </Button>
                    </Link>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-4 shadow-sm"
                      >
                        <AlertTriangle className="h-5 w-5" /> Cancella
                        Prenotazione
                      </Button>
                    </SheetClose>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center font-medium pt-2">
                    Cancellazione gratuita disponibile fino al 21 Ottobre alle
                    09:00.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </TabsContent>

          {/* =========================================
              CONTENUTO: PASSATE (STORICO)
              ========================================= */}
          <TabsContent
            value="passate"
            className="mt-0 flex flex-col gap-6 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Storico Recente
              </h2>
            </div>

            <div className="flex flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
              {/* Card Passata */}
              <div className="bg-background rounded-3xl p-5 shadow-sm border border-border/40 flex flex-col md:flex-row items-start md:items-center gap-6 grayscale hover:grayscale-0 transition-all">
                <div className="bg-muted rounded-xl w-16 h-16 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Set
                  </span>
                  <span className="text-xl font-bold text-foreground leading-none mt-1">
                    05
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-bold">Talent Garden Calabiana</h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ufficio Privato (2 posti) • 1 giorno
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl font-bold border-border/50 gap-2 h-10"
                  >
                    <Download className="h-4 w-4" /> Ricevuta
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 rounded-xl font-bold gap-2 h-10"
                  >
                    <Star
                      className="h-4 w-4 text-primary"
                      fill="currentColor"
                    />{" "}
                    Recensisci
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
