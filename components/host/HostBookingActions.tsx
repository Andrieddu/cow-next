"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BookingStatus } from "@/generated/prisma/client";
import { updateBookingStatus } from "@/actions/booking-actions";

interface BookingActionsProps {
  bookingId: string;
}

export default function BookingActions({ bookingId }: BookingActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (status: BookingStatus) => {
    setIsProcessing(true);

    // Chiamiamo la Server Action per aggiornare lo stato della prenotazione
    const result = await updateBookingStatus(bookingId, status);

    setIsProcessing(false);

    if (result.success) {
      if (status === "CONFIRMED") {
        toast.success("Prenotazione accettata!", {
          description: "Il guest riceverà una notifica.",
        });
      } else {
        toast.info("Prenotazione rifiutata.", {
          description: "Lo spazio tornerà disponibile.",
        });
      }
    } else {
      toast.error("Errore", { description: result.error });
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <Button
        onClick={() => handleAction("CONFIRMED")}
        disabled={isProcessing}
        className="rounded-xl font-bold gap-2 shadow-md shadow-accent/20 flex-1 sm:flex-none"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Accetta
      </Button>

      <Button
        onClick={() => handleAction("CANCELLED")}
        disabled={isProcessing}
        variant="outline"
        className="rounded-xl font-bold gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive flex-1 sm:flex-none"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <X className="h-4 w-4" />
        )}
        Rifiuta
      </Button>
    </div>
  );
}
