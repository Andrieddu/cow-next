import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format, isSameMonth } from "date-fns";
import { it } from "date-fns/locale";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Download,
  ChevronDown,
  CheckCircle2,
  Clock3,
  AlertCircle,
  MapPin,
  CheckSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// IMPORT DATABASE E AUTH REALI
import { createClient } from "@/utils/supabase/server";
import { HostService } from "@/services/host-service";
import { UserService } from "@/services/user-service";

// --- HELPERS STATO ---
const getStatusLabel = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "Confermata";
    case "PENDING":
      return "In attesa";
    case "COMPLETED":
      return "Completata";
    case "CANCELLED":
      return "Annullata";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-secondary text-muted-foreground";
    case "CANCELLED":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const StatusIcon = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  switch (status) {
    case "CONFIRMED":
      return <CheckCircle2 className={className} />;
    case "PENDING":
      return <Clock3 className={className} />;
    case "COMPLETED":
      return <CheckSquare className={className} />;
    case "CANCELLED":
      return <AlertCircle className={className} />;
    default:
      return null;
  }
};

export default async function HostBookingsPage() {
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

  // 2. RECUPERO DATI REALI DAL DATABASE
  const hostSpaces = await HostService.getDashboardData(user.id);

  // Appiattiamo e prepariamo l'array di prenotazioni
  const allBookings = hostSpaces
    .flatMap((space) =>
      space.bookings.map((booking) => ({
        ...booking,
        space,
        guest: booking.user,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordina dalle più recenti

  // 3. CALCOLO STATISTICHE
  const totalCount = allBookings.length;
  const currentMonthCount = allBookings.filter((b) =>
    isSameMonth(new Date(b.date), new Date()),
  ).length;
  const activeCount = allBookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING",
  ).length;

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER */}
      <div className="bg-background sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Tutte le Prenotazioni
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-xl font-bold border-border/50 gap-2 h-11"
          >
            <Download className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Esporta CSV</span>
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        {/* 2. FILTRI E STATS RAPIDE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca ospite o ID prenotazione..."
                className="pl-11 h-11 rounded-xl bg-background border-border/50"
              />
            </div>
            <Button
              variant="outline"
              className="rounded-xl font-bold border-border/50 gap-2 h-11"
            >
              <Filter className="h-4 w-4" /> Stato{" "}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Statistiche Dinamiche */}
          <div className="flex items-center justify-around bg-background rounded-2xl p-2 border border-border/50 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Totali
              </p>
              <p className="text-lg font-bold">{totalCount}</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Mese
              </p>
              <p className="text-lg font-bold">{currentMonthCount}</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-accent">
                Attive
              </p>
              <p className="text-lg font-bold text-accent">{activeCount}</p>
            </div>
          </div>
        </div>

        {/* 3. LISTA PRENOTAZIONI REALI */}
        <div className="space-y-4">
          {allBookings.length === 0 ? (
            <div className="bg-background rounded-[2rem] p-12 text-center shadow-sm border border-border/50">
              <p className="text-muted-foreground font-bold">
                Nessuna prenotazione trovata.
              </p>
            </div>
          ) : (
            allBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-background rounded-[2rem] p-5 md:p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Ospite */}
                  <div className="flex items-center gap-4 lg:w-64 shrink-0">
                    <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                      <AvatarImage src={booking.guest?.image || ""} />
                      <AvatarFallback>
                        {booking.guest?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-base leading-tight truncate w-40">
                        {booking.guest?.name} {booking.guest?.surname}
                      </h4>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5 uppercase">
                        #{booking.id.split("-")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Dettagli Spazio e Data */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Spazio prenotato
                      </span>
                      <span className="font-bold text-sm flex items-center gap-2 truncate">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />{" "}
                        {booking.space.title}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Data e Orario
                      </span>
                      <span className="font-medium text-sm flex items-center gap-2 truncate">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />{" "}
                        {format(new Date(booking.date), "dd MMM yyyy", {
                          locale: it,
                        })}
                        <Clock className="h-3.5 w-3.5 ml-2 text-muted-foreground shrink-0" />{" "}
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>

                  {/* Ospiti e Prezzo */}
                  <div className="flex items-center gap-8 lg:w-32 shrink-0">
                    <div className="flex flex-col gap-1 hidden sm:flex">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Persone
                      </span>
                      <span className="font-bold text-sm flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {booking.guests || 1}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Totale
                      </span>
                      <span className="font-extrabold text-sm text-foreground">
                        €{booking.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stato e Azioni */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-48 shrink-0">
                    <Badge
                      className={cn(
                        "rounded-lg px-3 py-1 font-bold text-[10px] uppercase border-none",
                        getStatusColor(booking.status),
                      )}
                    >
                      <StatusIcon
                        status={booking.status}
                        className="h-3 w-3 mr-1"
                      />
                      {getStatusLabel(booking.status)}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full shrink-0"
                        >
                          <MoreVertical className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border-border/50 shadow-xl w-48"
                      >
                        <DropdownMenuItem className="font-bold cursor-pointer">
                          Vedi dettagli
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-bold cursor-pointer">
                          Contatta ospite
                        </DropdownMenuItem>
                        {(booking.status === "CONFIRMED" ||
                          booking.status === "COMPLETED") && (
                          <DropdownMenuItem className="font-bold cursor-pointer">
                            Scarica ricevuta
                          </DropdownMenuItem>
                        )}
                        {booking.status === "PENDING" && (
                          <>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="font-bold cursor-pointer text-green-600">
                              Approva prenotazione
                            </DropdownMenuItem>
                          </>
                        )}
                        {(booking.status === "PENDING" ||
                          booking.status === "CONFIRMED") && (
                          <>
                            <Separator className="my-1" />
                            <DropdownMenuItem className="font-bold cursor-pointer text-destructive">
                              Annulla prenotazione
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
