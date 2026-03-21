"use client";

import React, { useTransition } from "react";
import { Loader2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateBookingStatus } from "@/actions/booking-actions";

export default function HostBookingDropdown({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  // useTransition è perfetto per eseguire le Server Actions senza bloccare la UI
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = (newStatus: "CONFIRMED" | "CANCELLED") => {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, newStatus as any);

      if (result.success) {
        toast.success(
          newStatus === "CONFIRMED"
            ? "Prenotazione approvata!"
            : "Prenotazione annullata.",
        );
      } else {
        toast.error("Errore", { description: result.error });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border-border/50 shadow-xl w-48 bg-white"
      >
        <DropdownMenuItem className="font-bold cursor-pointer">
          Vedi dettagli
        </DropdownMenuItem>
        <DropdownMenuItem className="font-bold cursor-pointer">
          Contatta ospite
        </DropdownMenuItem>

        {(status === "CONFIRMED" || status === "COMPLETED") && (
          <DropdownMenuItem className="font-bold cursor-pointer">
            Scarica ricevuta
          </DropdownMenuItem>
        )}

        {/* TASTO APPROVA (Solo se in attesa) */}
        {status === "PENDING" && (
          <>
            <Separator className="my-1" />
            <DropdownMenuItem
              onClick={() => handleUpdateStatus("CONFIRMED")}
              className="font-bold cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-500/10"
            >
              Approva prenotazione
            </DropdownMenuItem>
          </>
        )}

        {/* TASTO ANNULLA (Se in attesa o confermata) */}
        {(status === "PENDING" || status === "CONFIRMED") && (
          <>
            <Separator className="my-1" />
            <DropdownMenuItem
              onClick={() => handleUpdateStatus("CANCELLED")}
              className="font-bold cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              Annulla prenotazione
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
