"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Clock,
  MapPin,
  AlertTriangle,
  Loader2,
  Receipt,
  Star,
  MessageSquareText,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

// I TUOI COMPONENTI FIELD
import { Field, FieldLabel } from "@/components/ui/field";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
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
import { createReviewAction } from "@/actions/review-actions";
import { getOrCreateConversationAction } from "@/actions/message-actions";
// Importazione della futura server action per le recensioni
// import { createReviewAction } from "@/actions/review-actions";

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
  // Stati Base
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();
  const [isStartingChat, setIsStartingChat] = useState(false);

  // La funzione che si attiva al click sul messaggio
  const handleContactHost = async () => {
    if (!host) return;
    setIsStartingChat(true);

    try {
      // Chiama la nostra action per trovare o creare la chat
      const conversationId = await getOrCreateConversationAction(
        host.id,
        booking.id,
      );

      // Una volta creata, chiudiamo la modale
      setIsSheetOpen(false);

      // Invece del generico router.push("/messages"), passiamo l'ID
      router.push(`/messages?chat=${conversationId}`);
    } catch (error) {
      console.error("Errore nell'avvio della chat:", error);
      toast.error("Errore nell'avvio della chat");
      setIsStartingChat(false); // Ricordati di sbloccare il bottone se fallisce!
    }
  };

  // Stati Recensione
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const space = booking.space;
  const host = space?.host;

  const monthShort = format(new Date(booking.date), "MMM", { locale: it });
  const day = format(new Date(booking.date), "dd");
  const fullDateStr = format(new Date(booking.date), "EEEE dd MMMM yyyy", {
    locale: it,
  });

  // --- AZIONI CANCELLAZIONE ---
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

  // --- AZIONI RECENSIONE ---
  const handleStartReview = () => {
    setIsSheetOpen(false);
    setRating(0);
    setComment("");
    setReviewError("");
    setTimeout(() => {
      setIsReviewModalOpen(true);
    }, 300);
  };

  const handleConfirmReview = async () => {
    // Validazione
    if (rating === 0) {
      setReviewError("Seleziona almeno una stella per continuare.");
      return;
    }
    if (comment.length > 0 && comment.length < 5) {
      setReviewError("Il commento deve contenere almeno 5 caratteri.");
      return;
    }

    setReviewError("");
    setIsSubmittingReview(true);

    // --- CHIAMATA REALE ALLA SERVER ACTION ---
    const result = await createReviewAction(booking.id, { rating, comment });

    setIsSubmittingReview(false);

    if (result.success) {
      setIsReviewModalOpen(false);
      toast.success("Grazie!", {
        description: "La tua recensione è stata pubblicata con successo.",
      });
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

  // --- COMPONENTE INTERNO DEL FORM ---
  const ReviewFormContent = (
    <div className="space-y-8 py-6">
      <div className="bg-secondary/5 border border-border/50 rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
        <div className="relative h-14 w-16 rounded-xl overflow-hidden shrink-0 border border-border/50 bg-muted">
          <Image
            src={space.imageUrls[0]}
            alt={space.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="font-bold truncate text-foreground text-sm">
            {space.title}
          </h4>
          <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="text-[11px] font-medium truncate">
              {space.city}
            </span>
          </div>
        </div>
      </div>

      <Field className="flex flex-col items-center gap-2">
        <FieldLabel className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
          La tua valutazione
        </FieldLabel>
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const isFilled = starIndex <= (hoverRating || rating);

            return (
              <Button
                key={starIndex}
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setRating(starIndex)}
                onMouseEnter={() => setHoverRating(starIndex)}
                className="h-12 w-12 rounded-full transition-transform hover:scale-125 hover:bg-transparent focus-visible:ring-accent"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    isFilled
                      ? "fill-yellow-400 text-yellow-500" // Piena
                      : "text-muted-foreground/30 hover:text-yellow-400", // Vuota
                  )}
                />
              </Button>
            );
          })}
        </div>
        {rating > 0 && (
          <span className="text-sm font-bold text-yellow-600 animate-in fade-in slide-in-from-top-1 mt-1">
            {rating === 1
              ? "Pessimo"
              : rating === 2
                ? "Scarso"
                : rating === 3
                  ? "Nella media"
                  : rating === 4
                    ? "Ottimo"
                    : "Eccellente!"}
          </span>
        )}
      </Field>

      <Field className="space-y-3">
        <FieldLabel className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1">
          <MessageSquareText className="h-4 w-4 text-accent" /> Racconta la tua
          esperienza
        </FieldLabel>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Come ti sei trovato? Racconta la tua esperienza agli altri utenti..."
          rows={4}
          className="resize-none rounded-xl border-border/50 bg-secondary/5 p-4 font-medium text-sm focus-visible:ring-accent/20"
        />
      </Field>

      {/* Mostriamo eventuali errori generati dai nostri check */}
      {reviewError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive animate-in fade-in">
          {reviewError}
        </div>
      )}
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

          <div className="px-6 sm:px-8 pb-8 space-y-8">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 bg-muted">
              <Image
                src={space.imageUrls[0]}
                alt={space.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* INFO HOST */}
            {host && (
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background shadow-sm">
                {/* Dati Host (Avatar + Nome) */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                    <AvatarImage src={host.image || ""} />
                    <AvatarFallback>
                      {host.name?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                      Il tuo Host
                    </span>
                    <span className="font-bold text-foreground text-base leading-tight">
                      {host.name} {host.surname}
                    </span>
                  </div>
                </div>

                {/* Pulsante Messaggio */}
                <Button
                  variant="secondary"
                  size="icon"
                  disabled={isStartingChat}
                  onClick={handleContactHost}
                  className="rounded-full h-11 w-11 text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 shrink-0 transition-transform hover:scale-105"
                >
                  {isStartingChat ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                </Button>
              </div>
            )}

            {/* Dettagli Prenotazione */}
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
          </div>

          {/* SEZIONE AZIONI */}
          <SheetFooter className="px-6 sm:px-8 pb-8 flex-col sm:flex-col gap-3 sm:space-x-0 mt-auto">
            {/* Mostra il pulsante SOLO se la prenotazione è completata E NON ha ancora una recensione */}
            {booking.status === "COMPLETED" && !booking.review && (
              <Button
                className="w-full justify-start h-12 rounded-xl font-bold gap-3 shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
                onClick={handleStartReview}
              >
                <Star className="h-5 w-5 fill-current" /> Lascia un feedback
              </Button>
            )}

            {/* Se l'ha già lasciata, mostri un bel messaggio! */}
            {booking.status === "COMPLETED" && booking.review && (
              <div className="text-sm font-bold text-accent bg-accent/10 p-3 rounded-xl border border-accent/20 text-center">
                Hai recensito questo soggiorno ({booking.review.rating} stelle)
              </div>
            )}

            {/* Pulsante Ricevuta */}
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
                className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-2"
              >
                <AlertTriangle className="h-5 w-5" /> Cancella Prenotazione
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* MODALE CANCELLAZIONE */}
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

      {/* --- MODALE RECENSIONE --- */}
      {isDesktop ? (
        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                La tua opinione conta!
              </DialogTitle>
              <DialogDescription className="text-base font-medium">
                Com è andata la tua esperienza presso {space.title}?
              </DialogDescription>
            </DialogHeader>

            {ReviewFormContent}

            <DialogFooter className="flex-col sm:flex-col gap-3">
              <Button
                onClick={handleConfirmReview}
                disabled={isSubmittingReview}
                className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 gap-2"
              >
                {isSubmittingReview ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Pubblica Recensione"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-full rounded-xl font-bold text-muted-foreground h-12"
              >
                Annulla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DrawerContent className="rounded-t-[2.5rem] px-6 pb-8 overflow-y-auto max-h-[90vh]">
            <DrawerHeader className="px-0 text-left pt-8">
              <DrawerTitle className="text-3xl font-bold text-foreground tracking-tight">
                La tua opinione conta!
              </DrawerTitle>
              <DrawerDescription className="text-base font-medium">
                Com è andata la tua esperienza presso {space.title}?
              </DrawerDescription>
            </DrawerHeader>

            {ReviewFormContent}

            <DrawerFooter className="px-0 flex-col gap-3 mt-4">
              <Button
                onClick={handleConfirmReview}
                disabled={isSubmittingReview}
                className="w-full rounded-xl h-14 font-bold shadow-lg shadow-primary/20 gap-2"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Invio...
                  </>
                ) : (
                  "Pubblica Recensione"
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-full rounded-xl font-bold text-muted-foreground h-14"
              >
                Annulla
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
