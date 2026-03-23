import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { isBefore, startOfDay } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { UserService } from "@/services/user-service";
import BookingCardClient from "@/components/profile/BookingCardClient";
import PastBookingCardClient from "@/components/profile/PastBookingCardClient";

export default async function BookingsPage() {
  // 2. AUTENTICAZIONE
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 3. RECUPERO DATI DAL DB
  const currentUser = await UserService.getProfileWithBookings(user.id);

  if (!currentUser) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Utente non trovato</h2>
        <Link href="/profile">
          <Button>Vai al Profilo</Button>
        </Link>
      </div>
    );
  }

  // 4. LOGICA DI DIVISIONE PRENOTAZIONI
  const allBookings = currentUser.bookings || [];
  const today = startOfDay(new Date());

  const upcomingBookings = allBookings.filter(
    (b: any) => !isBefore(new Date(b.date), today),
  );

  const pastBookings = allBookings.filter((b: any) =>
    isBefore(new Date(b.date), today),
  );

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-4xl mx-auto px-6 pt-8 md:pt-12">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Profilo
        </Link>

        <Tabs defaultValue="in-arrivo" className="w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Le mie prenotazioni
              </h1>
              <p className="text-muted-foreground font-medium mt-2">
                Gestisci i tuoi prossimi spazi o rivedi lo storico.
              </p>
            </div>

            <TabsList className="flex bg-background border border-border/50 rounded-xl p-1 shadow-sm h-auto w-fit">
              <TabsTrigger
                value="in-arrivo"
                className="px-5 py-2 rounded-lg font-bold text-sm"
              >
                In arrivo
              </TabsTrigger>
              <TabsTrigger
                value="passate"
                className="px-5 py-2 rounded-lg font-bold text-sm"
              >
                Passate
              </TabsTrigger>
            </TabsList>
          </div>

          {/* === TAB: IN ARRIVO === */}
          <TabsContent
            value="in-arrivo"
            className="mt-0 flex flex-col gap-6 outline-none"
          >
            {upcomingBookings.length === 0 ? (
              <div className="bg-background rounded-[2rem] p-12 text-center border-2 border-dashed border-border/50">
                <p className="text-muted-foreground font-bold">
                  Nessuna prenotazione in arrivo.
                </p>
                <Link href="/search">
                  <Button className="mt-4 rounded-xl font-bold">
                    Trova uno spazio
                  </Button>
                </Link>
              </div>
            ) : (
              upcomingBookings.map((booking: any) => (
                <BookingCardClient key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          {/* === TAB: PASSATE === */}
          <TabsContent
            value="passate"
            className="mt-0 flex flex-col gap-6 outline-none"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Storico Recente
            </h2>
            <div className="flex flex-col gap-4">
              {pastBookings.length === 0 ? (
                <p className="text-sm font-medium text-muted-foreground italic">
                  Nessuna prenotazione passata.
                </p>
              ) : (
                pastBookings.map((booking: any) => (
                  <PastBookingCardClient key={booking.id} booking={booking} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
