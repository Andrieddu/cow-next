"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  ReceiptText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format, parseISO, isValid } from "date-fns";
import { it } from "date-fns/locale";

function SuccessContent() {
  const searchParams = useSearchParams();

  // LEGGIAMO TUTTI I PARAMETRI DALL'URL
  const bookingId = searchParams.get("bookingId") || "PENDING-001";
  const totalPrice = parseFloat(searchParams.get("totalPrice") || "0");
  const status = searchParams.get("status") || "PENDING";

  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");
  const startTime = searchParams.get("start") || "09:00";
  const endTime = searchParams.get("end") || "13:00";
  const isFullDay = searchParams.get("isFullDay") === "true";

  const isConfirmed = status === "CONFIRMED";

  // Formattazione sicura delle date per il riepilogo
  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return "Data non specificata";
    const date = parseISO(dateStr);
    return isValid(date)
      ? format(date, "dd MMMM yyyy", { locale: it })
      : "Data non specificata";
  };

  const displayDate = useMemo(() => {
    if (!startDateStr) return "Nessuna data selezionata";
    if (startDateStr === endDateStr || !endDateStr)
      return formatDateDisplay(startDateStr);
    return `${formatDateDisplay(startDateStr)} - ${formatDateDisplay(endDateStr)}`;
  }, [startDateStr, endDateStr]);

  const duration = useMemo(() => {
    const startHour = parseInt(startTime.split(":")[0]) || 9;
    const endHour = parseInt(endTime.split(":")[0]) || 13;
    return Math.max(1, endHour - startHour);
  }, [startTime, endTime]);

  const timeString = isFullDay
    ? "Giornata Intera"
    : `${startTime} - ${endTime} (${duration} ore)`;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      {/* 1. ICONA E MESSAGGIO DI SUCCESSO */}
      <div className="h-24 w-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-500/20 animate-in zoom-in duration-500">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-4">
        {isConfirmed ? "Prenotazione confermata!" : "Prenotazione inviata!"}
      </h1>
      <p className="text-muted-foreground text-center font-medium text-lg mb-10 max-w-md">
        {isConfirmed
          ? "Tutto è andato a buon fine. Il tuo spazio è stato riservato immediatamente ed è pronto per te."
          : "Tutto è andato a buon fine. Abbiamo inviato la tua richiesta. L'Host ti confermerà a breve l'accesso."}
      </p>

      {/* 2. CARD RIEPILOGO SUCCESSO */}
      <div className="w-full bg-background rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-green-500/5 border border-border/50 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-border/50 gap-4">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Codice Prenotazione
            </span>
            <p className="text-xl font-mono font-bold text-foreground mt-1">
              #{bookingId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-secondary/10 rounded-2xl shrink-0">
            <ReceiptText className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Dettagli transazione</h3>
            <div className="flex flex-col gap-2 mt-2 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2 capitalize">
                <CalendarIcon className="h-4 w-4 text-accent shrink-0" />{" "}
                {displayDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent shrink-0" /> {timeString}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex gap-4 p-5 rounded-2xl bg-secondary/5 border border-border/50 flex-col justify-center">
            <span className="font-bold text-sm">Stato attuale</span>
            <span
              className={`text-sm font-bold mt-1 flex items-center gap-2 ${
                isConfirmed ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isConfirmed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              {isConfirmed ? "Confermata" : "In attesa di approvazione"}
            </span>
          </div>
          <div className="flex flex-col justify-center p-5 rounded-2xl bg-secondary/5 border border-border/50">
            <span className="font-bold text-sm">Importo pagato</span>
            <span className="text-xl font-extrabold text-green-600 mt-1">
              €{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTONI FINALI */}
      <div className="flex flex-col sm:flex-row items-center w-full gap-4">
        <Link href="/profile/bookings" className="w-full">
          <Button className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2">
            Vai alle tue prenotazioni <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/search" className="w-full">
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl font-bold text-base border-border/50 hover:bg-secondary/10 shadow-sm gap-2"
          >
            Esplora altri spazi
          </Button>
        </Link>
      </div>
    </div>
  );
}

// WRAPPER PRINCIPALE CON SUSPENSE
export default function CheckoutSuccessPage() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-secondary/5 py-12 md:py-20 px-6">
      <Suspense
        fallback={
          <div className="animate-pulse font-bold text-muted-foreground mt-20">
            Caricamento conferma...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
