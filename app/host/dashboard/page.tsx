import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { redirect } from "next/navigation";
import {
  TrendingUp,
  Calendar as CalendarIcon,
  MessageSquare,
  Star,
  Plus,
  ArrowRight,
  MoreHorizontal,
  MapPin,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HostBookingActions from "@/components/host/HostBookingActions";

// IMPORT DATABASE E AUTH REALI
import { createClient } from "@/utils/supabase/server";
import { HostService } from "@/services/host-service";
import { UserService } from "@/services/user-service";

export default async function HostDashboardPage() {
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
    redirect("/profile"); // Se non sei Host, fuori da qui!
  }

  // 2. RECUPERO DATI REALI DAL DATABASE
  const hostSpaces = await HostService.getDashboardData(user.id);

  // 3. CALCOLI STATISTICHE SUI DATI REALI
  // // Appiattiamo tutte le prenotazioni in un unico array e aggiungiamo le info dello spazio
  const hostBookings = hostSpaces.flatMap((space) =>
    space.bookings.map((booking) => ({
      ...booking,
      space, // Alleghiamo le info dello spazio alla prenotazione
      guest: booking.user, // Rinominiamo 'user' in 'guest' per chiarezza
    })),
  );
  // Guadagni (Somma totalPrice delle prenotazioni CONFIRMED o COMPLETED)
  const totalEarnings = hostBookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  // Numero prenotazioni attive/confermate
  const totalBookingsCount = hostBookings.filter(
    (b) => b.status !== "CANCELLED",
  ).length;
  // Media recensioni dell'host
  const allReviews = hostSpaces.flatMap((space) => space.reviews);
  const hostAverageRating =
    allReviews.length === 0
      ? "0.00"
      : (
          allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        ).toFixed(2);

  // 4. RICERCA LE PRENOTAZIONI REALI 'PENDING'
  const pendingRequests = hostBookings.filter((b) => b.status === "PENDING");
  // Prossimi arrivi (Confermati, futuri o di oggi, presi i primi 3)
  const upcomingArrivals = hostBookings
    .filter(
      (b) =>
        b.status === "CONFIRMED" &&
        new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0)),
    )
    .slice(0, 3);

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {" "}
      {/* 1. HEADER DELLA DASHBOARD */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Dashboard Host
            </h1>
            <Badge className="hidden md:inline-flex bg-accent/10 text-accent border-none font-bold uppercase tracking-widest text-[10px]">
              Modalità Host
            </Badge>
          </div>
          <Link href="/profile">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-bold border-border/50"
            >
              Passa a Viaggiatore
            </Button>
          </Link>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-6 pt-10">
        {/* 2. STATISTICHE MENSILI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* ... Card Guadagni ... */}
          <Link href="/host/earnings" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Guadagni Totali
                </span>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  € {totalEarnings.toFixed(2)}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vedi storico <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>

          {/* ... Card Prenotazioni ... */}
          <Link href="/host/bookings" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Prenotazioni
                </span>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {totalBookingsCount}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vai alle prenotazioni <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>

          {/* ... Card Messaggi ... */}
          <Link href="/messages" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Messaggi
                </span>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  0
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vai alla posta <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>

          {/* ... Card Valutazioni ... */}
          <Link href="/host/reviews" className="block group">
            <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col gap-4 group-hover:border-accent/30 group-hover:shadow-md transition-all h-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Valutazione
                </span>
                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {hostAverageRating}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1">
                  Vedi recensioni <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </div>
          </Link>
        </div>
        {/* 3. LAYOUT PRINCIPALE A DUE COLONNE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNA SINISTRA: Richieste e Attività */}{" "}
          <div className="lg:col-span-8 space-y-10">
            {/* --- SEZIONE RICHIESTE IN SOSPESO --- */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">
                  Richieste in sospeso ({pendingRequests.length})
                </h3>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="bg-background rounded-[2rem] p-8 text-center shadow-sm border border-border/50">
                  <p className="text-muted-foreground font-bold">
                    Nessuna richiesta in attesa di conferma.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-background rounded-[2rem] p-6 shadow-sm border-2 border-accent/20 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent" />

                      <div className="flex flex-col items-center gap-2 shrink-0 sm:w-24">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                          <AvatarImage src={request.guest?.image || ""} />
                          <AvatarFallback>
                            {request.guest?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-center truncate w-full">
                          {request.guest?.name}{" "}
                          {request.guest?.surname?.charAt(0)}.
                        </span>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg">
                            {request.space?.title}
                          </h4>
                          <span className="font-extrabold text-lg text-accent">
                            € {request.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-medium text-muted-foreground mb-4">
                          <span className="flex items-center gap-2 capitalize">
                            <CalendarIcon className="h-4 w-4" />{" "}
                            {format(
                              new Date(request.date),
                              "EEEE dd MMM yyyy",
                              { locale: it },
                            )}{" "}
                            • {request.startTime} - {request.endTime}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" /> Richiesta prenotazione
                          </span>
                        </div>

                        {/* Tasti azione Host */}
                        <HostBookingActions bookingId={request.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* --- SEZIONE ARRIVI CONFERMATI --- */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">
                  Prossimi arrivi
                </h3>
                <Link
                  href="/host/calendar"
                  className="text-sm font-bold text-accent hover:underline"
                >
                  Vedi tutti
                </Link>
              </div>

              {upcomingArrivals.length === 0 ? (
                <div className="bg-background rounded-[2rem] p-8 text-center shadow-sm border border-border/50">
                  <p className="text-muted-foreground font-bold">
                    Nessun arrivo previsto a breve.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {upcomingArrivals.map((arrival) => (
                    <div
                      key={arrival.id}
                      className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row items-center gap-6"
                    >
                      <div className="bg-secondary/10 rounded-2xl w-16 h-16 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                          {format(new Date(arrival.date), "MMM", {
                            locale: it,
                          })}
                        </span>
                        <span className="text-xl font-black">
                          {format(new Date(arrival.date), "dd")}
                        </span>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-lg mb-1">
                          {arrival.guest?.name} {arrival.guest?.surname}
                        </h4>
                        <p className="text-sm font-medium text-muted-foreground">
                          {arrival.space?.title} • {arrival.startTime} -{" "}
                          {arrival.endTime}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-xl font-bold border-border/50 w-full sm:w-auto gap-2"
                      >
                        Dettagli{" "}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          {/* COLONNA DESTRA: I tuoi Spazi */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold tracking-tight">
                I tuoi spazi ({hostSpaces.length})
              </h3>
              <Link
                href="/host/listing"
                className="text-sm font-bold text-accent hover:underline underline-offset-4"
              >
                Vedi tutti
              </Link>
            </div>

            <Link href="/host/create" className="block">
              <Button
                variant="outline"
                className="w-full h-16 rounded-2xl border-2 border-dashed border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-bold text-base gap-2 transition-all"
              >
                <Plus className="h-5 w-5" /> Aggiungi spazio
              </Button>
            </Link>

            <div className="flex flex-col gap-4">
              {hostSpaces.length === 0 ? (
                <div className="p-4 text-center text-sm font-bold text-muted-foreground border border-border/50 rounded-2xl bg-background">
                  Non hai ancora creato nessuno spazio.
                </div>
              ) : (
                hostSpaces.map((space) => (
                  <div
                    key={space.id}
                    className="bg-background border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="relative h-16 w-20 rounded-xl overflow-hidden shrink-0 border border-border/50 bg-muted">
                      <Image
                        src={
                          space.imageUrls[0] ||
                          "https://images.unsplash.com/photo-1497366216548-37526070297c"
                        }
                        alt={space.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold truncate text-foreground group-hover:text-accent transition-colors">
                        {space.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="text-[11px] font-medium truncate">
                          {space.address}, {space.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className={`h-2 w-2 rounded-full ${space.isActive ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {space.isActive ? "Attivo" : "In Bozza"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground shrink-0"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
