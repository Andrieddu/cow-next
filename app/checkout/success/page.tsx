"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Key,
  Wifi,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-secondary/5 py-12 md:py-20 px-6">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* 1. ICONA E MESSAGGIO DI SUCCESSO */}
        <div className="h-24 w-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-500/20">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-4">
          Prenotazione confermata!
        </h1>
        <p className="text-muted-foreground text-center font-medium text-lg mb-10 max-w-md">
          Hai appena prenotato il tuo spazio di lavoro. Ti abbiamo inviato una
          ricevuta all'indirizzo{" "}
          <span className="font-bold text-foreground">
            andrea.lai@esempio.com
          </span>
          .
        </p>

        {/* 2. CARD RIEPILOGO */}
        <div className="w-full bg-background rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-border/50 mb-8">
          {/* Header Card: Codice Prenotazione */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-border/50 gap-4">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Codice Prenotazione
              </span>
              <p className="text-xl font-mono font-bold text-foreground mt-1">
                #COW-98234-MIL
              </p>
            </div>
            <Link href="/profile/bookings">
              <Button
                variant="outline"
                className="rounded-xl font-bold border-border/50 shadow-sm h-11"
              >
                Vedi nei tuoi viaggi
              </Button>
            </Link>
          </div>

          {/* Dettagli Spazio */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-border/50 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                alt="Hub Innovazione Milano"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-fit">
                Sala Meeting
              </div>
              <h3 className="text-2xl font-bold leading-tight">
                Hub Innovazione Milano
              </h3>
              <div className="flex flex-col gap-2 mt-2 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-accent" /> Giovedì 15
                  Ottobre 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" /> 09:00 - 13:00
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" /> Via Roma 10, Piano
                  2, Milano
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50 mb-8" />

          {/* 3. ISTRUZIONI DI ACCESSO (Valore aggiunto per l'utente) */}
          <h4 className="text-xl font-bold tracking-tight mb-6">
            Informazioni utili
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex gap-4 p-5 rounded-2xl bg-secondary/5 border border-border/50">
              <Key className="h-6 w-6 text-accent shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">Accesso alla porta</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">
                  Il codice del tastierino è:{" "}
                  <strong className="text-foreground">4920#</strong>
                </span>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-2xl bg-secondary/5 border border-border/50">
              <Wifi className="h-6 w-6 text-accent shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">Rete WiFi</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">
                  Hub_Guest <br /> Pass:{" "}
                  <strong className="text-foreground">WorkHard2026</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Contatta l'host */}
          <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-border/40 bg-background">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-border/50 overflow-hidden shrink-0">
                <Image
                  src="https://github.com/shadcn.png"
                  alt="Host"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Host: Copernico</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Risponde in 1 ora
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent h-10 w-10"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 4. BOTTONI FINALI */}
        <div className="flex flex-col sm:flex-row items-center w-full gap-4">
          <Link href="/search" className="w-full">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl font-bold text-base border-border/50 hover:bg-secondary/10 hover:text-accent shadow-sm"
            >
              Esplora altri spazi
            </Button>
          </Link>
          <Link href="/profile/bookings" className="w-full">
            <Button className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2">
              Le mie prenotazioni <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
