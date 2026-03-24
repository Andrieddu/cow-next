import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MessagesClient from "@/components/messages/MessagesClient";

export default async function MessagesServerPage() {
  const supabase = await createClient();

  // 1. Controlliamo chi è l'utente loggato
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 2. Interroghiamo Prisma per prendere le SUE vere conversazioni
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { id: user.id }, // Prendi solo le chat dove partecipo io
      },
    },
    include: {
      participants: true, // Vogliamo i dati dell'altra persona (nome, foto)
      messages: {
        orderBy: { createdAt: "asc" }, // Ordine cronologico dal più vecchio al più nuovo
      },
      booking: {
        include: { space: true }, // Vogliamo il nome dello spazio se c'è una prenotazione
      },
    },
    orderBy: {
      updatedAt: "desc", // Le chat più recenti in alto
    },
  });

  // 3. Traduciamo i dati di Prisma nel formato del tuo "Mock"
  const formattedChats = conversations.map((conv) => {
    // Troviamo l'altra persona nella chat (chi non ha il mio ID)
    const otherUser =
      conv.participants.find((p) => p.id !== user.id) || conv.participants[0];

    return {
      id: conv.id,
      name:
        otherUser.name && otherUser.surname
          ? `${otherUser.name} ${otherUser.surname}`
          : "Utente",
      avatar: otherUser.image || "",
      status: "Offline", // Per ora statico, poi aggiungeremo il realtime presence
      bookingContext: conv.booking
        ? conv.booking.space.title
        : "Nessuna prenotazione",
      dateContext: conv.booking
        ? new Date(conv.booking.date).toLocaleDateString("it-IT")
        : "Chat diretta",
      lastTime:
        conv.messages.length > 0
          ? new Date(
              conv.messages[conv.messages.length - 1].createdAt,
            ).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      messages: conv.messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        sender: (msg.senderId === user.id ? "me" : "them") as "me" | "them",
        time: new Date(msg.createdAt).toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    };
  });

  // Se l'utente non ha chat, passiamo un array vuoto
  return (
    <MessagesClient initialChats={formattedChats} currentUserId={user.id} />
  );
}
