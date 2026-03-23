"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Download,
  Star,
  MapPin,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// I TUOI COMPONENTI FIELD
import { Field, FieldLabel } from "@/components/ui/field";

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

// HELPERS INTERNI
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => matchMedia.removeEventListener("change", callback);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
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

export default function PastBookingCardClient({ booking }: { booking: any }) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const space = booking.space;
  const day = format(new Date(booking.date), "dd");

  const handleConfirmReview = async () => {
    // Validazione base
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

    // QUI AGGIUNGEREMO LA SERVER ACTION
    console.log("Dati recensione Storico:", {
      rating,
      comment,
      bookingId: booking.id,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmittingReview(false);
    setIsReviewModalOpen(false);
    toast.success("Grazie!", {
      description: "La tua recensione è stata pubblicata con successo.",
    });
  };

  // --- CONTENUTO DEL MODALE ---
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
                      ? "fill-yellow-400 text-yellow-500"
                      : "text-muted-foreground/30 hover:text-yellow-400",
                  )}
                />
              </Button>
            );
          })}
        </div>
        {rating > 0 && (
          <span className="text-sm font-bold text-yellow-600 animate-in fade-in slide-in-from-top-1 mt-1">
            {
              ["Pessimo", "Scarso", "Nella media", "Ottimo", "Eccellente!"][
                rating - 1
              ]
            }
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

      {reviewError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive animate-in fade-in">
          {reviewError}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* LA TUA CARD COMPATTA */}
      <div className="bg-background rounded-3xl p-5 shadow-sm border border-border/40 flex flex-col md:flex-row items-start md:items-center gap-6 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="bg-muted rounded-xl w-16 h-16 flex flex-col items-center justify-center shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            {format(new Date(booking.date), "MMM", { locale: it })}
          </span>
          <span className="text-xl font-bold text-foreground leading-none mt-1">
            {day}
          </span>
        </div>

        <div className="flex-1 w-full overflow-hidden">
          <h4 className="text-lg font-bold truncate">{space?.title}</h4>
          <p className="text-sm font-medium text-muted-foreground truncate">
            {formatSpaceType(space?.type)} • {space?.city}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl font-bold border-border/50 gap-2 h-10"
            onClick={() => toast.info("Download in corso...")}
          >
            <Download className="h-4 w-4" /> Ricevuta
          </Button>

          {/* LOGICA BOTTONE: Se ha recensito mostra il voto, altrimenti il bottone */}
          {booking.review ? (
            <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl font-bold text-sm text-accent bg-accent/10 px-4 h-10 border border-accent/20 cursor-default">
              {booking.review.rating}{" "}
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsReviewModalOpen(true)}
              className="flex-1 rounded-xl font-bold gap-2 h-10"
            >
              <Star className="h-4 w-4 text-primary" fill="currentColor" />{" "}
              Recensisci
            </Button>
          )}
        </div>
      </div>

      {/* MODALE RECENSIONE */}
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
