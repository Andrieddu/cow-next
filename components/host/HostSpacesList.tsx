"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
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

// IMPORTIAMO I COMPONENTI TABS DI SHADCN
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper per tradurre il tipo di spazio
const formatSpaceType = (type: string) => {
  const types: Record<string, string> = {
    DESK: "Scrivania",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    EVENT_SPACE: "Spazio Eventi",
  };
  return types[type] || type;
};

export default function HostSpacesList({ spaces }: { spaces: any[] }) {
  // Stato per gestire il tab attivo ("all", "active", "draft")
  const [filter, setFilter] = useState("all");

  // Stato per la barra di ricerca testuale
  const [searchQuery, setSearchQuery] = useState("");

  // Filtriamo i dati istantaneamente lato client
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      // 1. Filtro per Tab
      if (filter === "active" && !space.isActive) return false;
      if (filter === "draft" && space.isActive) return false;

      // 2. Filtro per Ricerca Testuale
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !space.title.toLowerCase().includes(query) &&
          !space.city.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [spaces, filter, searchQuery]);

  return (
    <>
      {/* FILTRI E RICERCA */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
        {/* Barra di ricerca */}
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome o città..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 rounded-2xl bg-background border-border/50 shadow-sm font-medium"
          />
        </div>

        {/* TABS SUPER ELEGANTI */}
        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 flex md:justify-end">
          <Tabs
            defaultValue="all"
            value={filter}
            onValueChange={setFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-background border border-border/50 rounded-2xl p-1 h-12 flex">
              <TabsTrigger
                value="all"
                className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-accent/10 data-[state=active]:text-accent text-muted-foreground hover:text-foreground flex-1 md:flex-none"
              >
                Tutti
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-accent/10 data-[state=active]:text-accent text-muted-foreground hover:text-foreground flex-1 md:flex-none"
              >
                Attivi
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="rounded-xl px-6 font-bold transition-all data-[state=active]:bg-accent/10 data-[state=active]:text-accent text-muted-foreground hover:text-foreground flex-1 md:flex-none"
              >
                Bozze
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* LISTA ANNUNCI */}
      <div className="grid grid-cols-1 gap-6">
        {filteredSpaces.length === 0 ? (
          <div className="bg-background rounded-[2rem] p-12 text-center shadow-sm border border-border/50">
            <p className="text-muted-foreground font-bold text-lg mb-4">
              Nessuno spazio trovato con questi filtri.
            </p>
            {filter !== "all" || searchQuery !== "" ? (
              <Button
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
                variant="outline"
                className="rounded-xl font-bold shadow-sm border-border/50"
              >
                Rimuovi filtri
              </Button>
            ) : (
              <Link href="/host/create">
                <Button className="rounded-xl font-bold shadow-md">
                  Inizia subito
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredSpaces.map((space) => {
            // Calcoli al volo
            const totalEarnings = space.bookings
              .filter(
                (b: any) =>
                  b.status === "CONFIRMED" || b.status === "COMPLETED",
              )
              .reduce((sum: number, b: any) => sum + b.totalPrice, 0);

            const totalBookings = space.bookings.length;

            const averageRating =
              space.reviews.length > 0
                ? space.reviews.reduce(
                    (sum: number, r: any) => sum + r.rating,
                    0,
                  ) / space.reviews.length
                : 0;

            return (
              <div
                key={space.id}
                className="bg-background rounded-[2rem] p-4 md:p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Immagine */}
                  <div className="relative h-48 lg:h-40 w-full lg:w-64 rounded-2xl overflow-hidden shrink-0 border border-border/50 bg-muted">
                    <Image
                      src={
                        space.imageUrls[0] ||
                        "https://images.unsplash.com/photo-1497366216548-37526070297c"
                      }
                      alt={space.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={
                          space.isActive
                            ? "bg-green-500 hover:bg-green-600 border-none text-white font-bold"
                            : "bg-yellow-500 hover:bg-yellow-600 border-none text-white font-bold"
                        }
                      >
                        {space.isActive ? "Attivo" : "Bozza"}
                      </Badge>
                    </div>
                  </div>

                  {/* Info Principali */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                            {formatSpaceType(space.type)}
                          </span>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {space.title}
                          </h3>
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {space.address},{" "}
                            {space.city}
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
                            <Link href={`/host/edit/${space.id}`}>
                              <DropdownMenuItem className="rounded-lg font-bold gap-2 cursor-pointer">
                                <Edit3 className="h-4 w-4" /> Modifica
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/space/${space.id}`}>
                              <DropdownMenuItem className="rounded-lg font-bold gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> Vedi annuncio
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="rounded-lg font-bold gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="h-4 w-4" /> Elimina
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-sm font-bold">
                          <Star className="h-4 w-4 text-primary fill-primary" />
                          {averageRating > 0
                            ? averageRating.toFixed(2)
                            : "Nuovo"}
                          {space.reviews.length > 0 && (
                            <span className="text-muted-foreground font-medium">
                              ({space.reviews.length})
                            </span>
                          )}
                        </div>
                        <div className="h-4 w-px bg-border/50" />
                        <div className="text-sm font-bold flex gap-2">
                          {space.hourlyPrice && (
                            <span>
                              €{space.hourlyPrice}{" "}
                              <span className="text-muted-foreground font-medium text-xs">
                                /ora
                              </span>
                            </span>
                          )}
                          {space.hourlyPrice && space.dailyPrice && (
                            <span className="text-muted-foreground font-medium">
                              •
                            </span>
                          )}
                          {space.dailyPrice && (
                            <span>
                              €{space.dailyPrice}{" "}
                              <span className="text-muted-foreground font-medium text-xs">
                                /giorno
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistiche & Azioni */}
                  <div className="flex flex-col justify-center gap-4 shrink-0 lg:w-72 lg:pl-6 lg:border-l border-border/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-secondary/5 rounded-2xl p-3 border border-border/50 text-center flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                          Guadagni
                        </span>
                        <span className="text-base font-extrabold text-foreground">
                          € {totalEarnings.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-secondary/5 rounded-2xl p-3 border border-border/50 text-center flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
                          Prenotazioni
                        </span>
                        <span className="text-base font-extrabold text-foreground">
                          {totalBookings}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <Link href={`/host/edit/${space.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="rounded-xl font-bold border-border/50 w-full gap-2 px-0 shadow-sm"
                        >
                          <Edit3 className="h-4 w-4" /> Modifica
                        </Button>
                      </Link>
                      <Link href={`/space/${space.id}`} className="flex-1">
                        <Button
                          variant="ghost"
                          className="w-full rounded-xl font-bold text-accent bg-accent/10 hover:bg-accent/20 gap-2 px-0"
                        >
                          Dettagli <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
