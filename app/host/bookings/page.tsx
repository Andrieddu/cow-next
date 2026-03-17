"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Download,
  ChevronDown,
  CheckCircle2,
  Clock3,
  AlertCircle,
  MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- DATI MOCKUP PRENOTAZIONI ---
const allBookings = [
  {
    id: "BK-9921",
    user: "Marco Rossi",
    avatar: "https://i.pravatar.cc/150?img=32",
    space: "Sala Meeting Galileo",
    date: "20 Marzo 2026",
    time: "09:00 - 13:00",
    guests: 4,
    amount: "€ 180,00",
    status: "Confermata",
  },
  {
    id: "BK-9854",
    user: "Giulia Bianchi",
    avatar: "https://i.pravatar.cc/150?img=44",
    space: "Flex Desk Centrale",
    date: "16 Marzo 2026",
    time: "14:00 - 18:00",
    guests: 1,
    amount: "€ 25,00",
    status: "In corso",
  },
  {
    id: "BK-9712",
    user: "Alessandro Neri",
    avatar: "https://i.pravatar.cc/150?img=68",
    space: "Ufficio Privato 'The View'",
    date: "10 Marzo 2026",
    time: "09:00 - 18:00",
    guests: 2,
    amount: "€ 120,00",
    status: "Completata",
  },
  {
    id: "BK-9600",
    user: "Elena Light",
    avatar: "https://i.pravatar.cc/150?img=22",
    space: "Sala Meeting Galileo",
    date: "05 Marzo 2026",
    time: "10:00 - 12:00",
    guests: 6,
    amount: "€ 90,00",
    status: "Cancellata",
  },
];

export default function HostBookingsPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER */}
      <div className="bg-background sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Prenotazioni
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-xl font-bold border-border/50 gap-2 h-11"
          >
            <Download className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Esporta CSV</span>
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        {/* 2. FILTRI E STATS RAPIDE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca ospite o ID prenotazione..."
                className="pl-11 h-11 rounded-xl bg-background border-border/50"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-xl font-bold border-border/50 gap-2 h-11"
            >
              <Filter className="h-4 w-4" /> Stato{" "}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-around bg-background rounded-2xl p-2 border border-border/50 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Totali
              </p>
              <p className="text-lg font-bold">124</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Mese
              </p>
              <p className="text-lg font-bold">12</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-accent">
                Attive
              </p>
              <p className="text-lg font-bold text-accent">3</p>
            </div>
          </div>
        </div>

        {/* 3. LISTA PRENOTAZIONI */}
        <div className="space-y-4">
          {allBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-background rounded-[2rem] p-5 md:p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Ospite */}
                <div className="flex items-center gap-4 lg:w-64 shrink-0">
                  <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                    <AvatarImage src={booking.avatar} />
                    <AvatarFallback>{booking.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-base leading-tight">
                      {booking.user}
                    </h4>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {booking.id}
                    </p>
                  </div>
                </div>

                {/* Dettagli Spazio e Data */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Spazio prenotato
                    </span>
                    <span className="font-bold text-sm flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-accent" />{" "}
                      {booking.space}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Data e Orario
                    </span>
                    <span className="font-medium text-sm flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                      {booking.date}
                      <Clock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />{" "}
                      {booking.time}
                    </span>
                  </div>
                </div>

                {/* Ospiti e Prezzo */}
                <div className="flex items-center gap-8 lg:w-48 shrink-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Persone
                    </span>
                    <span className="font-bold text-sm flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> {booking.guests}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Totale
                    </span>
                    <span className="font-extrabold text-sm text-foreground">
                      {booking.amount}
                    </span>
                  </div>
                </div>

                {/* Stato e Azioni */}
                <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-48 shrink-0">
                  <Badge
                    className={cn(
                      "rounded-lg px-3 py-1 font-bold text-[10px] uppercase border-none",
                      booking.status === "Confermata" &&
                        "bg-green-100 text-green-700",
                      booking.status === "In corso" &&
                        "bg-blue-100 text-blue-700",
                      booking.status === "Completata" &&
                        "bg-secondary text-muted-foreground",
                      booking.status === "Cancellata" &&
                        "bg-destructive/10 text-destructive",
                    )}
                  >
                    {booking.status === "Confermata" && (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    {booking.status === "In corso" && (
                      <Clock3 className="h-3 w-3 mr-1" />
                    )}
                    {booking.status === "Cancellata" && (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {booking.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-border/50 shadow-xl"
                    >
                      <DropdownMenuItem className="font-bold cursor-pointer">
                        Vedi dettagli
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-bold cursor-pointer">
                        Contatta ospite
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-bold cursor-pointer">
                        Scarica fattura
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem className="font-bold cursor-pointer text-destructive">
                        Annulla prenotazione
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. PAGINAZIONE (Mockup) */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-8 font-bold border-border/50 shadow-sm hover:bg-background"
          >
            Carica altre prenotazioni
          </Button>
        </div>
      </div>
    </main>
  );
}
