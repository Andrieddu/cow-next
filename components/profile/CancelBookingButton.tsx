"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateBookingStatus } from "@/actions/booking-actions";

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    // Chiediamo conferma all'utente
    const confirm = window.confirm(
      "Sei sicuro di voler annullare questa prenotazione? L'operazione non può essere annullata.",
    );

    if (!confirm) return;

    setIsProcessing(true);

    // Chiamiamo la Server Action impostando lo stato su CANCELLED
    const result = await updateBookingStatus(bookingId, "CANCELLED");

    setIsProcessing(false);

    if (result.success) {
      toast.success("Prenotazione annullata", {
        description: "L'Host è stato informato della tua cancellazione.",
      });
    } else {
      toast.error("Errore", { description: result.error });
    }
  };

  return (
    <Button
      onClick={handleCancel}
      disabled={isProcessing}
      variant="outline"
      className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-4 shadow-sm"
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <AlertTriangle className="h-5 w-5" />
      )}
      {isProcessing ? "Cancellazione in corso..." : "Cancella Prenotazione"}
    </Button>
  );
}
