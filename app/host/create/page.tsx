import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import HostCreateSpaceForm from "@/components/host/HostCreateSpaceForm";

export default async function CreateSpacePage() {
  // 1. Controllo di Sicurezza (Server-Side)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      {/* 1. HEADER DELLA PAGINA */}
      <div className="container max-w-3xl mx-auto px-6 pt-12">
        <Link
          href="/host/dashboard"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Aggiungi un nuovo spazio
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Descrivi il tuo ufficio o la tua scrivania per iniziare a ospitare
            professionisti.
          </p>
        </div>
      </div>

      {/* 2. FORM DI CREAZIONE */}
      <div className="container max-w-3xl mx-auto px-6">
        <HostCreateSpaceForm />
      </div>
    </main>
  );
}
