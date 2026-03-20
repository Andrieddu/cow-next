"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Star, Search, SlidersHorizontal, Clock } from "lucide-react";

// Helper per tradurre l'enum Prisma in italiano
const formatSpaceType = (type: string) => {
  const types: Record<string, string> = {
    DESK: "Scrivania Singola",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    EVENT_SPACE: "Spazio Eventi",
  };
  return types[type] || type;
};

// Filtri allineati allo schema Prisma
const spaceTypesFilter = [
  { label: "Scrivania Singola", value: "DESK" },
  { label: "Ufficio Privato", value: "PRIVATE_OFFICE" },
  { label: "Sala Meeting", value: "MEETING_ROOM" },
  { label: "Spazio Eventi", value: "EVENT_SPACE" },
];

const amenitiesFilter = [
  "WiFi Fibra",
  "Aria Condizionata",
  "Caffè e Acqua",
  "Stampante/Scanner",
  "Monitor Esterno",
  "Parcheggio privato",
];

// Il componente ora riceve gli spazi REALI dal Server Component
export default function SearchClient({
  initialSpaces,
}: {
  initialSpaces: any[];
}) {
  const searchParams = useSearchParams();
  const queryLocation = searchParams.get("q")?.toLowerCase() || "";

  const startTime = searchParams.get("start") || "09:00";
  const endTime = searchParams.get("end") || "10:00";

  const duration = useMemo(() => {
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);
    return Math.max(1, end - start);
  }, [startTime, endTime]);

  const getBookingPrice = useCallback(
    (space: any) => {
      if (space.hourlyPrice) return space.hourlyPrice * duration;
      return space.dailyPrice || 0;
    },
    [duration],
  );

  // --- STATI DEI FILTRI ---
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [maxHourly, setMaxHourly] = useState<number>(100);
  const [maxTotal, setMaxTotal] = useState<number>(500);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("consigliati");

  const filteredSpaces = useMemo(() => {
    const result = initialSpaces.filter((space) => {
      // (Il filtro testuale location è già gestito lato Server, ma lo teniamo per sicurezza)
      if (
        queryLocation &&
        !space.city.toLowerCase().includes(queryLocation) &&
        !space.address.toLowerCase().includes(queryLocation) &&
        !space.title.toLowerCase().includes(queryLocation)
      )
        return false;

      if (selectedTypes.length > 0 && !selectedTypes.includes(space.type))
        return false;

      if (space.hourlyPrice && space.hourlyPrice > maxHourly) return false;
      if (getBookingPrice(space) > maxTotal) return false;

      if (selectedAmenities.length > 0) {
        if (!selectedAmenities.every((a) => space.amenities?.includes(a)))
          return false;
      }
      return true;
    });

    result.sort((a, b) => {
      const ratingA =
        a.reviews.length > 0
          ? a.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
            a.reviews.length
          : 0;
      const ratingB =
        b.reviews.length > 0
          ? b.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
            b.reviews.length
          : 0;

      if (sortOrder === "prezzo-basso")
        return getBookingPrice(a) - getBookingPrice(b);
      if (sortOrder === "prezzo-alto")
        return getBookingPrice(b) - getBookingPrice(a);
      return ratingB - ratingA;
    });

    return result;
  }, [
    initialSpaces,
    queryLocation,
    selectedTypes,
    maxHourly,
    maxTotal,
    selectedAmenities,
    sortOrder,
    getBookingPrice,
  ]);

  const resetFilters = () => {
    setSelectedTypes([]);
    setMaxHourly(100);
    setMaxTotal(500);
    setSelectedAmenities([]);
    setSortOrder("consigliati");
  };

  return (
    <>
      {/* 1. HEADER MOBILE */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm py-4">
        <div className="container px-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex flex-1 items-center justify-between gap-3 bg-background border border-border/60 shadow-sm rounded-full pl-5 pr-2 py-2"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-sm font-bold text-foreground truncate capitalize">
                {queryLocation || "Ovunque"}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
              <span className="text-sm font-medium text-muted-foreground shrink-0">
                {duration}h
              </span>
            </div>
            <div className="bg-primary rounded-full p-2 shrink-0 ml-2">
              <Search className="h-4 w-4 text-primary-foreground stroke-[3]" />
            </div>
          </Link>
          <Button
            variant="outline"
            className="rounded-xl h-12 px-4 font-bold border-border/50"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* 2. SIDEBAR FILTRI */}
          <aside className="hidden lg:flex flex-col gap-8 sticky top-28 h-[calc(100vh-140px)] overflow-y-auto pr-4 pb-10 custom-scrollbar">
            <Link href="/">
              <div className="bg-background border border-border/50 shadow-sm rounded-[1.5rem] p-5 flex flex-col gap-3 group hover:border-accent/50 transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    La tua ricerca
                  </span>
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-foreground capitalize">
                    {queryLocation || "Ovunque"}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {startTime} - {endTime} ({duration}h)
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex items-center justify-between pt-2">
              <h2 className="text-xl font-bold tracking-tight">Filtra per</h2>
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-accent hover:underline"
              >
                Azzera
              </button>
            </div>

            <div className="space-y-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Prezzo Orario Max
                  </h3>
                  <span className="text-sm font-bold text-accent">
                    {maxHourly}€/h
                  </span>
                </div>
                <Slider
                  value={[maxHourly]}
                  onValueChange={(val) => setMaxHourly(val[0])}
                  max={100}
                  min={1}
                  step={1}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                    Prezzo Totale Max
                  </h3>
                  <span className="text-sm font-bold text-accent">
                    {maxTotal}€
                  </span>
                </div>
                <Slider
                  value={[maxTotal]}
                  onValueChange={(val) => setMaxTotal(val[0])}
                  max={500}
                  min={5}
                  step={5}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Tipo di spazio
              </h3>
              <div className="flex flex-col gap-3">
                {spaceTypesFilter.map((tipo) => (
                  <div key={tipo.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={tipo.value}
                      checked={selectedTypes.includes(tipo.value)}
                      onCheckedChange={() =>
                        setSelectedTypes((prev) =>
                          prev.includes(tipo.value)
                            ? prev.filter((t) => t !== tipo.value)
                            : [...prev, tipo.value],
                        )
                      }
                    />
                    <label
                      htmlFor={tipo.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {tipo.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Servizi Inclusi
              </h3>
              <div className="flex flex-col gap-3">
                {amenitiesFilter.map((s) => (
                  <div key={s} className="flex items-center space-x-3">
                    <Checkbox
                      id={s}
                      checked={selectedAmenities.includes(s)}
                      onCheckedChange={() =>
                        setSelectedAmenities((prev) =>
                          prev.includes(s)
                            ? prev.filter((a) => a !== s)
                            : [...prev, s],
                        )
                      }
                    />
                    <label
                      htmlFor={s}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {s}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* 3. LISTA RISULTATI */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {filteredSpaces.length}{" "}
                {filteredSpaces.length === 1
                  ? "spazio trovato"
                  : "spazi trovati"}
              </h1>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] rounded-lg font-bold h-10">
                  <SelectValue placeholder="Ordina" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="consigliati" className="font-medium">
                    Consigliati
                  </SelectItem>
                  <SelectItem value="prezzo-basso" className="font-medium">
                    Prezzo più basso
                  </SelectItem>
                  <SelectItem value="prezzo-alto" className="font-medium">
                    Prezzo più alto
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => {
                  const totalPrice = getBookingPrice(space);
                  const averageRating =
                    space.reviews.length > 0
                      ? (
                          space.reviews.reduce(
                            (acc: number, r: any) => acc + r.rating,
                            0,
                          ) / space.reviews.length
                        ).toFixed(2)
                      : "Nuovo";

                  return (
                    <Link
                      href={`/space/${space.id}`}
                      key={space.id}
                      className="group"
                    >
                      <div className="bg-background rounded-[2rem] p-3 shadow-sm border border-border/50 hover:shadow-xl transition-all flex flex-col h-full relative">
                        <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-muted">
                          <Image
                            src={
                              space.imageUrls[0] ||
                              "https://images.unsplash.com/photo-1497366216548-37526070297c"
                            }
                            alt={space.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {formatSpaceType(space.type)}
                          </div>
                        </div>

                        <div className="flex flex-col flex-1 px-2 pb-2">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold tracking-tight line-clamp-1 pr-2">
                              {space.title}
                            </h3>
                            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg shrink-0">
                              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                              <span className="text-sm font-bold">
                                {averageRating}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-4 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />{" "}
                            {space.address}, {space.city}
                          </p>

                          <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-1">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Prezzo Orario
                              </span>
                              <span className="text-sm font-bold text-foreground">
                                {space.hourlyPrice?.toFixed(2) || "-"}€{" "}
                                <span className="text-[10px] text-muted-foreground">
                                  /ora
                                </span>
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                                Totale Prenotazione
                              </span>
                              <div className="text-right">
                                <span className="text-xl font-extrabold text-accent">
                                  {totalPrice?.toFixed(2)}€
                                </span>
                                <span className="block text-[9px] font-bold text-muted-foreground/60 leading-none">
                                  per {duration}h di lavoro
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 rounded-[2rem] bg-background/50">
                <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold tracking-tight">
                  Nessuno spazio trovato
                </h3>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-6 rounded-xl font-bold border-border/50"
                >
                  Azzera filtri
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
