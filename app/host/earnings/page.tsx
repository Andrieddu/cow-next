import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format, subMonths } from "date-fns";
import { it } from "date-fns/locale";
import {
  ArrowLeft,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Landmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// IMPORT DATABASE E AUTH REALI
import { createClient } from "@/utils/supabase/server";
import { HostService } from "@/services/host-service";
import { UserService } from "@/services/user-service";

export default async function HostEarningsPage() {
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

  // Appiattiamo tutte le prenotazioni collegando i dati dello spazio
  const hostBookings = hostSpaces
    .flatMap((space) =>
      space.bookings.map((booking) => ({
        ...booking,
        space,
        guest: booking.user,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Dalla più recente

  // 3. CALCOLI SALDI
  const now = new Date();

  // Saldo Disponibile (Prenotazioni completate o passate e confermate)
  const availableBalance = hostBookings
    .filter(
      (b) =>
        b.status === "COMPLETED" ||
        (b.status === "CONFIRMED" && new Date(b.date) < now),
    )
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // In arrivo (Prenotazioni future confermate o in attesa)
  const pendingBalance = hostBookings
    .filter(
      (b) =>
        (b.status === "CONFIRMED" && new Date(b.date) >= now) ||
        b.status === "PENDING",
    )
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // 4. GENERAZIONE DINAMICA DEL GRAFICO (Ultimi 6 mesi)
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const targetDate = subMonths(now, i);
    const monthYearStr = format(targetDate, "yyyy-MM");
    const monthLabel = format(targetDate, "MMM", { locale: it });

    // Somma degli incassi validi per quel mese
    const monthTotal = hostBookings
      .filter(
        (b) =>
          b.status !== "CANCELLED" &&
          format(new Date(b.date), "yyyy-MM") === monthYearStr,
      )
      .reduce((sum, b) => sum + b.totalPrice, 0);

    chartData.push({
      month: monthLabel, // es. "Ott", "Nov"
      amount: monthTotal,
      active: i === 0, // Evidenzia il mese corrente
    });
  }

  // Evitiamo divisioni per zero se l'host non ha ancora guadagni
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      <div className="container max-w-5xl mx-auto px-6 pt-8 md:pt-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Link
              href="/host/dashboard"
              className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              I tuoi Guadagni
            </h1>
            <p className="text-muted-foreground font-medium mt-2">
              Monitora le tue entrate e gestisci i pagamenti.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl font-bold border-border/50 gap-2 h-11 shrink-0"
          >
            <Download className="h-4 w-4" /> Scarica Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* =========================================
              COLONNA SINISTRA (Panoramica e Grafico)
              ========================================= */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* CARDS RIASSUNTIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Saldo Disponibile */}
              <div className="bg-background rounded-[2rem] p-8 shadow-sm border border-border/50 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                    Saldo Disponibile
                  </span>
                </div>
                <div className="relative z-10 mt-2">
                  <h2 className="text-4xl font-black text-foreground">
                    € {availableBalance.toFixed(2)}
                  </h2>
                  <Button className="mt-6 rounded-xl font-bold w-full sm:w-auto shadow-md shadow-primary/20">
                    Preleva fondi
                  </Button>
                </div>
              </div>

              {/* In Arrivo */}
              <div className="bg-background rounded-[2rem] p-8 shadow-sm border border-border/50 flex flex-col gap-4 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                    In arrivo (Stimato)
                  </span>
                </div>
                <div className="relative z-10 mt-2">
                  <h2 className="text-4xl font-black text-foreground">
                    € {pendingBalance.toFixed(2)}
                  </h2>
                  <p className="text-sm font-medium text-muted-foreground mt-4 leading-relaxed">
                    Basato sulle prenotazioni future confermate o in attesa di
                    approvazione.
                  </p>
                </div>
              </div>
            </div>

            {/* GRAFICO ANDAMENTO MENSILE */}
            <div className="bg-background rounded-[2rem] p-8 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    Andamento Mensile
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">
                    Entrate lorde degli ultimi 6 mesi
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
              </div>

              <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-4 border-b border-border/50 relative">
                {/* Linee di sfondo orizzontali fittizie */}
                <div className="absolute top-0 w-full h-px bg-border/30" />
                <div className="absolute top-1/2 w-full h-px bg-border/30" />

                {chartData.map((data, idx) => {
                  const heightPercentage = (data.amount / maxAmount) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-3 flex-1 group z-10"
                    >
                      {/* Tooltip Hover Fittizio */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-foreground bg-secondary/80 px-2 py-1 rounded-md backdrop-blur-md">
                        €{data.amount.toFixed(0)}
                      </span>
                      {/* Barra */}
                      <div className="w-full max-w-[3rem] bg-secondary/20 rounded-t-xl relative overflow-hidden h-full flex items-end">
                        <div
                          className={cn(
                            "w-full rounded-t-xl transition-all duration-1000",
                            data.active
                              ? "bg-accent"
                              : "bg-primary/40 group-hover:bg-primary/60",
                          )}
                          style={{ height: `${heightPercentage}%` }}
                        />
                      </div>
                      {/* Label Mese */}
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest capitalize",
                          data.active ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================
              COLONNA DESTRA (Storico Transazioni)
              ========================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-xl font-bold tracking-tight px-2">
              Storico Transazioni
            </h3>

            <div className="flex flex-col gap-4">
              {hostBookings.length === 0 ? (
                <div className="bg-background rounded-[2rem] p-8 text-center border border-border/50">
                  <p className="text-muted-foreground font-bold text-sm">
                    Nessuna transazione recente.
                  </p>
                </div>
              ) : (
                hostBookings.slice(0, 8).map((booking) => {
                  // Mostriamo solo le ultime 8 per non allungare troppo
                  const isPending =
                    booking.status === "PENDING" ||
                    (booking.status === "CONFIRMED" &&
                      new Date(booking.date) >= now);
                  const isCancelled = booking.status === "CANCELLED";

                  return (
                    <div
                      key={booking.id}
                      className="bg-background rounded-2xl p-5 shadow-sm border border-border/50 flex items-center justify-between gap-4 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                            isCancelled
                              ? "bg-destructive/10"
                              : isPending
                                ? "bg-amber-500/10"
                                : "bg-green-500/10",
                          )}
                        >
                          {isCancelled ? (
                            <ArrowUpRight className="h-5 w-5 text-destructive rotate-90" />
                          ) : isPending ? (
                            <Clock className="h-5 w-5 text-amber-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-bold text-sm text-foreground truncate">
                            {booking.space.title}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground truncate">
                            {format(new Date(booking.date), "dd MMM yyyy", {
                              locale: it,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span
                          className={cn(
                            "font-black",
                            isCancelled
                              ? "text-muted-foreground line-through"
                              : "text-foreground",
                          )}
                        >
                          €{booking.totalPrice.toFixed(2)}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                            isCancelled
                              ? "text-destructive"
                              : isPending
                                ? "text-amber-600"
                                : "text-green-600",
                          )}
                        >
                          {isCancelled
                            ? "Annullata"
                            : isPending
                              ? "In arrivo"
                              : "Accreditato"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Dettagli Bonifico */}
            <div className="mt-4 bg-secondary/5 rounded-2xl p-6 border-2 border-dashed border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <Landmark className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-bold text-sm">Conto di Accredito</h4>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-4">
                I fondi vengono trasferiti automaticamente sul tuo conto
                bancario entro 3-5 giorni lavorativi dal check-in dell ospite
                tramite Stripe Connect.
              </p>
              <div className="bg-background border border-border/50 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:border-accent/30 transition-colors">
                <span className="text-xs font-bold text-muted-foreground">
                  Da configurare in Impostazioni
                </span>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                  Vai
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
