"use server";

import { prisma } from "@/lib/prisma";
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

  // Recuperiamo le amenities e gli orari
  const amenities = formData.getAll("amenities") as string[];
  const openDaysRaw = formData.getAll("openDays") as string[];
  const openDays = openDaysRaw.map((day) => parseInt(day, 10));
  const instantBooking = formData.get("instantBooking") === "on";

  // LEGGIAMO QUALE TASTO È STATO PREMUTO
  const actionType = formData.get("actionType");
  const isActive = actionType === "publish"; // true se premi "Pubblica", false se premi "Bozza"

  // --- 📸 LOGICA UPLOAD IMMAGINI SU SUPABASE ---
  const rawImageFiles = formData.getAll("images") as File[];

  // Filtriamo file vuoti che alcuni browser potrebbero inviare
  const validImageFiles = rawImageFiles.filter(
    (f) => f.size > 0 && f.name !== "undefined",
  );

  // Controllo Server-Side: devono essere esattamente 5
  if (validImageFiles.length !== 5) {
    return {
      success: false,
      status: 400,
      error: "Devi caricare esattamente 5 immagini per il tuo spazio.",
    };
  }

  const imageUrls: string[] = [];

  try {
    // Cicliamo e carichiamo i 5 file sul bucket "spaces"
    for (const file of validImageFiles) {
      const fileExt = file.name.split(".").pop();
      // Creiamo un nome file unico: idUtente/stringaRandom_timestamp.estensione
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("spaces") // Assicurati che il bucket si chiami esattamente così
        .upload(filePath, file);

      if (uploadError) {
        console.error("Errore Storage:", uploadError);
        return {
          success: false,
          status: 500,
          error:
            "Impossibile caricare alcune immagini. Assicurati che non superino i 2MB e riprova.",
        };
      }

      // Recuperiamo l'URL pubblico per salvarlo nel database
      const {
        data: { publicUrl },
      } = supabase.storage.from("spaces").getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }

    // --- 💾 SALVATAGGIO NEL DATABASE ---
    const newSpace = await SpaceService.createSpace({
      ...validatedFields.data,
      amenities,
      openDays,
      instantBooking,
      isActive,
      hostId: user.id,
      imageUrls: imageUrls, // <-- Ora passiamo i link reali di Supabase!
    });

    // Se tutto va bene, ricarichiamo le cache
    revalidatePath("/host/dashboard");
    revalidatePath("/host/listing");

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

export async function updateSpaceAction(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, status: 401, error: "Non autorizzato." };
    }

    const spaceId = formData.get("spaceId") as string;

    // Verifica sicurezza: l'host è proprietario?
    const existingSpace = await prisma.space.findUnique({
      where: { id: spaceId },
      select: { hostId: true },
    });

    if (!existingSpace || existingSpace.hostId !== user.id) {
      return {
        success: false,
        status: 403,
        error: "Spazio non trovato o accesso negato.",
      };
    }

    const title = formData.get("title") as string;
    const type = formData.get("type") as any;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const description = formData.get("description") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const openingTime = formData.get("openingTime") as string;
    const closingTime = formData.get("closingTime") as string;
    const hourlyPrice = formData.get("hourlyPrice")
      ? parseFloat(formData.get("hourlyPrice") as string)
      : null;
    const dailyPrice = formData.get("dailyPrice")
      ? parseFloat(formData.get("dailyPrice") as string)
      : null;
    const instantBooking = formData.get("instantBooking") === "on";

    const actionType = formData.get("actionType") as string;
    const isActive = actionType === "publish";

    const openDays = formData
      .getAll("openDays")
      .map((d) => parseInt(d as string, 10));
    const amenities = formData.getAll("amenities") as string[];

    // --- 📸 GESTIONE IMMAGINI IBRIDA (VECCHIE + NUOVE) ---
    // getAll("images") ci restituisce un array misto: le vecchie sono stringhe, le nuove sono File
    const rawImages = formData.getAll("images");

    if (rawImages.length !== 5) {
      return {
        success: false,
        status: 400,
        error: "Devi avere esattamente 5 immagini.",
      };
    }

    const finalImageUrls: string[] = [];

    for (const item of rawImages) {
      if (typeof item === "string") {
        // 1. È una vecchia immagine (stringa), manteniamo il link
        finalImageUrls.push(item);
      } else if (
        item instanceof File &&
        item.size > 0 &&
        item.name !== "undefined"
      ) {
        // 2. È una nuova immagine (File), la carichiamo su Supabase
        const fileExt = item.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("spaces")
          .upload(filePath, item);

        if (uploadError) {
          console.error("Errore Storage Update:", uploadError);
          return {
            success: false,
            status: 500,
            error: "Impossibile caricare alcune immagini.",
          };
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("spaces").getPublicUrl(filePath);

        finalImageUrls.push(publicUrl);
      }
    }

    // --- 💾 SALVATAGGIO NEL DATABASE ---
    await prisma.space.update({
      where: { id: spaceId },
      data: {
        title,
        type,
        capacity,
        description,
        address,
        city,
        openingTime,
        closingTime,
        hourlyPrice,
        dailyPrice,
        instantBooking,
        isActive,
        openDays,
        amenities,
        imageUrls: finalImageUrls, // <-- Array con i link vecchi conservati e i nuovi link generati!
      },
    });

    revalidatePath("/host/listing");
    revalidatePath("/host/dashboard");
    revalidatePath(`/space/${spaceId}`);

    return { success: true };
  } catch (error) {
    console.error("Errore aggiornamento:", error);
    return { success: false, error: "Errore durante l'aggiornamento." };
  }
}

export async function deleteSpaceAction(spaceId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Non autorizzato." };
    }

    // Per sicurezza, verifichiamo che lo spazio appartenga all'utente loggato
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      select: { hostId: true },
    });

    if (!space || space.hostId !== user.id) {
      return { success: false, error: "Spazio non trovato o non autorizzato." };
    }

    // Eliminiamo lo spazio (Prisma eliminerà a cascata anche le prenotazioni e recensioni collegate grazie a onDelete: Cascade)
    await prisma.space.delete({
      where: { id: spaceId },
    });

    revalidatePath("/host/dashboard");
    revalidatePath("/host/listing");

    return { success: true };
  } catch (error) {
    console.error("[Delete Space Error]:", error);
    return { success: false, error: "Impossibile eliminare lo spazio." };
  }
}
