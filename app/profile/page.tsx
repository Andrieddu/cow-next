import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Edit2,
  LogOut,
  MessageSquare,
} from "lucide-react";
import BookingCardClient from "@/components/profile/BookingCardClient";

// 1. IMPORTIAMO SUPABASE E IL REDIRECT
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth-actions";

import { UserService } from "@/services/user-service";

export default async function ProfilePage() {
  // 2. RECUPERO UTENTE LOGGATO
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 3. PROTEZIONE ROTTA: Se non sei loggato, vai al login
  if (error || !user) {
    redirect("/login");
  }

  // 4. RECUPERO DATI DAL DB TRAMITE L'ID DI SUPABASE
  const currentUser = await UserService.getProfileWithBookings(user.id);

  // --- LOGICA DINAMICA PER IL TASTO HOST ---
  const isHost = currentUser?.role === "HOST" || currentUser?.role === "ADMIN";
  const hostButtonText = isHost ? "Passa a Modalità Host" : "Diventa Host";
  const hostButtonLink = isHost ? "/host/dashboard" : "/become-host";

  // Fallback in caso di latenza del trigger o disallineamento
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-secondary/5">
        <div className="bg-background p-8 rounded-3xl shadow-sm text-center border border-border/50">
          <h2 className="text-xl font-bold mb-2">Profilo in elaborazione</h2>
          <p className="text-muted-foreground">
            Stiamo sincronizzando i tuoi dati. Ricarica la pagina tra pochi
            secondi.
          </p>
        </div>
      </div>
    );
  }

  const userBookings = currentUser.bookings || [];

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        {/* =========================================
            1. HEADER PROFILO (Dati Utente Dinamici)
            ========================================= */}
        <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

          <div className="relative shrink-0">
            <div className="h-32 w-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-secondary/20 flex items-center justify-center">
              <Image
                src={currentUser.image || "https://github.com/shadcn.png"}
                alt={`${currentUser.name || "Utente"} ${currentUser.surname || ""}`}
                width={128}
                height={128}
                className="object-cover"
                unoptimized
              />
            </div>
            <Link
              href="/profile/settings"
              className="absolute bottom-0 right-0 h-10 w-10 bg-background rounded-full border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-accent hover:scale-110 transition-all cursor-pointer"
            >
              <Edit2 className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-widest mb-3">
              {currentUser.role === "ADMIN"
                ? "Amministratore"
                : currentUser.role === "HOST"
                  ? "Host Verificato"
                  : "Membro Base"}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {currentUser.name} {currentUser.surname}
            </h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 opacity-70" /> Milano, Italia
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-64 mt-4 md:mt-0">
            <Link href={hostButtonLink} className="w-full">
              <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                {hostButtonText}
              </Button>
            </Link>
            <Link href="/messages" className="w-full">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-secondary/10 hover:text-accent transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5 text-accent" /> Messaggi
              </Button>
            </Link>
            <Link href="/profile/settings" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-secondary/10 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2"
              >
                <Settings className="h-5 w-5 text-accent" /> Impostazioni
              </Button>
            </Link>
            {/* AGGIUNTO IL FORM PER IL LOGOUT REALE */}
            <form action={logout} className="w-full">
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="h-5 w-5" /> Esci
              </Button>
            </form>
          </div>
        </div>

        {/* =========================================
            2. GRIGLIA CONTENUTI
            ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLONNA SINISTRA: Info Personali */}
          <div className="flex flex-col gap-8">
            <div className="bg-background rounded-[2.5rem] p-8 shadow-sm border border-border/50">
              <h3 className="text-xl font-bold tracking-tight mb-6">
                Dati Personali
              </h3>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                    Email
                  </span>
                  <span className="font-medium flex items-center gap-2 truncate">
                    <Mail className="h-4 w-4 text-accent shrink-0" />{" "}
                    {currentUser.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                    Telefono
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent shrink-0" />{" "}
                    {currentUser.phone || "Non inserito"}
                  </span>
                </div>
              </div>
            </div>

            {/* VISIBILE SOLO SE HOST O ADMIN */}
            {isHost && (
              <div className="bg-accent/5 border border-accent/20 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-colors duration-500" />
                <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground relative z-10">
                  Hai uno spazio libero?
                </h3>
                <p className="text-muted-foreground font-medium text-sm mb-6 relative z-10">
                  Metti a rendita la tua scrivania o sala meeting. Diventa Host
                  e inizia a guadagnare oggi stesso.
                </p>
                <Link
                  href="/host/create"
                  className="relative z-10 w-full block"
                >
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl font-bold border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
                  >
                    Aggiungi uno spazio
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* COLONNA DESTRA: Prenotazioni Dinamiche */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Le tue Prenotazioni
              </h2>
              {userBookings.length > 2 && (
                <Link
                  href="/profile/bookings/all"
                  className="text-sm font-bold text-accent hover:underline underline-offset-4"
                >
                  Vedi tutte
                </Link>
              )}
            </div>

            {userBookings.length === 0 ? (
              <div className="mt-4 rounded-[2rem] border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  Nessuna prenotazione attiva
                </h4>
                <p className="text-muted-foreground font-medium mb-6 max-w-sm">
                  Trova lo spazio perfetto per le tue esigenze e prenota in
                  pochi click.
                </p>
                <Link href="/search">
                  <Button className="rounded-xl font-bold shadow-sm h-11 px-8 hover:scale-[1.02] transition-transform">
                    Cerca uno spazio
                  </Button>
                </Link>
              </div>
            ) : (
              userBookings.map((booking) => {
                const space = booking.space;
                if (!space) return null;

                return <BookingCardClient key={booking.id} booking={booking} />;
              })
            )}

            {userBookings.length > 0 && (
              <div className="mt-4 rounded-[2rem] border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  Pianifica la tua prossima sessione
                </h4>
                <p className="text-muted-foreground font-medium mb-6 max-w-sm">
                  Trova lo spazio perfetto per le tue esigenze e prenota in
                  pochi click.
                </p>
                <Link href="/search">
                  <Button className="rounded-xl font-bold shadow-sm h-11 px-8 hover:scale-[1.02] transition-transform">
                    Cerca uno spazio
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
