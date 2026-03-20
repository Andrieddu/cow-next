"use server";

import { UserService } from "@/services/user-service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Definiamo le regole (Schema Zod)
const UpdateProfileSchema = z.object({
  id: z.string().min(1, "ID utente mancante"),
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  surname: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  phone: z.string().optional(),
});

export async function updateUserProfileAction(formData: FormData) {
  // --- SIMULAZIONE AUTH (Stato 401) ---
  // In futuro qui useremo Supabase Auth. Per ora fingiamo che l'utente sia loggato.
  const isLogged = true;
  if (!isLogged) {
    return {
      success: false,
      status: 401,
      error: "Non sei autorizzato. Effettua il login.",
    };
  }

  // --- VALIDAZIONE DATI (Stato 400) ---
  // Estraiamo i dati dal FormData (che arriva dal client) e li passiamo a Zod
  const validatedFields = UpdateProfileSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    surname: formData.get("surname"),
    phone: formData.get("phone"),
  });

  // Se Zod trova errori (es. nome troppo corto)
  if (!validatedFields.success) {
    // Usiamo .flatten() che formatta gli errori in modo perfetto per i form
    const fieldErrors = validatedFields.error.flatten().fieldErrors;

    // Prendiamo il primo errore disponibile, oppure un messaggio generico
    const firstError =
      Object.values(fieldErrors).flat()[0] || "Dati non validi";

    return {
      success: false,
      status: 400,
      error: firstError,
    };
  }

  // --- ESECUZIONE (Stato 200 o 500) ---
  try {
    const { id, name, surname, phone } = validatedFields.data;

    // Chiamiamo il nostro Service
    await UserService.updateProfile(id, { name, surname, phone });

    // Diciamo a Next.js di aggiornare i dati sulla pagina del profilo
    revalidatePath("/profile");

    // Successo! (Stato 200)
    return {
      success: true,
      status: 200,
      message: "Profilo aggiornato con successo!",
    };
  } catch (error) {
    // Errore critico del database (Stato 500)
    console.error("[UserAction Error]:", error);

    return {
      success: false,
      status: 500,
      error:
        "Si è verificato un errore tecnico nel salvataggio. Riprova più tardi.",
    };
  }
}
