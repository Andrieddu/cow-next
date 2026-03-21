"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Lock,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { format, parseISO, isValid } from "date-fns";
import { it } from "date-fns/locale";

// IMPORTIAMO LA SERVER ACTION E I TOAST
import { createBookingAction } from "@/actions/booking-actions";
import { toast } from "sonner";

// Helper Tipologia
const formatSpaceType = (type: string) => {
  const types: Record<string, string> = {
    FLEX_DESK: "Flex Desk",
    FIXED_DESK: "Scrivania Fissa",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    PODCAST_ROOM: "Sala Podcast",
  };
  return types[type] || type;
};

// Accettiamo lo spazio REALE dal server
export default function CheckoutClient({ space }: { space: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // LETTURA PARAMETRI DALL'URL
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");
  const startTime = searchParams.get("start") || "09:00";
  const endTime = searchParams.get("end") || "13:00";
  const guests = searchParams.get("guests") || "1";
  const isFullDay = searchParams.get("isFullDay") === "true";

  const [isProcessing, setIsProcessing] = useState(false);

  // FORMATTAZIONE DATE (UI)
  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return "Da definire";
    const date = parseISO(dateStr);
    return isValid(date)
      ? format(date, "dd MMMM yyyy", { locale: it })
      : "Da definire";
  };

  const displayDate = useMemo(() => {
    if (!startDateStr) return "Nessuna data selezionata";
    if (startDateStr === endDateStr || !endDateStr)
      return formatDateDisplay(startDateStr);
    return `${formatDateDisplay(startDateStr)} - ${formatDateDisplay(endDateStr)}`;
  }, [startDateStr, endDateStr]);

  const duration = useMemo(() => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    return Math.max(1, endHour - startHour);
  }, [startTime, endTime]);

  // CALCOLI PREZZI
  const isHourly = !!space.hourlyPrice;
  const currentBasePrice = isFullDay
    ? space.dailyPrice || 0
    : space.hourlyPrice || space.dailyPrice || 0;
  const totalPrice = isFullDay
    ? space.dailyPrice || 0
    : isHourly
      ? (space.hourlyPrice || 0) * duration
      : space.dailyPrice || 0;

  const priceLabel = isFullDay
    ? `Tariffa giornaliera`
    : isHourly
      ? `€${currentBasePrice.toFixed(2)} x ${duration} ore`
      : `Tariffa giornaliera`;

  // CALCOLO RATING SUI DATI REALI
  const averageRating =
    space.reviews?.length > 0
      ? (
          space.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          space.reviews.length
        ).toFixed(2)
      : "Nuovo";

  const reviewsCount = space.reviews ? space.reviews.length : 0;

  // --- GESTIONE PAGAMENTO & SALVATAGGIO REALE ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Chiamiamo il DB tramite la Server Action
      const result = await createBookingAction({
        spaceId: space.id,
        startDate: startDateStr || new Date().toISOString(),
        startTime,
        endTime,
        isFullDay, // Passiamo isFullDay come richiede il nuovo schema
        totalPrice,
      });

      // 2. Controllo esito
      if (result.success) {
        // Se andata bene, costruiamo i parametri per la pagina Success
        const params = new URLSearchParams();
        params.set("bookingId", result.bookingId!);
        params.set("status", result.status!);
        params.set("totalPrice", totalPrice.toString());
        if (startDateStr) params.set("startDate", startDateStr);
        if (endDateStr) params.set("endDate", endDateStr);
        params.set("start", startTime);
        params.set("end", endTime);
        params.set("isFullDay", isFullDay ? "true" : "false");

        // Vai alla schermata verde!
        router.push(`/checkout/success?${params.toString()}`);
      } else {
        // Se il DB ha rifiutato (es. Spazio rimosso)
        setIsProcessing(false);
        toast.error("Errore di prenotazione", { description: result.error });
        router.push(
          `/checkout/error?spaceId=${space.id}&totalPrice=${totalPrice}`,
        );
      }
    } catch (error) {
      // Se il server cade o non c'è internet
      setIsProcessing(false);
      toast.error("Errore critico", {
        description: "Impossibile completare l'operazione.",
      });
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-6 pt-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7 flex flex-col gap-10">
          <FieldSet>
            <FieldLegend className="text-2xl font-bold tracking-tight mb-6">
              La tua prenotazione
            </FieldLegend>
            <FieldGroup className="space-y-6 bg-secondary/5 rounded-[2rem] p-6 border border-border/50">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-bold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-accent" /> Date
                  </span>
                  <span className="text-muted-foreground font-medium capitalize">
                    {displayDate}
                  </span>
                </div>
                <Link
                  href={`/space/${space.id}`}
                  className="font-bold text-accent hover:underline text-sm"
                >
                  Modifica
                </Link>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" /> Orario
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {isFullDay
                      ? "Giornata Intera"
                      : `${startTime} - ${endTime} (${duration} ore)`}
                  </span>
                </div>
                <Link
                  href={`/space/${space.id}?${searchParams.toString()}`}
                  className="font-bold text-accent hover:underline text-sm"
                >
                  Modifica
                </Link>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" /> Ospiti
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {guests}{" "}
                    {parseInt(guests) === 1 ? "partecipante" : "partecipanti"}
                  </span>
                </div>
                <Link
                  href={`/space/${space.id}`}
                  className="font-bold text-accent hover:underline text-sm"
                >
                  Modifica
                </Link>
              </div>
            </FieldGroup>
          </FieldSet>

          <Separator className="bg-border/50" />

          <form onSubmit={handlePayment} className="space-y-10">
            <FieldSet>
              <div className="flex items-center justify-between mb-6">
                <FieldLegend className="text-2xl font-bold tracking-tight mb-0">
                  Paga con
                </FieldLegend>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Crittografato
                  </span>
                </div>
              </div>

              <FieldGroup>
                <RadioGroup defaultValue="card" className="gap-4">
                  <div className="relative flex flex-col p-6 rounded-[2rem] border-2 border-border/50 bg-background transition-all [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="border-accent text-accent"
                        />
                        <label
                          htmlFor="card"
                          className="font-bold cursor-pointer flex items-center gap-2"
                        >
                          <CreditCard className="h-5 w-5 text-accent" /> Carta
                          di credito o debito
                        </label>
                      </div>
                    </div>
                    <FieldGroup className="space-y-4">
                      <Field>
                        <FieldLabel>Numero carta</FieldLabel>
                        <div className="relative">
                          <Input
                            required
                            placeholder="0000 0000 0000 0000"
                            className="h-12 rounded-xl border-border/50 pl-10"
                          />
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel>Scadenza</FieldLabel>
                          <Input
                            required
                            placeholder="MM/AA"
                            className="h-12 rounded-xl border-border/50"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>CVC</FieldLabel>
                          <Input
                            required
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            className="h-12 rounded-xl border-border/50"
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  </div>
                </RadioGroup>
              </FieldGroup>
            </FieldSet>

            <Separator className="bg-border/50" />

            <section className="space-y-8">
              <Button
                type="submit"
                disabled={isProcessing}
                size="lg"
                className="w-full h-16 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Elaborazione...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" /> Paga €
                    {totalPrice.toFixed(2)}
                  </>
                )}
              </Button>
            </section>
          </form>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border/50">
              <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0 bg-muted">
                <Image
                  src={
                    space.imageUrls?.[0] ||
                    "https://images.unsplash.com/photo-1497366216548"
                  }
                  alt={space.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {formatSpaceType(space.type)}
                </span>
                <h3 className="text-lg font-bold leading-tight mb-2">
                  {space.title}
                </h3>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                  <span>{averageRating}</span>
                  <span className="text-muted-foreground">
                    ({reviewsCount})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">{priceLabel}</span>
                <span className="font-bold text-foreground">
                  €{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-dashed border-border/50">
              <span className="text-xl font-bold">Totale</span>
              <span className="text-3xl font-extrabold text-accent">
                €{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
