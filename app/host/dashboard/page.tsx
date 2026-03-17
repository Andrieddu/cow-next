"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Calendar as CalendarIcon,
  MessageSquare,
  Star,
  Plus,
  Check,
  X,
  ArrowRight,
  MoreHorizontal,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HostDashboardPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER DELLA DASHBOARD */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Dashboard Host
            </h1>
            <Badge className="hidden md:inline-flex bg-accent/10 text-accent border-none font-bold uppercase tracking-widest text-[10px]">
              Modalità Host
            </Badge>
          </div>
          <Link href="/profile">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-bold border-border/50"
            >
              Passa a Viaggiatore
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        {/* 2. STATISTICHE MENSILI (Top riga) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Guadagni */}
          <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Guadagni (Marzo)
              </span>
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                € 1.240
              </h2>
              <p className="text-sm font-medium text-green-600 mt-1 flex items-center gap-1">
                +14%{" "}
                <span className="text-muted-foreground">
                  rispetto a febbraio
                </span>
              </p>
            </div>
          </div>

          {/* Prenotazioni - ORA CLICCABILE */}
          <Link href="/host/bookings" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Prenotazioni
                </span>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  12
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vai alle prenotazioni <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>

          {/* Messaggi nella Dashboard - Ora cliccabile */}
          <Link href="/messages" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Messaggi
                </span>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  2
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vai alla posta <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>

          {/* Valutazione Media - Cliccabile */}
          <Link href="/host/reviews" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Valutazione
                </span>
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  4.92
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vai alle recensioni <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* 3. LAYOUT PRINCIPALE A DUE COLONNE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNA SINISTRA: Richieste e Attività */}
          <div className="lg:col-span-8 space-y-10">
            {/* Sezione Richieste in sospeso */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">
                  Richieste in sospeso (1)
                </h3>
              </div>

              <div className="bg-background rounded-[2rem] p-6 shadow-sm border-2 border-accent/20 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent" />

                <div className="flex flex-col items-center gap-2 shrink-0 sm:w-24">
                  <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                    <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-bold text-center">
                    Marco R.
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                    <Star className="h-3 w-3 fill-primary text-primary" /> 5.0
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Sala Meeting Galileo</h4>
                    <span className="font-extrabold text-lg text-accent">
                      € 180
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" /> Lun 20 Marzo • 09:00
                      - 13:00 (4 ore)
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> 4 Ospiti previsti
                    </span>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-xl text-sm font-medium italic text-foreground mb-6">
                    "Ciao! Avremmo bisogno della sala per un brainstorming con
                    un cliente. È possibile avere un monitor extra?"
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-xl font-bold gap-2 shadow-md shadow-accent/20 flex-1 sm:flex-none">
                      <Check className="h-4 w-4" /> Accetta
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl font-bold gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4" /> Rifiuta
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-xl font-bold text-muted-foreground"
                    >
                      Rispondi
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sezione Arrivi di Oggi / Prossimi */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">
                  Arrivi di oggi
                </h3>
                <Link
                  href="/host/calendar"
                  className="text-sm font-bold text-accent hover:underline"
                >
                  Vedi calendario
                </Link>
              </div>

              <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-secondary/10 rounded-2xl w-16 h-16 flex flex-col items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-lg mb-1">Giulia Bianchi</h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    Flex Desk Centrale • 14:00 - 18:00
                  </p>
                </div>
                {/* ECCO L'ARROW RIGHT USATO */}
                <Button
                  variant="outline"
                  className="rounded-xl font-bold border-border/50 w-full sm:w-auto gap-2"
                >
                  Vedi dettagli{" "}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </section>
          </div>

          {/* COLONNA DESTRA: I tuoi Spazi */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold tracking-tight">
                I tuoi spazi
              </h3>
              <Link
                href="/host/listing"
                className="text-sm font-bold text-accent hover:underline underline-offset-4"
              >
                Vedi tutti
              </Link>
            </div>

            <Link href="/host/create" className="block">
              <Button
                variant="outline"
                className="w-full h-16 rounded-2xl border-2 border-dashed border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-bold text-base gap-2 transition-all"
              >
                <Plus className="h-5 w-5" /> Aggiungi un nuovo spazio
              </Button>
            </Link>

            <div className="flex flex-col gap-4">
              {/* Spazio 1 */}
              <div className="bg-background border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border border-border/50">
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                    alt="Sala Galileo"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold truncate text-foreground group-hover:text-accent transition-colors">
                    Sala Meeting Galileo
                  </h4>
                  {/* ECCO IL MAP PIN USATO */}
                  <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[11px] font-medium truncate">
                      Porta Nuova, Milano
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-muted-foreground">
                      Attivo
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>

              {/* Spazio 2 */}
              <div className="bg-background border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border border-border/50">
                  <Image
                    src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80"
                    alt="Flex Desk"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold truncate text-foreground group-hover:text-accent transition-colors">
                    Flex Desk Centrale
                  </h4>
                  {/* ECCO IL MAP PIN USATO */}
                  <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[11px] font-medium truncate">
                      Stazione Centrale, Milano
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-muted-foreground">
                      Attivo
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
