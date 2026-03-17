"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { it } from "date-fns/locale";
import { addDays, subDays } from "date-fns";

export default function HostCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const nextDay = () => date && setDate(addDays(date, 1));
  const prevDay = () => date && setDate(subDays(date, 1));

  const dailyBookings = [
    {
      id: "b1",
      space: "Sala Meeting Galileo",
      time: "09:00 - 13:00",
      user: "Marco Rossi",
      guests: 4,
      status: "Confermata",
    },
    {
      id: "b2",
      space: "Flex Desk Centrale",
      time: "14:00 - 18:00",
      user: "Giulia Bianchi",
      guests: 1,
      status: "In arrivo",
    },
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* HEADER - Mobile Responsive */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
            <Link href="/host/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0"
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
          {/* COLONNA SINISTRA: IL CALENDARIO (Visuale Mensile) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-background rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <h3 className="text-lg md:text-xl font-bold tracking-tight">
                  Panoramica Mensile
                </h3>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-accent/5 text-accent border-accent/20 text-[10px]"
                  >
                    Occupato
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-secondary/10 text-muted-foreground border-transparent text-[10px]"
                  >
                    Libero
                  </Badge>
                </div>
              </div>

              {/* FIX RESPONSIVE: classNames per dimensioni celle */}
              <div className="w-full overflow-x-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={it}
                  className="rounded-2xl md:rounded-3xl border border-border/50 p-2 md:p-4 w-full flex justify-center bg-secondary/5"
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    caption:
                      "flex justify-center pt-1 relative items-center mb-4",
                    caption_label:
                      "text-sm md:text-lg font-bold text-foreground",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-8 w-8 md:h-9 md:w-9 bg-background border border-border/50 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-secondary/10 transition-colors",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full justify-between",
                    head_cell:
                      "text-muted-foreground rounded-md w-8 md:w-12 font-bold text-[10px] md:text-[12px] uppercase tracking-widest",
                    row: "flex w-full mt-2 justify-between",
                    cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    // DIMENSIONI DINAMICHE: h-8 su mobile, h-12 su desktop
                    day: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 p-0 font-bold aria-selected:opacity-100 hover:bg-accent/10 hover:text-accent rounded-lg md:rounded-xl transition-all flex items-center justify-center text-xs md:text-sm",
                    day_selected:
                      "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    day_today: "bg-secondary/20 text-foreground",
                  }}
                />
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA: AGENDA DEL GIORNO */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-background rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-border/50 lg:sticky lg:top-32">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent">
                    Agenda del giorno
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold truncate">
                    {date
                      ? date.toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "long",
                        })
                      : "Seleziona"}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
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
                            <Clock className="h-3 w-3" /> {booking.time}
                          </span>
                          <Badge className="bg-accent/10 text-accent border-none text-[9px] font-bold shrink-0">
                            {booking.status}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-base md:text-lg leading-tight">
                          {booking.space}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" /> {booking.guests}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {booking.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <CalendarIcon className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Nessun impegno.
                    </p>
                  </div>
                )}
              </div>

              <Separator className="my-8 bg-border/50" />

              <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform text-sm md:text-base">
                Blocca disponibilità
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
