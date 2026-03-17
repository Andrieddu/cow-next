"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Edit2,
  LogOut,
  Clock,
  Receipt,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        {/* =========================================
            1. HEADER PROFILO
            ========================================= */}
        <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-secondary/20 flex items-center justify-center">
              <Image
                src="https://avatars.githubusercontent.com/u/75944229?v=4"
                alt="Andrea Lai"
                width={128}
                height={128}
                className="object-cover"
                unoptimized
              />
            </div>
            <button className="absolute bottom-0 right-0 h-10 w-10 bg-background rounded-full border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-accent transition-colors">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-widest mb-3">
              Membro Pro
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              Andrea Lai
            </h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 opacity-70" /> Milano, Italia
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-64 mt-4 md:mt-0">
            <Link href="/host/dashboard" className="w-full">
              <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Passa a Modalità Host
              </Button>
            </Link>

            <Link href="/messages" className="w-full">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-secondary/10 hover:text-accent transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5 text-accent" />
                Messaggi
              </Button>
            </Link>

            <Link href="/profile/settings" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-secondary/10 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2"
              >
                <Settings className="h-5 w-5 text-accent" />
                Impostazioni
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Esci
            </Button>
          </div>
        </div>

        {/* =========================================
            2. GRIGLIA CONTENUTI
            ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLONNA SINISTRA */}
          <div className="flex flex-col gap-8">
            {/* Dati Personali */}
            <div className="bg-background rounded-[2.5rem] p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-bold tracking-tight mb-6">
                Dati Personali
              </h3>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                    Email
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" />{" "}
                    andrea.lai@esempio.com
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                    Telefono
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent" /> +39 333 123 4567
                  </span>
                </div>
              </div>
            </div>

            {/* Diventa Host */}
            <div className="bg-accent/5 border border-accent/20 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-colors duration-500" />
              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground relative z-10">
                Hai uno spazio libero?
              </h3>
              <p className="text-muted-foreground font-medium text-sm mb-6 relative z-10">
                Metti a rendita la tua scrivania o sala meeting. Diventa Host e
                inizia a guadagnare oggi stesso.
              </p>
              <Link href="/host/create" className="relative z-10 w-full block">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-bold border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
                >
                  Aggiungi uno spazio
                </Button>
              </Link>
            </div>
          </div>

          {/* COLONNA DESTRA: Le mie prenotazioni */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Prossime Prenotazioni
              </h2>
              <Link
                href="/profile/bookings"
                className="text-sm font-bold text-accent hover:underline underline-offset-4"
              >
                Vedi tutte
              </Link>
            </div>

            {/* =========================================
                CARD PRENOTAZIONE 1 (Con Sheet Integrato)
                ========================================= */}
            <Sheet>
              <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="bg-accent/10 rounded-2xl w-20 h-20 flex flex-col items-center justify-center shrink-0 border border-accent/20">
                  <span className="text-sm font-bold text-accent uppercase tracking-widest">
                    Ott
                  </span>
                  <span className="text-2xl font-bold text-foreground leading-none mt-1">
                    15
                  </span>
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Sala Meeting
                  </div>
                  <h4 className="text-lg font-bold mb-1">
                    Hub Innovazione Milano
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-accent" /> 09:00 - 13:00
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-accent" /> Via Roma 10,
                      Milano
                    </span>
                  </div>
                </div>

                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30 w-full sm:w-auto h-11"
                  >
                    Gestisci
                  </Button>
                </SheetTrigger>
              </div>

              {/* Contenuto Sheet - Prenotazione 1 */}
              <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/50 overflow-y-auto z-[100] p-0 flex flex-col">
                {/* Header: Titoli */}
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

                {/* Contenuto: Con Padding Laterale (px-8) */}
                <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
                  {/* Immagine */}
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                      alt="Space"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Dati Riepilogo */}
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

                  {/* Host Box */}
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

                  {/* Azioni Bottoni */}
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

            {/* =========================================
                CARD PRENOTAZIONE 2 (Con Sheet Integrato)
                ========================================= */}
            <Sheet>
              <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="bg-accent/10 rounded-2xl w-20 h-20 flex flex-col items-center justify-center shrink-0 border border-accent/20">
                  <span className="text-sm font-bold text-accent uppercase tracking-widest">
                    Ott
                  </span>
                  <span className="text-2xl font-bold text-foreground leading-none mt-1">
                    22
                  </span>
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Flex Desk
                  </div>
                  <h4 className="text-lg font-bold mb-1">Copernico Centrale</h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-accent" /> Intera Giornata
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-accent" /> Via Copernico
                      38, Milano
                    </span>
                  </div>
                </div>

                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30 w-full sm:w-auto h-11"
                  >
                    Gestisci
                  </Button>
                </SheetTrigger>
              </div>

              {/* Contenuto Sheet - Prenotazione 2 */}
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
                </div>
              </SheetContent>
            </Sheet>

            {/* Box Vuoto / Esplora */}
            <div className="mt-4 rounded-[2rem] border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="text-lg font-bold mb-2">
                Pianifica la tua prossima sessione
              </h4>
              <p className="text-muted-foreground font-medium mb-6 max-w-sm">
                Trova lo spazio perfetto per le tue esigenze e prenota in pochi
                click.
              </p>
              <Link href="/search">
                <Button className="rounded-xl font-bold shadow-sm h-11 px-8">
                  Cerca uno spazio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
