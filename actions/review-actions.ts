"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validazione dei dati in ingresso
const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500).optional().or(z.literal("")),
});

export async function createReviewAction(
  bookingId: string,
  data: { rating: number; comment: string },
) {
  try {
    // 1. Autenticazione
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Non sei autorizzato. Effettua il login.",
      };
    }

    // 2. Validazione Dati
    const validatedFields = ReviewSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, error: "Dati della recensione non validi." };
    }

    const { rating, comment } = validatedFields.data;

    // 3. Verifica della prenotazione (Sicurezza massima)
    // Controlliamo che la prenotazione esista, sia dell'utente loggato e sia COMPLETED
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true }, // Includiamo l'eventuale recensione già esistente
    });

    if (!booking) {
      return { success: false, error: "Prenotazione non trovata." };
    }

    if (booking.userId !== user.id) {
      return {
        success: false,
        error: "Questa prenotazione non ti appartiene.",
      };
    }

    if (booking.status !== "COMPLETED") {
      return {
        success: false,
        error: "Puoi recensire solo i soggiorni completati.",
      };
    }

    if (booking.review) {
      return { success: false, error: "Hai già recensito questo soggiorno." };
    }

    // 4. Salvataggio nel Database
    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        spaceId: booking.spaceId,
        bookingId: booking.id, // Il collegamento 1-a-1 che abbiamo aggiunto allo schema!
      },
    });

    // 5. Aggiorniamo la UI in tempo reale
    revalidatePath("/profile");
    revalidatePath(`/space/${booking.spaceId}`); // Aggiorniamo anche la pagina dello spazio per far vedere la nuova recensione!

    return { success: true };
  } catch (error) {
    console.error("[Create Review Error]:", error);
    return {
      success: false,
      error:
        "Si è verificato un errore durante il salvataggio della recensione.",
    };
  }
}
