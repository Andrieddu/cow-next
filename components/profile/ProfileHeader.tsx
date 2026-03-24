"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Edit2, MessageSquare, Settings, LogOut } from "lucide-react";

// Importiamo l'azione di logout e il client di Supabase
import { logout } from "@/actions/auth-actions";
import { createClient } from "@/utils/supabase/client";

interface ProfileHeaderProps {
  currentUser: any;
  initialUnreadCount: number;
  hostButtonText: string;
  hostButtonLink: string;
}

export default function ProfileHeader({
  currentUser,
  initialUnreadCount,
  hostButtonText,
  hostButtonLink,
}: ProfileHeaderProps) {
  // Stato per le notifiche in tempo reale
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  // Ascoltiamo Supabase per i nuovi messaggi senza ricaricare la pagina!
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime-profile-header")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
        },
        (payload) => {
          const newMessage = payload.new;
          // Se arriva un nuovo messaggio e non sono io ad averlo mandato, +1 alla notifica!
          if (newMessage.senderId !== currentUser.id) {
            setUnreadCount((prev) => prev + 1);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id]);

  return (
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

        {/* Tasto Messaggi Aggiornato (Giallo/Accent) - Ora usa lo stato unreadCount! */}
        <Link href="/messages" className="w-full">
          <Button
            variant="outline"
            className={`w-full h-12 rounded-xl font-bold border-border/50 transition-all flex items-center justify-center gap-2 relative ${
              unreadCount > 0
                ? "border-accent/30 bg-accent/5 text-accent hover:bg-accent/10"
                : "hover:bg-secondary/10 hover:text-accent"
            }`}
          >
            <MessageSquare
              className={`h-5 w-5 ${unreadCount > 0 ? "fill-accent/20" : "text-accent"}`}
            />
            Messaggi
            {/* Il Badge della notifica */}
            {unreadCount > 0 && (
              <span className="absolute right-3 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-accent text-[11px] font-black text-accent-foreground shadow-sm animate-in zoom-in">
                {unreadCount}
              </span>
            )}
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
  );
}
