"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { MapPin, ArrowRight, User, Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { getOrCreateConversationAction } from "@/actions/message-actions";

export default function HostBookingCard({ arrival }: { arrival: any }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const router = useRouter();
  const space = arrival.space;
  const guest = arrival.guest;

  const monthShort = format(new Date(arrival.date), "MMM", { locale: it });
  const day = format(new Date(arrival.date), "dd");
  const fullDateStr = format(new Date(arrival.date), "EEEE dd MMMM yyyy", {
    locale: it,
  });

  // La funzione che si attiva al click sul messaggio
  const handleContactGuest = async () => {
    if (!guest) return;
    setIsStartingChat(true);

    try {
      // Passiamo l'ID del guest e l'ID della prenotazione
      const conversationId = await getOrCreateConversationAction(
        guest.id,
        arrival.id,
      );

      // Chiudiamo la modale
      setIsSheetOpen(false);

      // Invece di usare un push generico, passiamo l'ID come parametro!
      router.push(`/messages?chat=${conversationId}`);
    } catch (error) {
      toast.error("Errore", { description: "Impossibile avviare la chat." });
      setIsStartingChat(false);
    }
  };
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {/* CARD ORIZZONTALE (Dashboard) */}
      <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-all group">
        <div className="bg-secondary/10 rounded-2xl w-16 h-16 flex flex-col items-center justify-center shrink-0 border border-border/50 group-hover:bg-accent/5 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
            {monthShort}
          </span>
          <span className="text-xl font-black text-foreground">{day}</span>
        </div>

        <div className="flex-1 text-center sm:text-left overflow-hidden">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h4 className="font-bold text-lg truncate">
              {guest?.name} {guest?.surname}
            </h4>
            <Badge
              variant="outline"
              className="text-[9px] uppercase font-bold border-green-500/30 text-green-600 bg-green-500/5"
            >
              Confermata
            </Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground truncate">
            {space?.title} • {arrival.startTime} - {arrival.endTime}
          </p>
        </div>

        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="rounded-xl font-bold border-border/50 w-full sm:w-auto gap-2 group-hover:border-accent/30 group-hover:text-accent transition-all"
          >
            Dettagli <ArrowRight className="h-4 w-4" />
          </Button>
        </SheetTrigger>
      </div>

      {/* SIDEBAR DETTAGLI (Stesso stile del Profilo) */}
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/50 overflow-y-auto z-[100] p-0 flex flex-col">
        <SheetHeader className="text-left pt-8 px-6 sm:px-8 mb-6">
          <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/5 px-3 py-1 text-[10px] font-bold text-green-600 uppercase tracking-widest w-fit mb-4">
            Arrivo Confermato
          </div>
          <SheetTitle className="text-3xl font-bold tracking-tight">
            Dettagli Ospite
          </SheetTitle>
          <SheetDescription className="text-base font-medium">
            Informazioni sulla prenotazione di {guest?.name}.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
          {/* Foto dello Spazio prenotato */}
          <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 bg-muted">
            <Image
              src={
                space?.imageUrls[0] ||
                "https://images.unsplash.com/photo-1497366216548-37526070297c"
              }
              alt={space?.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Riepilogo Transazione */}
          <div className="bg-secondary/5 border border-border/50 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                Data e Orario
              </span>
              <span className="font-bold text-foreground capitalize">
                {fullDateStr} • {arrival.startTime} - {arrival.endTime}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                Guadagno Previsto
              </span>
              <span className="text-xl font-black text-accent">
                €{arrival.totalPrice.toFixed(2)}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                Codice Prenotazione
              </span>
              <span className="font-mono font-bold text-foreground uppercase text-sm">
                #{arrival.id.split("-")[0]}
              </span>
            </div>
          </div>

          {/* Info sul Guest */}
          <div className="flex items-center justify-between border-y border-border/50 py-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-border/50 shadow-sm">
                <AvatarImage src={guest?.image || ""} />
                <AvatarFallback className="bg-accent/10 text-accent font-bold">
                  {guest?.name?.charAt(0) || "G"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-bold text-base leading-tight">
                  {guest?.name} {guest?.surname}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[150px] mt-0.5">
                  {guest?.email}
                </p>
              </div>
            </div>

            {/* NUOVO PULSANTE MESSAGGIO */}
            <Button
              variant="secondary"
              size="icon"
              disabled={isStartingChat}
              onClick={handleContactGuest}
              className="rounded-full h-11 w-11 text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 shrink-0 transition-transform hover:scale-105"
            >
              {isStartingChat ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Azioni Host */}
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3"
            >
              <User className="h-5 w-5 text-muted-foreground" /> Vedi profilo
              ospite
            </Button>
            <Link href={`/host/listing/${space?.id}`} className="w-full">
              <Button
                variant="outline"
                className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3"
              >
                <MapPin className="h-5 w-5 text-muted-foreground" /> Gestisci
                annuncio
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Piccolo componente Badge locale per evitare errori se non importato
function Badge({ children, className, variant }: any) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold",
        className,
      )}
    >
      {children}
    </span>
  );
}
