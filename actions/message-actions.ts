"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(conversationId: string, text: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non autorizzato");

  // 1. Creiamo il messaggio vero in Prisma
  const newMessage = await prisma.message.create({
    data: {
      text: text,
      senderId: user.id,
      conversationId: conversationId,
    },
  });

  // 2. Aggiorniamo la data "updatedAt" della conversazione
  // Così la chat balza in cima alla lista delle conversazioni recenti!
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // 3. Diciamo a Next.js di aggiornare i dati della pagina in background
  revalidatePath("/messages");

  return newMessage;
}

export async function getOrCreateConversationAction(
  hostId: string,
  bookingId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non autorizzato");

  // 1. Cerchiamo se esiste già una conversazione per questa specifica prenotazione
  let conversation = await prisma.conversation.findFirst({
    where: {
      bookingId: bookingId,
      participants: {
        some: { id: user.id }, // Dove ci sono anche io
      },
    },
  });

  // 2. Se NON esiste, creiamo la stanza della chat!
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        bookingId: bookingId,
        participants: {
          connect: [
            { id: user.id }, // Collego me stesso
            { id: hostId }, // Collego l'Host
          ],
        },
      },
    });
  }

  // Restituiamo l'ID della conversazione in modo da poter reindirizzare l'utente
  return conversation.id;
}

export async function markMessagesAsReadAction(conversationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  // Aggiorniamo tutti i messaggi non letti inviati DALL'ALTRO utente
  await prisma.message.updateMany({
    where: {
      conversationId: conversationId,
      senderId: { not: user.id }, // Non i miei messaggi
      read: false, // Solo quelli non letti
    },
    data: {
      read: true, // Mettiamo la spunta!
    },
  });

  // Diciamo a Next.js di ricaricare i contatori della Dashboard in background!
  revalidatePath("/host");
  revalidatePath("/messages");
  revalidatePath("/profile");

  return { success: true };
}
