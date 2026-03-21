import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// IMPORT DATABASE REALE
import { HostService } from "@/services/host-service";
import { UserService } from "@/services/user-service";

// IMPORTIAMO IL CLIENT COMPONENT
import HostCalendar from "@/components/host/HostCalendar";

export default async function HostCalendarPage() {
  // 1. AUTENTICAZIONE
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentUser = await UserService.getUserById(user.id);
  if (currentUser?.role !== "HOST" && currentUser?.role !== "ADMIN") {
    redirect("/profile");
  }

  // 2. RECUPERO DATI DAL DATABASE
  // Usiamo il service che tira giù tutti gli spazi e le nested bookings
  const hostSpaces = await HostService.getDashboardData(user.id);

  // 3. APPIATTIMENTO DATI
  // Trasformiamo la struttura ad albero in un array piatto di prenotazioni,
  // così è molto più facile da filtrare lato client.
  const allBookings = hostSpaces.flatMap((space) =>
    space.bookings.map((booking) => ({
      id: booking.id,
      date: booking.date.toISOString(), // Convertiamo in ISO string per passarlo sicuro al Client Component
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      guests: booking.guests,
      spaceTitle: space.title,
      guestName:
        `${booking.user?.name || "Utente"} ${booking.user?.surname || ""}`.trim(),
    })),
  );

  return <HostCalendar bookings={allBookings} />;
}
