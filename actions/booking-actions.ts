"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@/generated/prisma/client";
import { createClient } from "@/utils/supabase/server";

interface BookingData {
  spaceId: string;
  startDate: string;
  startTime: string;
  endTime: string;
  isFullDay: boolean;
  totalPrice: number;
}

export async function createBookingAction(data: BookingData) {
  try {
    // 1. VERIFICA AUTENTICAZIONE CON SUPABASE
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Se l'utente non è loggato, blocchiamo tutto subito
    if (authError || !user) {
      return {
        success: false,
        error: "Devi effettuare l'accesso per poter prenotare uno spazio.",
      };
    }

    // 2. Recuperiamo lo spazio per verificare la regola "Instant Booking"
    const space = await prisma.space.findUnique({
      where: { id: data.spaceId },
      select: { instantBooking: true },
    });

    if (!space) {
      return { success: false, error: "Lo spazio richiesto non esiste più." };
    }

    // 3. Determiniamo lo stato automaticamente
    const bookingStatus: BookingStatus = space.instantBooking
      ? "CONFIRMED"
      : "PENDING";

    // 4. Scriviamo nella tabella Booking associandola all'ID VERO dell'utente loggato
    const newBooking = await prisma.booking.create({
      data: {
        spaceId: data.spaceId,
        userId: user.id,
        date: new Date(data.startDate),
        startTime: data.startTime,
        endTime: data.endTime,
        isFullDay: data.isFullDay,
        totalPrice: data.totalPrice,
        status: bookingStatus,
      },
    });

    // 5. Aggiorniamo le cache di Next.js
    revalidatePath("/dashboard");
    revalidatePath("/profile/bookings");

    // 6. Restituiamo il risultato
    return {
      success: true,
      bookingId: newBooking.id,
      status: bookingStatus,
    };
  } catch (error) {
    console.error("[Booking Action Error]:", error);
    return {
      success: false,
      error: "Impossibile salvare la prenotazione nel database.",
    };
  }
}
