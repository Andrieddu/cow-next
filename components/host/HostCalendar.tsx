"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Clock,
  UserCircle,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { it } from "date-fns/locale";
import { addDays, subDays, isSameDay, parseISO, format } from "date-fns";

// Definiamo il tipo dei dati che ci arrivano dal server
interface BookingData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  guests: number;
  spaceTitle: string;
  guestName: string;
}

export default function HostCalendarClient({
  bookings,
}: {
  bookings: BookingData[];
}) {
  // Stato del giorno selezionato (di default oggi)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const nextDay = () =>
    selectedDate && setSelectedDate(addDays(selectedDate, 1));
  const prevDay = () =>
    selectedDate && setSelectedDate(subDays(selectedDate, 1));

  // --- LOGICA REALE ---
  // 1. Filtriamo le prenotazioni attive (nascondiamo le cancellate)
  const activeBookings = useMemo(() => {
    return bookings.filter((b) => b.status !== "CANCELLED");
  }, [bookings]);

  // 2. Troviamo quali giorni hanno ALMENO una prenotazione (per colorarli nel calendario)
  const daysWithBookings = useMemo(() => {
    return activeBookings.map((b) => parseISO(b.date));
  }, [activeBookings]);

  // 3. Estraiamo solo le prenotazioni del giorno attualmente selezionato
  const dailyBookings = useMemo(() => {
    if (!selectedDate) return [];

    return activeBookings
      .filter((booking) => isSameDay(parseISO(booking.date), selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Ordiniamo per orario di inizio
  }, [activeBookings, selectedDate]);

  // Helper per il colore dello stato
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 border-none";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-none";
      case "COMPLETED":
        return "bg-secondary text-muted-foreground border-none";
      default:
        return "bg-secondary text-muted-foreground border-none";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confermata";
      case "PENDING":
        return "In attesa";
      case "COMPLETED":
        return "Completata";
      default:
        return status;
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* HEADER */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <Link href="/host/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0 hover:bg-secondary/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-lg md:text-2xl tracking-tight truncate">
              Calendario
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-xl font-bold border-border/50 gap-2 shrink-0 h-10 px-3 md:px-4"
          >
            <Filter className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Filtra</span>
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          {/* COLONNA SINISTRA: IL CALENDARIO */}
          <div className="lg:col-span-5">
            <div className="bg-background rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <h3 className="text-lg md:text-xl font-bold tracking-tight">
                  Panoramica Mensile
                </h3>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-accent/10 text-accent border-transparent text-[10px] font-bold"
                  >
                    Con prenotazioni
                  </Badge>
                </div>
              </div>

              <div className="w-full overflow-x-auto [text-align:-webkit-center]">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)} // Impediamo la deselezione totale
                  locale={it}
                  // Passiamo l'array di Date dei giorni occupati a Shadcn/DayPicker
                  modifiers={{ booked: daysWithBookings }}
                  modifiersClassNames={{
                    booked:
                      "after:content-[''] after:absolute after:bottom-1 md:after:bottom-2 after:h-1.5 after:w-1.5 after:bg-accent after:rounded-full font-bold",
                  }}
                  className="rounded-2xl md:rounded-3xl border border-border/50 p-2 md:p-4 w-full flex justify-center bg-secondary/5"
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    caption:
                      "flex justify-center pt-1 relative items-center mb-4",
                    caption_label:
                      "text-sm md:text-lg font-bold text-foreground capitalize",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-8 w-8 md:h-9 md:w-9 bg-background border border-border/50 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-secondary/10 transition-colors",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full justify-between",
                    head_cell:
                      "text-muted-foreground rounded-md w-8 md:w-12 font-bold text-[10px] md:text-[12px] uppercase tracking-widest",
                    row: "flex w-full mt-2 justify-between",
                    cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 p-0 font-bold aria-selected:opacity-100 hover:bg-accent/10 hover:text-accent rounded-lg md:rounded-xl transition-all flex items-center justify-center text-xs md:text-sm relative",
                    day_selected:
                      "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground after:bg-white", // Se è selezionato, il pallino rosso diventa bianco
                    day_today:
                      "bg-secondary/20 text-foreground border border-border/50",
                  }}
                />
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA: AGENDA DEL GIORNO REALE */}
          <div className="lg:col-span-7">
            <div className="bg-background rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-border/50 lg:sticky lg:top-32">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent">
                    Agenda del giorno
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold truncate capitalize">
                    {selectedDate
                      ? format(selectedDate, "EEEE d MMMM", { locale: it })
                      : "Seleziona data"}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg border-border/50"
                    onClick={prevDay}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg border-border/50"
                    onClick={nextDay}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {dailyBookings.length > 0 ? (
                  dailyBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="group relative pl-5 border-l-2 border-accent/30 hover:border-accent transition-colors"
                    >
                      <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-accent" />

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                            <Clock className="h-3 w-3" /> {booking.startTime} -{" "}
                            {booking.endTime}
                          </span>
                          <Badge
                            className={`text-[9px] font-bold shrink-0 uppercase tracking-widest px-2 py-0.5 ${getStatusColor(booking.status)}`}
                          >
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>

                        <h4 className="font-bold text-base md:text-lg leading-tight text-foreground truncate">
                          {booking.spaceTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5 bg-secondary/10 px-2 py-1 rounded-md">
                            <UserCircle className="h-3.5 w-3.5" />{" "}
                            {booking.guestName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" /> {booking.guests}{" "}
                            {booking.guests === 1 ? "persona" : "persone"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-secondary/5 rounded-2xl border border-dashed border-border/50">
                    <CalendarIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-bold">
                      Nessuna prenotazione oggi.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
