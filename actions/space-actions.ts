"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { SpaceService } from "@/services/space-service";
import { revalidatePath } from "next/cache";
import { SpaceType } from "@/generated/prisma/client";

// Definiamo le regole in base al tuo schema Prisma
const CreateSpaceSchema = z.object({
  title: z.string().min(5, "Il titolo deve avere almeno 5 caratteri"),
  description: z
    .string()
    .min(20, "Descrivi meglio il tuo spazio (almeno 20 caratteri)"),

  type: z.nativeEnum(SpaceType, {
    message: "Seleziona un tipo di spazio valido",
  }),

  city: z.string().min(2, "La città è obbligatoria"),
  address: z.string().min(5, "L'indirizzo è obbligatorio"),
  capacity: z.coerce.number().min(1, "La capacità minima è 1 persona"),
  hourlyPrice: z.coerce
    .number()
    .min(1, "Il prezzo orario è obbligatorio e deve essere maggiore di 0"),
  dailyPrice: z.coerce
    .number()
    .min(1, "Il prezzo giornaliero è obbligatorio e deve essere maggiore di 0"),
  openingTime: z.string().default("09:00"),
  closingTime: z.string().default("18:00"),
});

export async function createSpaceAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      status: 401,
      error: "Devi essere loggato per creare uno spazio.",
    };
  }

  // Estraiamo e validiamo i campi testo/numerici
  const validatedFields = CreateSpaceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    city: formData.get("city"),
    address: formData.get("address"),
    capacity: formData.get("capacity"),
    hourlyPrice: formData.get("hourlyPrice"),
    dailyPrice: formData.get("dailyPrice"),
    openingTime: formData.get("openingTime"),
    closingTime: formData.get("closingTime"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError =
      Object.values(fieldErrors).flat()[0] || "Dati non validi";
    return { success: false, status: 400, error: firstError };
  }

  // Recuperiamo le amenities (es. checkbox multiple nel form)
  const amenities = formData.getAll("amenities") as string[];

  // I giorni arrivano come array di stringhe ["1", "2"], li trasformiamo in array di numeri [1, 2]
  const openDaysRaw = formData.getAll("openDays") as string[];
  const openDays = openDaysRaw.map((day) => parseInt(day, 10));

  // I checkbox/switch HTML mandano "on" se sono attivi
  const instantBooking = formData.get("instantBooking") === "on";

  // LEGGIAMO QUALE TASTO È STATO PREMUTO
  const actionType = formData.get("actionType");
  const isActive = actionType === "publish"; // true se premi "Pubblica", false se premi "Bozza"

  try {
    const newSpace = await SpaceService.createSpace({
      ...validatedFields.data,
      amenities,
      openDays,
      instantBooking,
      isActive,
      hostId: user.id,
      // Per ora mettiamo un'immagine segnaposto. In futuro la caricheremo su Supabase Storage!
      imageUrls: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
      ],
    });

    // Se tutto va bene, ricarichiamo la dashboard
    revalidatePath("/host/dashboard");

    // Ritorna l'ID dello spazio appena creato per poter fare il redirect dal Client
    return {
      success: true,
      status: 200,
      spaceId: newSpace.id,
      message: "Spazio creato con successo!",
    };
  } catch (error) {
    console.error("[CreateSpaceAction Error]:", error);
    return {
      success: false,
      status: 500,
      error: "Impossibile salvare lo spazio. Riprova più tardi.",
    };
  }
}
