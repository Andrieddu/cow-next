"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";

// IMPORT DEL SELECT DI SHADCN
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export default function Home() {
  const router = useRouter();

  // --- STATI PER I FILTRI ---
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  // --- LOGICA ORARI DINAMICI ---
  // Genera un array di orari: ["00:00", "01:00", ..., "23:00"]
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`,
  );

  // Gestione del cambio dell'ora di inizio
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);

    // Trasformiamo in numeri per il confronto (es. "09:00" -> 9)
    const startHour = parseInt(newStart.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    // Se l'ora di fine è uguale o precedente a quella di inizio, la spostiamo avanti di 1 ora
    if (endHour <= startHour) {
      const nextHour = Math.min(startHour + 1, 23); // Non superiamo le 23:00
      setEndTime(`${nextHour.toString().padStart(2, "0")}:00`);
    }
  };

  // Filtriamo le opzioni per l'orario di fine (solo quelle maggiori di startTime)
  const endOptions = hours.filter((h) => {
    const hHour = parseInt(h.split(":")[0]);
    const sHour = parseInt(startTime.split(":")[0]);
    return hHour > sHour;
  });

  // --- LOGICA DI RICERCA ---
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.set("q", location);

    // Invece di toISOString(), usiamo format di date-fns
    // per mandare "2026-03-21" indipendentemente dal fuso orario
    if (date?.from) {
      params.set("startDate", format(date.from, "yyyy-MM-dd"));
    }
    if (date?.to) {
      params.set("endDate", format(date.to, "yyyy-MM-dd"));
    }

    params.set("start", startTime);
    params.set("end", endTime);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 md:py-20 text-center container max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.15]">
          Lavora dove vuoi, <br className="hidden md:block" />
          <span className="text-accent italic">quando vuoi.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[650px] mx-auto font-medium leading-relaxed">
          Scrivanie, uffici privati e sale meeting pronti all uso. Prenota in
          pochi secondi e inizia a produrre.
        </p>

        {/* Search Bar - REINFORZATA */}
        <div className="mt-14 mx-auto max-w-6xl w-full">
          <FieldGroup className="bg-background border border-border/60 shadow-2xl rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2">
            {/* Campo: DOVE */}
            <div className="w-full md:flex-[1.2] border-b md:border-b-0 md:border-r border-border/50">
              <Field className="px-5 py-2 border-none">
                <div className="flex items-center gap-3 text-left">
                  <MapPin className="h-5 w-5 text-accent shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <FieldLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0">
                      Dove
                    </FieldLabel>
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Città o Coworking"
                      className="h-auto border-none bg-transparent p-0 focus-visible:ring-0 text-sm md:text-base w-full font-bold placeholder:text-muted-foreground/30 shadow-none"
                    />
                  </div>
                </div>
              </Field>
            </div>

            {/* Campo: QUANDO */}
            <div className="w-full md:flex-1 border-b md:border-b-0 md:border-r border-border/50">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full text-left outline-none">
                    <Field className="px-5 py-2 border-none cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-accent shrink-0" />
                        <div className="flex flex-col items-start">
                          <FieldLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0">
                            Quando
                          </FieldLabel>
                          <span
                            className={cn(
                              "text-sm md:text-base font-bold truncate transition-colors",
                              !date?.from && "text-muted-foreground/30",
                            )}
                          >
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "dd MMM", { locale: it })}{" "}
                                  - {format(date.to, "dd MMM", { locale: it })}
                                </>
                              ) : (
                                format(date.from, "dd MMM", { locale: it })
                              )
                            ) : (
                              "Seleziona date"
                            )}
                          </span>
                        </div>
                      </div>
                    </Field>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 rounded-3xl border border-border/50 bg-background shadow-2xl z-[60]"
                  align="center"
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={it}
                    className="bg-background rounded-3xl"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Campo: ORARIO DINAMICO */}
            <div className="w-full md:flex-1">
              <Field className="px-5 py-2 border-none">
                <div className="flex items-center gap-3 text-left">
                  <Clock className="h-5 w-5 text-accent shrink-0" />
                  <div className="flex flex-col items-start w-full">
                    <FieldLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0">
                      Orario
                    </FieldLabel>
                    <div className="flex items-center gap-1">
                      {/* SELECT INIZIO */}
                      <Select
                        value={startTime}
                        onValueChange={handleStartTimeChange}
                      >
                        <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 font-bold text-sm md:text-base bg-transparent hover:text-accent transition-colors w-fit gap-1">
                          <SelectValue placeholder="Inizio" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] bg-background border border-border/50 shadow-2xl rounded-xl max-h-60 overflow-y-auto">
                          {hours.map((hour) => (
                            <SelectItem
                              key={hour}
                              value={hour}
                              className="font-medium focus:text-accent cursor-pointer"
                            >
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-muted-foreground/30 mx-0.5">-</span>

                      {/* SELECT FINE */}
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 font-bold text-sm md:text-base bg-transparent hover:text-accent transition-colors w-fit gap-1">
                          <SelectValue placeholder="Fine" />
                        </SelectTrigger>
                        <SelectContent className="z-[100] bg-background border border-border/50 shadow-2xl rounded-xl max-h-60 overflow-y-auto">
                          {endOptions.length > 0 ? (
                            endOptions.map((hour) => (
                              <SelectItem
                                key={hour}
                                value={hour}
                                className="font-medium focus:text-accent cursor-pointer"
                              >
                                {hour}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="23:59" disabled>
                              Fine giornata
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Field>
            </div>

            {/* Bottone Cerca */}
            <Button
              size="lg"
              onClick={handleSearch}
              className="w-[calc(100%-16px)] md:w-auto h-14 lg:px-10 rounded-2xl md:rounded-full font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all m-2 md:m-0"
            >
              <Search className="h-5 w-5 lg:mr-2 stroke-[3]" />
              <span className="md:hidden lg:inline">Cerca</span>
            </Button>
          </FieldGroup>
        </div>

        {/* Suggerimenti veloci */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="text-sm text-muted-foreground/80 py-1">
            Esplora:
          </span>
          {["Milano", "Sale Podcast", "Uffici Privati", "Flex Desk"].map(
            (tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="text-sm font-bold text-accent hover:text-accent/80 transition-colors border-b-2 border-secondary/50 pb-0.5"
              >
                {tag}
              </Link>
            ),
          )}
        </div>
      </section>

      {/* SEZIONE "DUE ANIME" */}
      <section className="w-full bg-secondary/5 py-24 border-t border-border/50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Una piattaforma,{" "}
              <span className="text-accent italic">due anime.</span>
            </h2>
            <p className="mt-4 text-muted-foreground font-medium text-lg">
              Sia che tu cerchi un posto tranquillo per lavorare, sia che tu
              voglia affittare la tua scrivania libera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* Carta Professionista */}
            <div className="flex flex-col gap-8 bg-background p-8 md:p-10 rounded-[3rem] shadow-sm border border-border/50 hover:shadow-xl transition-all group">
              <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
                <Image
                  src="/coworker.png"
                  alt="Professionista al lavoro"
                  fill
                  className="object-contain drop-shadow-2xl transition-transform group-hover:-translate-y-4 duration-500"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-bold text-primary-foreground uppercase tracking-widest mb-4">
                  Per i Professionisti
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  Trova lo spazio perfetto.
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed mb-8 flex-1">
                  Hai bisogno di una scrivania per oggi o di una sala meeting
                  per domani? Esplora centinaia di spazi certificati e prenota
                  in un click.
                </p>
                <Link href="/search">
                  <Button
                    size="lg"
                    className="w-fit font-bold rounded-2xl gap-2 shadow-sm px-8 h-12"
                  >
                    Cerca uno spazio <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Carta Proprietario */}
            <div className="flex flex-col gap-8 bg-background p-8 md:p-10 rounded-[3rem] shadow-sm border border-border/50 hover:shadow-xl transition-all group">
              <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
                <Image
                  src="/desk.png"
                  alt="Scrivania pronta per affitto"
                  fill
                  className="object-contain drop-shadow-2xl transition-transform group-hover:-translate-y-4 duration-500"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[10px] font-bold text-accent uppercase tracking-widest mb-4">
                  Per i Proprietari
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  Metti a rendita il tuo ufficio.
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed mb-8 flex-1">
                  Hai un ufficio con postazioni vuote o una sala riunioni
                  inutilizzata? Pubblica il tuo annuncio gratuitamente e inizia
                  a guadagnare.
                </p>
                <Link href="/become-host">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-fit font-bold rounded-2xl gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-sm px-8 h-12"
                  >
                    Diventa Host <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
