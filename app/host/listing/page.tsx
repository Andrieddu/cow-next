import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// IMPORT DATABASE E AUTH REALI
import { createClient } from "@/utils/supabase/server";
import { HostService } from "@/services/host-service";
import { UserService } from "@/services/user-service";

// Importiamo il nostro nuovo e fiammante componente Client!
import HostSpacesList from "@/components/host/HostSpacesList";

export default async function HostListingPage() {
  // 1. AUTENTICAZIONE E CONTROLLO RUOLO
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const currentUser = await UserService.getUserById(user.id);
  if (currentUser?.role !== "HOST" && currentUser?.role !== "ADMIN") {
    redirect("/profile");
  }

  // 2. RECUPERO DATI REALI DAL DATABASE ALLA VELOCITÀ DELLA LUCE
  const spaces = await HostService.getDashboardData(user.id);

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER (Rimane sul server perché è statico) */}
      <div className="bg-background sticky top-0 z-30 border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              I miei annunci
            </h1>
          </div>

          <Link href="/host/create">
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-11">
              <Plus className="h-5 w-5" />{" "}
              <span className="hidden sm:inline">Crea nuovo</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        {/* INIETTIAMO IL COMPONENTE CLIENT CON I DATI */}
        <HostSpacesList spaces={spaces} />

        {/* FOOTER AZIONI */}
        {spaces.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Hai altri spazi da aggiungere alla tua collezione?
            </p>
            <Link href="/host/create">
              <Button
                variant="outline"
                className="rounded-2xl h-16 px-10 font-bold border-2 border-dashed border-accent/50 text-accent hover:bg-accent/5 transition-all"
              >
                Aggiungi un altro spazio di lavoro
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
