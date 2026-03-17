"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Star,
  MoreVertical,
  Search,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- DATI MOCKUP ANNUNCI ---
const myListing = [
  {
    id: "1",
    title: "Sala Meeting Galileo",
    type: "Sala Meeting",
    location: "Porta Nuova, Milano",
    price: 45,
    rating: 4.92,
    reviews: 128,
    status: "Attivo",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
    earnings: "€ 4.250",
    bookings: 42,
  },
  {
    id: "2",
    title: "Flex Desk Centrale",
    type: "Scrivania",
    location: "Stazione Centrale, Milano",
    price: 25,
    rating: 4.85,
    reviews: 86,
    status: "Attivo",
    image:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80",
    earnings: "€ 2.100",
    bookings: 64,
  },
  {
    id: "3",
    title: "Ufficio Privato 'The View'",
    type: "Ufficio",
    location: "CityLife, Milano",
    price: 120,
    rating: 0,
    reviews: 0,
    status: "Bozza",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80",
    earnings: "€ 0",
    bookings: 0,
  },
];

export default function HostListingPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER (Senza bordo inferiore) */}
      <div className="bg-background sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              I miei annunci
            </h1>
          </div>

          <Link href="/host/create">
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-11">
              <Plus className="h-5 w-5" />{" "}
              <span className="hidden sm:inline">Crea nuovo</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        {/* 2. FILTRI E RICERCA */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca tra i tuoi spazi..."
              className="pl-11 h-12 rounded-2xl bg-background border-border/50 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button
              variant="secondary"
              className="rounded-full font-bold px-6 h-10"
            >
              Tutti
            </Button>
            <Button
              variant="ghost"
              className="rounded-full font-bold px-6 h-10 text-muted-foreground"
            >
              Attivi
            </Button>
            <Button
              variant="ghost"
              className="rounded-full font-bold px-6 h-10 text-muted-foreground"
            >
              Bozze
            </Button>
          </div>
        </div>

        {/* 3. LISTA ANNUNCI */}
        <div className="grid grid-cols-1 gap-6">
          {myListing.map((item) => (
            <div
              key={item.id}
              className="bg-background rounded-[2rem] p-4 md:p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Immagine */}
                <div className="relative h-48 lg:h-40 w-full lg:w-64 rounded-2xl overflow-hidden shrink-0 border border-border/50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={
                        item.status === "Attivo"
                          ? "bg-green-500 border-none"
                          : "bg-yellow-500 border-none"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {/* Info Principali */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                          {item.type}
                        </span>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {item.location}
                        </p>
                      </div>

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
                          className="rounded-xl p-2 border-border/50 shadow-xl"
                        >
                          <DropdownMenuItem className="rounded-lg font-bold gap-2 cursor-pointer">
                            <Edit3 className="h-4 w-4" /> Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-bold gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" /> Vedi annuncio
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-bold gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="h-4 w-4" /> Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        {item.rating > 0 ? item.rating : "Nuovo"}
                        {item.reviews > 0 && (
                          <span className="text-muted-foreground font-medium">
                            ({item.reviews})
                          </span>
                        )}
                      </div>
                      <div className="h-4 w-px bg-border/50" />
                      <div className="text-sm font-bold">
                        €{item.price}
                        <span className="text-muted-foreground font-medium text-xs">
                          {" "}
                          /ora
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiche Rapide */}
                <div className="grid grid-cols-2 lg:flex lg:flex-col lg:w-48 gap-3 lg:pl-6 lg:border-l border-border/50">
                  <div className="bg-secondary/5 rounded-2xl p-4 border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Guadagni
                    </span>
                    <span className="text-lg font-extrabold text-foreground">
                      {item.earnings}
                    </span>
                  </div>
                  <div className="bg-secondary/5 rounded-2xl p-4 border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                      Prenotazioni
                    </span>
                    <span className="text-lg font-extrabold text-foreground">
                      {item.bookings}
                    </span>
                  </div>
                </div>

                {/* Azione Mobile/Desktop laterale */}
                <div className="flex items-center gap-2 lg:flex-col justify-end">
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold border-border/50 flex-1 lg:w-full gap-2"
                  >
                    <Edit3 className="h-4 w-4" /> Modifica
                  </Button>
                  <Link
                    href={`/spaces/${item.id}`}
                    className="flex-1 lg:w-full"
                  >
                    <Button
                      variant="ghost"
                      className="w-full rounded-xl font-bold text-accent gap-2"
                    >
                      Dettagli <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. FOOTER AZIONI */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-6">
            Hai altri spazi da aggiungere alla tua collezione?
          </p>
          <Link href="/host/create">
            <Button
              variant="outline"
              className="rounded-2xl h-16 px-10 font-bold border-2 border-dashed border-accent/50 text-accent hover:bg-accent/5 transition-all"
            >
              Aggiungi un altro spazio di lavoro
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
