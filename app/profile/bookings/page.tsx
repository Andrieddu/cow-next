import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ArrowLeft,
  MapPin,
  Clock,
  Download,
  Star,
  Receipt,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { it } from "date-fns/locale";

// 1. IMPORTIAMO SUPABASE, IL SERVICE E I TIPI
import { createClient } from "@/utils/supabase/server";
import { UserService } from "@/services/user-service";
import { SpaceType, BookingStatus } from "@/generated/prisma/client"; // Assicurati che l'import di Prisma sia corretto

// --- HELPERS ---
const formatSpaceType = (type: SpaceType | string) => {
  const types: Record<string, string> = {
    DESK: "Desk",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    EVENT_SPACE: "Sala Eventi",
  };
  return types[type] || type;
};

const formatStatus = (status: BookingStatus | string) => {
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

// Funzione helper cn
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

// Funzione helper colori stati
const getStatusColor = (status: BookingStatus | string) => {
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

// 2. SERVER COMPONENT
export default async function BookingsPage() {
  // 3. AUTENTICAZIONE REALE CON SUPABASE
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 4. RECUPERO DATI DAL DB (Usiamo l'ID vero dell'utente loggato)
  const currentUser = await UserService.getProfileWithBookings(user.id);

  if (!currentUser) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Utente non trovato</h2>
        <p className="text-muted-foreground">
          Assicurati di aver completato la configurazione del profilo.
        </p>
        <Link href="/profile">
          <Button>Vai al Profilo</Button>
        </Link>
      </div>
    );
  }

  // 5. LOGICA DI DIVISIONE PRENOTAZIONI (In arrivo vs Passate)
  const allBookings = currentUser.bookings || [];
  const today = startOfDay(new Date());

  // In arrivo: Oggi o nel futuro
  const upcomingBookings = allBookings.filter(
    (b: any) => !isBefore(new Date(b.date), today),
  );

  // Passate: Nel passato
  const pastBookings = allBookings.filter((b: any) =>
    isBefore(new Date(b.date), today),
  );

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-4xl mx-auto px-6 pt-8 md:pt-12">
        {/* Pulsante Indietro */}
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Profilo
        </Link>

        <Tabs defaultValue="in-arrivo" className="w-full">
          {/* Intestazione e Controlli Tab */}
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
                className="px-5 py-2 rounded-lg font-bold text-sm text-muted-foreground data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:shadow-none transition-colors"
              >
                In arrivo
              </TabsTrigger>
              <TabsTrigger
                value="passate"
                className="px-5 py-2 rounded-lg font-bold text-sm text-muted-foreground data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:shadow-none transition-colors"
              >
                Passate
              </TabsTrigger>
            </TabsList>
          </div>

          {/* =========================================
              CONTENUTO: IN ARRIVO
              ========================================= */}
          <TabsContent
            value="in-arrivo"
            className="mt-0 flex flex-col gap-6 focus-visible:outline-none"
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
              upcomingBookings.map((booking: any) => {
                const space = booking.space;
                const host = space?.host;
                const month = format(new Date(booking.date), "MMM", {
                  locale: it,
                });
                const day = format(new Date(booking.date), "dd");

                return (
                  <Sheet key={booking.id}>
                    <div className="bg-background rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/50 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent" />

                      <div className="bg-accent/10 rounded-2xl w-24 h-24 flex flex-col items-center justify-center shrink-0 border border-accent/20">
                        <span className="text-sm font-bold text-accent uppercase tracking-widest">
                          {month}
                        </span>
                        <span className="text-3xl font-bold text-foreground leading-none mt-1">
                          {day}
                        </span>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/5 px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {formatSpaceType(space?.type)}
                          </div>
                          <div
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                              getStatusColor(booking.status),
                            )}
                          >
                            {formatStatus(booking.status)}
                          </div>
                        </div>
                        <h4 className="text-xl font-bold mb-2 truncate">
                          {space?.title}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm font-medium text-muted-foreground">
                          <span className="flex items-center gap-2 shrink-0">
                            <Clock className="h-4 w-4 text-accent" />{" "}
                            {booking.startTime} - {booking.endTime}
                          </span>
                          <span className="flex items-center gap-2 truncate">
                            <MapPin className="h-4 w-4 text-accent shrink-0" />{" "}
                            {space?.address}, {space?.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-border/50 md:pl-6 shrink-0">
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full rounded-xl font-bold border-border/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                          >
                            Gestisci
                          </Button>
                        </SheetTrigger>
                      </div>
                    </div>

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
                        <SheetDescription className="text-base font-medium text-muted-foreground">
                          Tutto pronto per la tua giornata all&apos;
                          {space?.title}.
                        </SheetDescription>
                      </SheetHeader>

                      <div className="px-6 sm:px-8 pb-8 space-y-8 flex-1">
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/50 shadow-sm bg-muted">
                          <Image
                            src={
                              space?.imageUrls[0] ||
                              "https://images.unsplash.com/photo-1497366216548-37526070297c"
                            }
                            alt={space?.title || "Space Image"}
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
                            <span className="font-bold text-foreground">
                              {format(new Date(booking.date), "EEEE dd MMMM", {
                                locale: it,
                              })}{" "}
                              • {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                              Indirizzo
                            </span>
                            <span className="font-bold text-foreground">
                              {space?.address}
                              <br />
                              {space?.city}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80">
                              Codice Prenotazione
                            </span>
                            <span className="font-mono font-bold text-foreground uppercase">
                              #{booking.id.split("-")[0]}
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
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm">
                                Ospitato da {host?.name || "Host"}
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

                          <Link href={`/space/${space?.id}`} className="w-full">
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
          </TabsContent>

          {/* =========================================
              CONTENUTO: PASSATE (STORICO)
              ========================================= */}
          <TabsContent
            value="passate"
            className="mt-0 flex flex-col gap-6 focus-visible:outline-none"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Storico Recente
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {pastBookings.length === 0 ? (
                <p className="text-sm font-medium text-muted-foreground italic">
                  Nessuna prenotazione passata.
                </p>
              ) : (
                pastBookings.map((booking: any) => {
                  const space = booking.space;
                  const day = format(new Date(booking.date), "dd");

                  return (
                    <div
                      key={booking.id}
                      className="bg-background rounded-3xl p-5 shadow-sm border border-border/40 flex flex-col md:flex-row items-start md:items-center gap-6 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                    >
                      <div className="bg-muted rounded-xl w-16 h-16 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-muted-foreground uppercase">
                          {format(new Date(booking.date), "MMM", {
                            locale: it,
                          })}
                        </span>
                        <span className="text-xl font-bold text-foreground leading-none mt-1">
                          {day}
                        </span>
                      </div>

                      <div className="flex-1 w-full">
                        <h4 className="text-lg font-bold truncate">
                          {space?.title}
                        </h4>
                        <p className="text-sm font-medium text-muted-foreground truncate">
                          {formatSpaceType(space?.type)} • {space?.city}
                        </p>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                        {(booking.status === "CONFIRMED" ||
                          booking.status === "COMPLETED") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl font-bold border-border/50 gap-2 h-10"
                          >
                            <Download className="h-4 w-4" /> Ricevuta
                          </Button>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 rounded-xl font-bold gap-2 h-10"
                        >
                          <Star
                            className="h-4 w-4 text-primary"
                            fill="currentColor"
                          />{" "}
                          Recensisci
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
