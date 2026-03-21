"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Clock, MapPin, AlertTriangle, Loader2, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { updateBookingStatus } from "@/actions/booking-actions";

// --- HELPERS INTERNI ---
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => matchMedia.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const formatSpaceType = (type: string) => {
  const types: Record<string, string> = {
    DESK: "Desk",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    EVENT_SPACE: "Sala Eventi",
  };
  return types[type] || type;
};

const formatStatus = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "Confermata";
    case "PENDING":
      return "In Attesa";
    case "CANCELLED":
      return "Annullata";
    case "COMPLETED":
      return "Completata";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-primary/10 text-primary-foreground border-primary/30";
    case "PENDING":
      return "bg-amber-500/10 text-amber-700 border-amber-500/30";
    case "CANCELLED":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "COMPLETED":
      return "bg-green-500/10 text-green-700 border-green-500/30";
    default:
      return "bg-secondary/10 text-foreground border-border/50";
  }
};

export default function BookingCardClient({ booking }: { booking: any }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const space = booking.space;
  const host = space?.host;

  const monthShort = format(new Date(booking.date), "MMM", { locale: it });
  const day = format(new Date(booking.date), "dd");
  const fullDateStr = format(new Date(booking.date), "EEEE dd MMMM yyyy", {
    locale: it,
  });

  const handleStartCancel = () => {
    setIsSheetOpen(false);
    setTimeout(() => {
      setIsCancelModalOpen(true);
    }, 300);
  };

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    const result = await updateBookingStatus(booking.id, "CANCELLED");
    setIsProcessing(false);

    if (result.success) {
      setIsCancelModalOpen(false);
      toast.success("Prenotazione annullata");
    } else {
      toast.error("Errore", { description: result.error });
    }
  };

  const CancellationSummary = (
    <div className="space-y-6 py-4">
      <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-start text-left">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Spazio
            </p>
            <p className="font-bold text-foreground truncate max-w-[150px]">
              {space.title}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Data
            </p>
            <p className="font-bold text-foreground">
              {format(new Date(booking.date), "dd MMM yyyy")}
            </p>
          </div>
        </div>
        <Separator className="bg-destructive/10" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-muted-foreground">
            Rimborso
          </span>
          <span className="text-lg font-extrabold text-destructive">
            €{booking.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {/* CARD LISTA */}
        <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
          <div className="bg-accent/10 rounded-2xl w-20 h-20 flex flex-col items-center justify-center shrink-0 border border-accent/20">
            <span className="text-sm font-bold text-accent uppercase tracking-widest">
              {monthShort}
            </span>
            <span className="text-2xl font-bold text-foreground leading-none mt-1">
              {day}
            </span>
          </div>

          <div className="flex-1 overflow-hidden text-left">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                  getStatusColor(booking.status),
                )}
              >
                {formatStatus(booking.status)}
              </div>
              <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                {formatSpaceType(space.type)}
              </div>
            </div>
            <h4 className="text-lg font-bold mb-1 truncate max-w-sm">
              {space.title}
            </h4>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent shrink-0" />{" "}
                {booking.startTime} - {booking.endTime}
              </span>
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="h-4 w-4 text-accent shrink-0" /> {space.city}
              </span>
            </div>
          </div>

          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl font-bold border-border/50 hover:bg-accent/10 hover:text-accent w-full sm:w-auto h-11"
            >
              Dettagli
            </Button>
          </SheetTrigger>
        </div>

        {/* SIDEBAR DETTAGLI */}
        <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/50 overflow-y-auto z-[100] p-0 flex flex-col">
          <SheetHeader className="text-left pt-8 px-6 sm:px-8 mb-6">
            <div
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest w-fit mb-4",
                getStatusColor(booking.status),
              )}
            >
              {formatStatus(booking.status)}
            </div>
            <SheetTitle className="text-3xl font-bold tracking-tight">
              Dettagli sessione
            </SheetTitle>
            <SheetDescription className="text-base font-medium">
              {booking.status === "CONFIRMED"
                ? `Tutto pronto per la tua giornata presso ${space.title}.`
                : "In attesa di conferma dall'Host."}
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 bg-muted">
              <Image
                src={space.imageUrls[0]}
                alt={space.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="bg-secondary/5 border border-border/50 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                  Data e Ora
                </span>
                <span className="font-bold text-foreground capitalize">
                  {fullDateStr} • {booking.startTime} - {booking.endTime}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                  Indirizzo
                </span>
                <span className="font-bold text-foreground">
                  {space.address}
                  <br />
                  {space.city}
                </span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Importo</span>
                <span className="font-extrabold text-accent">
                  €{booking.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* SEZIONE AZIONI SIDEBAR */}
            <div className="flex flex-col gap-3">
              {/* RIPRISTINATO: TASTO RICEVUTA */}
              {(booking.status === "CONFIRMED" ||
                booking.status === "COMPLETED") && (
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                  onClick={() =>
                    toast.info("Generazione ricevuta...", {
                      description:
                        "La ricevuta verrà scaricata tra pochi istanti.",
                    })
                  }
                >
                  <Receipt className="h-5 w-5 text-muted-foreground" /> Scarica
                  Ricevuta
                </Button>
              )}

              <Link href={`/space/${space.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl font-bold gap-3 border-border/50"
                >
                  <MapPin className="h-5 w-5 text-muted-foreground" /> Rivedi
                  annuncio
                </Button>
              </Link>

              {(booking.status === "CONFIRMED" ||
                booking.status === "PENDING") && (
                <Button
                  onClick={handleStartCancel}
                  variant="outline"
                  className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-4"
                >
                  <AlertTriangle className="h-5 w-5" /> Cancella Prenotazione
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* MODALE CANCELLAZIONE... (Dialog/Drawer resta invariato) */}
      {isDesktop ? (
        <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Annulla Prenotazione?
              </DialogTitle>
              <DialogDescription className="text-base">
                Sei sicuro di voler procedere? Questa azione non può essere
                annullata.
              </DialogDescription>
            </DialogHeader>
            {CancellationSummary}
            <DialogFooter className="flex-col sm:flex-col gap-3">
              <Button
                onClick={handleConfirmCancel}
                disabled={isProcessing}
                variant="destructive"
                className="w-full rounded-xl h-12 font-bold shadow-lg shadow-destructive/20"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Conferma Cancellazione"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full rounded-xl font-bold text-muted-foreground h-12"
              >
                Mantieni Prenotazione
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <DrawerContent className="rounded-t-[2.5rem] px-6 pb-8">
            <div className="mx-auto w-12 h-1.5 bg-border rounded-full mt-4 mb-8" />
            <DrawerHeader className="px-0 text-left">
              <DrawerTitle className="text-2xl font-bold text-foreground">
                Annulla Prenotazione?
              </DrawerTitle>
              <DrawerDescription className="text-base">
                Sei sicuro di voler procedere? Questa azione non può essere
                annullata.
              </DrawerDescription>
            </DrawerHeader>
            {CancellationSummary}
            <DrawerFooter className="px-0 flex-col gap-3">
              <Button
                onClick={handleConfirmCancel}
                disabled={isProcessing}
                variant="destructive"
                className="w-full rounded-xl h-14 font-bold shadow-lg shadow-destructive/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                    Annullamento...
                  </>
                ) : (
                  "Conferma Cancellazione"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isProcessing}
                className="w-full rounded-xl font-bold text-muted-foreground h-14"
              >
                Mantieni Prenotazione
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
