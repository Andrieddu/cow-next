"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CancelBookingButtonProps {
  onClick: () => void;
}

export default function CancelBookingButton({
  onClick,
}: CancelBookingButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-4 shadow-sm"
    >
      <AlertTriangle className="h-5 w-5" /> Cancella Prenotazione
    </Button>
  );
}
