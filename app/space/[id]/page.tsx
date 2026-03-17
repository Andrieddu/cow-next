"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  MapPin,
  Share,
  Heart,
  Wifi,
  Coffee,
  Printer,
  ShieldCheck,
  Users,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Compass,
  Navigation,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";

export default function SpaceDetailPage() {
  // Stato per gestire il range di date (Da - A)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 1. BARRA DI NAVIGAZIONE SUPERIORE */}
      <div className="container max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/search"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla ricerca
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="font-bold gap-2 rounded-xl border-border/50"
          >
            <Share className="h-4 w-4" /> Condividi
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="font-bold gap-2 rounded-xl border-border/50"
          >
            <Heart className="h-4 w-4" /> Salva
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6">
        {/* 2. INTESTAZIONE E TITOLO */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Hub Innovazione Milano - Sala "Galileo"
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="font-bold text-foreground">4.92</span>
              <span className="text-muted-foreground underline underline-offset-4 cursor-pointer">
                (128 recensioni)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="underline underline-offset-4 hover:text-accent transition-colors cursor-pointer">
                Via Roma 10, Milano (Porta Nuova)
              </span>
            </div>
            <Badge className="rounded-lg font-bold bg-accent/10 text-accent border-none uppercase text-[10px] tracking-widest px-3 py-1">
              Superhost
            </Badge>
          </div>
        </div>

        {/* 3. GALLERIA IMMAGINI A GRIGLIA */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[350px] md:h-[550px] rounded-[3rem] overflow-hidden mb-12 shadow-sm border border-border/50">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
            <Image
              unoptimized
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
              alt="Main Space"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <Image
              unoptimized
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80"
              alt="Space 2"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <Image
              unoptimized
              src="https://images.unsplash.com/photo-1517502884422-41eaadeff171?auto=format&fit=crop&q=80"
              alt="Space 3"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <Image
              unoptimized
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
              alt="Space 4"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden">
            <Image
              unoptimized
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80"
              alt="Space 5"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-sm bg-background/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                Mostra tutte le foto
              </span>
            </div>
          </div>
        </div>

        {/* 4. LAYOUT PRINCIPALE: INFO + BOOKING CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* COLONNA SINISTRA: DETTAGLI E SERVIZI */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Sezione Host */}
            <div className="flex items-center justify-between pb-10 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Sala Meeting gestita da Copernico
                </h2>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" /> Fino a 12 persone • WiFi Fibra •
                  Lavagna magnetica
                </p>
              </div>
              <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </div>

            {/* Descrizione Testuale */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Informazioni sullo spazio</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                La Sala Galileo è progettata per ispirare. Situata all'ultimo
                piano dell'Hub di Milano, offre luce naturale abbondante e una
                vista panoramica sullo skyline di Porta Nuova. Perfetta per
                workshop, sessioni di design thinking o presentazioni importanti
                che richiedono un tocco di eleganza e professionalità.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto font-bold text-accent text-base hover:no-underline hover:text-accent/80 transition-colors"
              >
                Leggi la descrizione completa{" "}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <Separator />

            {/* Griglia dei Servizi (Amenities) */}
            <div className="space-y-8">
              <h3 className="text-xl font-bold">Cosa offre questo spazio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-foreground">
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-accent/10 rounded-2xl">
                    <Wifi className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-bold">WiFi Fibra 1Gbps</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-accent/10 rounded-2xl">
                    <Coffee className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-bold">Caffè e acqua inclusi</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-accent/10 rounded-2xl">
                    <Printer className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-bold">Area Stampa dedicata</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-3.5 bg-accent/10 rounded-2xl">
                    <ShieldCheck className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-bold">Sanificazione giornaliera</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-2xl font-bold border-border/50 px-10 h-14 mt-4 hover:bg-secondary/10 transition-colors"
              >
                Tutti i 24 servizi disponibili
              </Button>
            </div>

            <Separator />

            {/* SEZIONE MAPPA */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold">Dove ti troverai</h3>
                <p className="text-muted-foreground font-medium text-sm">
                  Milano, Porta Nuova — Uno dei distretti più moderni e vibranti
                  della città.
                </p>
              </div>

              <div className="relative w-full h-[350px] rounded-[2.5rem] overflow-hidden border border-border/50 group shadow-inner">
                {/* Immagine segnaposto per la mappa */}
                <Image
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80"
                  alt="Mappa posizione"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Pin personalizzato sulla mappa */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 bg-accent/20 rounded-full animate-ping" />
                    <div className="bg-accent p-3 rounded-full shadow-2xl border-2 border-white">
                      <Compass className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Badge info mappa */}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Navigation className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">
                        Indicazioni Stradali
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        5 min dalla Metro
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-2 p-5 bg-secondary/5 rounded-2xl border border-border/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Il quartiere
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Porta Nuova è il cuore tecnologico di Milano. Troverai i
                    migliori bar per il pranzo e aree verdi come la Biblioteca
                    degli Alberi a pochi passi.
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-secondary/5 rounded-2xl border border-border/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Come arrivare
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Facilmente raggiungibile tramite la M2 (Gioia) e M3
                    (Repubblica). Parcheggio convenzionato disponibile a 200
                    metri dallo spazio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA: BOOKING CARD (STICKY) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-2xl shadow-border/10 overflow-hidden">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">
                    €45
                  </span>
                  <span className="text-muted-foreground font-bold ml-1">
                    / ora
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span>4.92</span>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <FieldGroup className="space-y-6">
                  <FieldSet>
                    <FieldGroup className="space-y-6">
                      {/* 1. SELEZIONE DATE (RANGE DA - A) */}
                      <Field>
                        <FieldLabel>Quando ne hai bisogno?</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-14 justify-start text-left font-bold rounded-2xl border-border/50 px-5 transition-all hover:border-accent/50",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-3 h-5 w-5 text-accent" />
                              {date?.from ? (
                                date.to ? (
                                  <>
                                    {format(date.from, "dd MMM", {
                                      locale: it,
                                    })}{" "}
                                    -{" "}
                                    {format(date.to, "dd MMM", { locale: it })}
                                  </>
                                ) : (
                                  format(date.from, "dd MMM", { locale: it })
                                )
                              ) : (
                                <span>Seleziona le date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-3xl border border-border/50 shadow-2xl bg-background opacity-100 z-50"
                            align="end"
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
                        <FieldDescription>
                          Cancellazione gratuita fino a 24 ore prima.
                        </FieldDescription>
                      </Field>

                      {/* 2. SELEZIONE ORARIO (DA - A) CON SHADCN SELECT */}
                      {/* 2. SELEZIONE ORARIO (DA - A) CON SHADCN SELECT */}
                      <Field>
                        <FieldLabel>Fascia Oraria</FieldLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {/* DALLE */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 tracking-widest">
                              Dalle
                            </span>
                            <div className="relative">
                              <Select defaultValue="09:00">
                                {/* Aggiunto [&>svg]:hidden per nascondere la freccia di default di Shadcn */}
                                <SelectTrigger className="w-full h-14 pl-4 pr-10 rounded-2xl border-border/50 bg-secondary/5 font-bold text-sm focus:ring-2 focus:ring-accent/20 focus:outline-none shadow-none [&>svg]:hidden">
                                  <SelectValue placeholder="Ora inizio" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border/50 rounded-xl shadow-2xl z-[100]">
                                  {[
                                    "08:00",
                                    "09:00",
                                    "10:00",
                                    "11:00",
                                    "14:00",
                                  ].map((ora) => (
                                    <SelectItem
                                      key={ora}
                                      value={ora}
                                      className="cursor-pointer font-bold py-2.5 !text-foreground data-[highlighted]:!text-foreground"
                                    >
                                      {ora}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {/* Centratura verticale matematica con top-1/2 -translate-y-1/2 */}
                              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none opacity-50" />
                            </div>
                          </div>

                          {/* ALLE */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 tracking-widest">
                              Alle
                            </span>
                            <div className="relative">
                              <Select defaultValue="13:00">
                                {/* Aggiunto [&>svg]:hidden per nascondere la freccia di default di Shadcn */}
                                <SelectTrigger className="w-full h-14 pl-4 pr-10 rounded-2xl border-border/50 bg-secondary/5 font-bold text-sm focus:ring-2 focus:ring-accent/20 focus:outline-none shadow-none [&>svg]:hidden">
                                  <SelectValue placeholder="Ora fine" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border/50 rounded-xl shadow-2xl z-[100]">
                                  {[
                                    "13:00",
                                    "14:00",
                                    "15:00",
                                    "18:00",
                                    "20:00",
                                  ].map((ora) => (
                                    <SelectItem
                                      key={ora}
                                      value={ora}
                                      className="cursor-pointer font-bold py-2.5 !text-foreground data-[highlighted]:!text-foreground"
                                    >
                                      {ora}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {/* Centratura verticale matematica con top-1/2 -translate-y-1/2 */}
                              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none opacity-50" />
                            </div>
                          </div>
                        </div>
                        <FieldDescription>
                          Il tempo minimo di prenotazione è di 1 ora.
                        </FieldDescription>
                      </Field>

                      {/* 3. CONTATORE PARTECIPANTI */}
                      <Field>
                        <FieldLabel>Partecipanti</FieldLabel>
                        <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/50">
                          <span className="font-bold text-sm text-muted-foreground">
                            Ospiti previsti
                          </span>
                          <div className="flex items-center gap-5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full border-border/50 font-bold hover:bg-background shadow-sm"
                            >
                              -
                            </Button>
                            <span className="font-extrabold w-4 text-center">
                              4
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full border-border/50 font-bold hover:bg-background shadow-sm"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <FieldDescription>
                          Capienza massima per questa sala: 12 persone.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <Button className="w-full h-15 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-7 mt-4">
                    Verifica Disponibilità
                  </Button>

                  <p className="text-center text-[11px] text-muted-foreground font-medium italic">
                    Non ti verrà addebitato alcun costo in questa fase.
                  </p>
                </FieldGroup>
              </form>

              {/* RIEPILOGO FINALE COSTI */}
              <div className="mt-8 space-y-4 pt-8 border-t border-border/50">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30 cursor-help">
                    €45 x 4 ore
                  </span>
                  <span className="text-foreground">€180,00</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30 cursor-help">
                    Costi di servizio CoW
                  </span>
                  <span className="text-foreground">€0,00</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold pt-4 border-t border-dashed border-border/50">
                  <span>Totale stimato</span>
                  <span className="text-accent">€180,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
