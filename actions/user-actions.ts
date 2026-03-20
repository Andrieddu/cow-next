"use server";

import { UserService } from "@/services/user-service";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

// 1. Definiamo le regole (Schema Zod)
const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  surname: z.string().min(2, "Il cognome deve avere almeno 2 caratteri"),
  phone: z.string().optional(),
});

export async function updateUserProfileAction(
  userId: string,
  prevState: any,
  formData: FormData,
) {
  // --- AUTH REALE (Stato 401) ---
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Controllo di sicurezza granitico:
  // 1. Devi essere loggato
  // 2. L'ID che stai cercando di modificare DEVE essere il tuo
  if (error || !user) {
    return {
      success: false,
      status: 401,
      error: "Non sei autorizzato. Effettua il login.",
    };
  }

  // --- VALIDAZIONE DATI (Stato 400) ---
  // Estraiamo i dati dal FormData (che arriva dal client) e li passiamo a Zod
  const validatedFields = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
    surname: formData.get("surname"),
    phone: formData.get("phone") || undefined, // Rendi phone undefined se è una stringa vuota
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
    const { name, surname, phone } = validatedFields.data;

    // Chiamiamo il nostro Service
    await UserService.updateProfile(userId, { name, surname, phone });

    // Diciamo a Next.js di aggiornare i dati sulla pagina del profilo
    revalidatePath("/profile");
    revalidatePath("/profile/settings");

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
