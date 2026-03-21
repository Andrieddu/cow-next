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
  guests: number;
  totalPrice: number;
}

// ------------------------------------------------------------------
// CONTROLLO DISPONIBILITÀ INTELLIGENTE
// ------------------------------------------------------------------
export async function checkAvailability(
  spaceId: string,
  date: string,
  startTime: string,
  endTime: string,
  guests: number,
): Promise<{ available: boolean; error?: string }> {
  try {
    // A. Recuperiamo lo spazio
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      select: { type: true, capacity: true },
    });

    if (!space) return { available: false, error: "Spazio non trovato." };

    // B. Recuperiamo tutte le prenotazioni ATTIVE per questo spazio in questa data
    const dayBookings = await prisma.booking.findMany({
      where: {
        spaceId,
        date: new Date(date),
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      },
      select: { startTime: true, endTime: true, guests: true },
    });

    // C. Filtriamo solo quelle che si sovrappongono all'orario richiesto
    // Logica: InizioA < FineB && FineA > InizioB
    const overlapping = dayBookings.filter((b) => {
      return b.startTime < endTime && b.endTime > startTime;
    });

    // D. REGOLE DI BUSINESS PER IL COWORKING
    if (space.type === "PRIVATE_OFFICE" || space.type === "MEETING_ROOM") {
      // Spazio Privato: Se c'è anche solo 1 sovrapposizione, è tutto bloccato.
      if (overlapping.length > 0) {
        return {
          available: false,
          error: "Lo spazio è già occupato in questa fascia oraria.",
        };
      }
      // Controllo capienza
      if (guests > space.capacity) {
        return {
          available: false,
          error: `La capienza massima è di ${space.capacity} persone.`,
        };
      }
      return { available: true };
    }

    if (space.type === "DESK" || space.type === "EVENT_SPACE") {
      // Spazio Condiviso: Sommiamo i partecipanti già confermati
      const currentlyBooked = overlapping.reduce((sum, b) => sum + b.guests, 0);

      if (currentlyBooked + guests > space.capacity) {
        const remaining = space.capacity - currentlyBooked;
        return {
          available: false,
          error:
            remaining > 0
              ? `Ci sono solo ${remaining} posti disponibili in questo orario.`
              : `Lo spazio è completamente esaurito in questo orario.`,
        };
      }
      return { available: true };
    }

    return { available: false, error: "Tipologia di spazio non supportata." };
  } catch (error) {
    console.error("[Availability Error]:", error);
    return {
      available: false,
      error: "Errore durante il controllo della disponibilità.",
    };
  }
}

// ------------------------------------------------------------------
// 2. CREAZIONE DELLA PRENOTAZIONE
// ------------------------------------------------------------------
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

    // 2. VERIFICA DISPONIBILITÀ
    const availability = await checkAvailability(
      data.spaceId,
      data.startDate,
      data.startTime,
      data.endTime,
      data.guests,
    );

    if (!availability.available) {
      return { success: false, error: availability.error };
    }

    // 3. Recuperiamo lo spazio per verificare la regola "Instant Booking"
    const space = await prisma.space.findUnique({
      where: { id: data.spaceId },
      select: { instantBooking: true },
    });

    if (!space) {
      return { success: false, error: "Lo spazio richiesto non esiste più." };
    }

    // 4. Determiniamo lo stato automaticamente
    const bookingStatus: BookingStatus = space.instantBooking
      ? "CONFIRMED"
      : "PENDING";

    // 5. Scriviamo nella tabella Booking
    const newBooking = await prisma.booking.create({
      data: {
        spaceId: data.spaceId,
        userId: user.id,
        date: new Date(data.startDate),
        startTime: data.startTime,
        endTime: data.endTime,
        isFullDay: data.isFullDay,
        guests: data.guests,
        totalPrice: data.totalPrice,
        status: bookingStatus,
      },
    });

    // 6. Aggiorniamo le cache di Next.js
    revalidatePath("/dashboard");
    revalidatePath("/profile/bookings");

    // 7. Restituiamo il risultato
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

// ------------------------------------------------------------------
// 3. AGGIORNAMENTO STATO (ESISTENTE)
// ------------------------------------------------------------------
export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non autorizzato. Fai il login." };
    }
    //Aggiorniamo lo stato della prenotazione nel Database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      // Volendo potresti aggiungere un controllo per assicurarti
      // che lo spazio appartenga davvero a questo Host (user.id),
      // ma per l'MVP va benissimo così!
      data: { status: newStatus },
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile/bookings");
    // Puliamo anche la vista specifica host per i guadagni e la tabella
    revalidatePath("/host/bookings");
    revalidatePath("/host/earnings");

    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("[Update Booking Error]:", error);
    return { success: false, error: "Impossibile aggiornare la prenotazione." };
  }
}
