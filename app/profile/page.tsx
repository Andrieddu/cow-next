import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Settings,
  Edit2,
  LogOut,
  Clock,
  Receipt,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

// 1. IMPORTIAMO IL SERVICE E I TIPI DI PRISMA AL POSTO DEL MOCK DATA
import { UserService } from "@/services/user-service";
import { SpaceType, BookingStatus } from "@/generated/prisma/client";

// --- HELPERS ---
const formatSpaceType = (type: SpaceType) => {
  const types: Record<SpaceType, string> = {
    DESK: "Desk",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    EVENT_SPACE: "Sala Eventi",
  };
  return types[type] || type;
};

const formatStatus = (status: BookingStatus) => {
  switch (status) {
    case "CONFIRMED":
      return "Confermata";
    case "PENDING":
      return "In Attesa";
    case "CANCELLED":
      return "Annullata";
    case "COMPLETED":
      return "Completata";
    default:
      return status;
  }
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-primary/10 text-primary-foreground border-primary/30";
    case "PENDING":
      return "bg-amber-500/10 text-amber-700 border-amber-500/30";
    case "CANCELLED":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "COMPLETED":
      return "bg-green-500/10 text-green-700 border-green-500/30";
    default:
      return "bg-secondary/10 text-foreground border-border/50";
  }
};

// 2. COMPONENTE SERVER (async, niente "use client")
export default async function ProfilePage() {
  // 3. RECUPERO DATI DAL DB (Usiamo Luigi Verdi dal seed)
  const currentUser = await UserService.getProfileWithBookings("seed-guest-1");

  if (!currentUser) {
    return (
      <div className="p-20 text-center font-bold">
        Utente non trovato. Fai il login.
      </div>
    );
  }

  // Estraiamo le prenotazioni per mantenere la stessa variabile che usavi tu
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
                alt={`${currentUser.name} ${currentUser.surname}`}
                width={128}
                height={128}
                className="object-cover"
                unoptimized
              />
            </div>
            <button className="absolute bottom-0 right-0 h-10 w-10 bg-background rounded-full border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-accent transition-colors">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-widest mb-3">
              Membro {currentUser.role === "USER" ? "Base" : currentUser.role}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {currentUser.name} {currentUser.surname}
            </h1>
            <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 opacity-70" /> Milano, Italia
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-64 mt-4 md:mt-0">
            <Link href="/host/dashboard" className="w-full">
              <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Passa a Modalità Host
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
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" /> Esci
            </Button>
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
                  <span className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" /> {currentUser.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                    Telefono
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent" />{" "}
                    {currentUser.phone || "Non inserito"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-colors duration-500" />
              <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground relative z-10">
                Hai uno spazio libero?
              </h3>
              <p className="text-muted-foreground font-medium text-sm mb-6 relative z-10">
                Metti a rendita la tua scrivania o sala meeting. Diventa Host e
                inizia a guadagnare oggi stesso.
              </p>
              <Link href="/host/create" className="relative z-10 w-full block">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-bold border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
                >
                  Aggiungi uno spazio
                </Button>
              </Link>
            </div>
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
                  <Button className="rounded-xl font-bold shadow-sm h-11 px-8">
                    Cerca uno spazio
                  </Button>
                </Link>
              </div>
            ) : (
              userBookings.map((booking) => {
                const space = booking.space;
                // Se lo spazio è stato cancellato dal db
                if (!space) return null;

                // 4. L'host ora arriva dal DB tramite l'include di Prisma!
                const host = space.host;

                const monthShort = format(booking.date, "MMM", { locale: it });
                const day = format(booking.date, "dd");
                const fullDateStr = format(booking.date, "EEEE dd MMMM yyyy", {
                  locale: it,
                });

                return (
                  <Sheet key={booking.id}>
                    {/* CARD ESTERNA NELLA LISTA */}
                    <div className="bg-background rounded-[2rem] p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                      {/* LA STRISCIA AMBER È STATA RIMOSSA DA QUI */}

                      <div className="bg-accent/10 rounded-2xl w-20 h-20 flex flex-col items-center justify-center shrink-0 border border-accent/20">
                        <span className="text-sm font-bold text-accent uppercase tracking-widest">
                          {monthShort}
                        </span>
                        <span className="text-2xl font-bold text-foreground leading-none mt-1">
                          {day}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                              getStatusColor(booking.status),
                            )}
                          >
                            {formatStatus(booking.status)}
                          </div>
                          <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {formatSpaceType(space.type)}
                          </div>
                        </div>

                        <h4 className="text-lg font-bold mb-1 truncate max-w-sm">
                          {space.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-accent shrink-0" />{" "}
                            {booking.startTime} - {booking.endTime}
                          </span>
                          <span className="flex items-center gap-1.5 truncate">
                            <MapPin className="h-4 w-4 text-accent shrink-0" />{" "}
                            {space.city}
                          </span>
                        </div>
                      </div>

                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl font-bold border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30 w-full sm:w-auto h-11 shrink-0"
                        >
                          Dettagli
                        </Button>
                      </SheetTrigger>
                    </div>

                    {/* PANNELLO LATERALE (SHEET) */}
                    <SheetContent className="w-full sm:max-w-md bg-background border-l border-border/50 overflow-y-auto z-[100] p-0 flex flex-col">
                      <SheetHeader className="text-left pt-8 px-6 sm:px-8 mb-6">
                        <div
                          className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest w-fit mb-4",
                            getStatusColor(booking.status),
                          )}
                        >
                          {formatStatus(booking.status)}
                        </div>
                        <SheetTitle className="text-3xl font-bold tracking-tight">
                          Dettagli sessione
                        </SheetTitle>
                        <SheetDescription className="text-base font-medium">
                          {booking.status === "CONFIRMED"
                            ? `Tutto pronto per la tua giornata presso ${space.title}.`
                            : "In attesa di conferma dall'Host."}
                        </SheetDescription>
                      </SheetHeader>

                      <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-muted">
                          <Image
                            src={space.imageUrls[0]}
                            alt={space.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="bg-secondary/5 border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                              Data e Ora
                            </span>
                            <span className="font-bold text-foreground capitalize">
                              {fullDateStr} • {booking.startTime} -{" "}
                              {booking.endTime}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                              Indirizzo
                            </span>
                            <span className="font-bold text-foreground">
                              {space.address}
                              <br />
                              {space.city}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                              Codice Prenotazione
                            </span>
                            <span className="font-mono font-bold text-foreground">
                              #{booking.id.toUpperCase()}
                            </span>
                          </div>
                          <Separator className="bg-border/50" />
                          <div className="flex items-center justify-between text-lg">
                            <span className="font-bold">Importo Totale</span>
                            <span className="font-extrabold text-accent">
                              €{booking.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-y border-border/50 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full border border-border/50 bg-secondary/20 overflow-hidden shadow-sm relative">
                              <Image
                                src={
                                  host?.image || "https://github.com/shadcn.png"
                                }
                                alt="Host"
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm">
                                Ospitato da {host?.name}
                              </p>
                              <p className="text-xs text-muted-foreground font-medium text-accent">
                                Host Verificato
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-accent/10 hover:bg-accent/20 text-accent"
                          >
                            <MessageSquare className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="flex flex-col gap-3">
                          {(booking.status === "CONFIRMED" ||
                            booking.status === "COMPLETED") && (
                            <Button
                              variant="outline"
                              className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                            >
                              <Receipt className="h-5 w-5 text-muted-foreground" />{" "}
                              Scarica Ricevuta
                            </Button>
                          )}

                          <Link href={`/space/${space.id}`} className="w-full">
                            <Button
                              variant="outline"
                              className="w-full justify-start h-12 rounded-xl font-bold border-border/50 gap-3 shadow-sm hover:bg-secondary/5"
                            >
                              <MapPin className="h-5 w-5 text-muted-foreground" />{" "}
                              Rivedi annuncio
                            </Button>
                          </Link>
                          {(booking.status === "CONFIRMED" ||
                            booking.status === "PENDING") && (
                            <SheetClose asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start h-12 rounded-xl font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 mt-4 shadow-sm"
                              >
                                <AlertTriangle className="h-5 w-5" /> Cancella
                                Prenotazione
                              </Button>
                            </SheetClose>
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                );
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
                  <Button className="rounded-xl font-bold shadow-sm h-11 px-8">
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
