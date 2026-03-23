import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  ArrowLeft,
  Lock,
  Plus,
} from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserService } from "@/services/user-service";

// IMPORTIAMO I NOSTRI COMPONENTI FORM
import ProfileForm from "@/components/forms/ProfileForm";
import NotificationForm from "@/components/forms/NotificationForm";
import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const currentUser = await UserService.getUserById(user.id);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground font-bold">
        Sincronizzazione profilo in corso. Ricarica la pagina.
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-7xl mx-auto px-6 pt-8 md:pt-12">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-8 w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Profilo
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Impostazioni
          </h1>
          <p className="text-muted-foreground font-medium mt-2">
            Gestisci le tue preferenze e le informazioni del tuo account.
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <TabsList className="flex flex-row justify-start overflow-x-auto w-full h-auto p-1 bg-background border border-border/50 rounded-2xl col-span-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:col-span-3 lg:flex-col lg:bg-transparent lg:border-none lg:p-0 lg:shadow-none lg:gap-2 lg:sticky lg:top-28 lg:overflow-visible">
              {[
                { id: "account", label: "Account", icon: User },
                { id: "pagamenti", label: "Pagamenti", icon: CreditCard },
                { id: "notifiche", label: "Notifiche", icon: Bell },
                { id: "sicurezza", label: "Sicurezza", icon: Shield },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-muted-foreground transition-all data-[state=active]:bg-accent/10 data-[state=active]:text-accent hover:bg-background/50 hover:text-foreground shrink-0 justify-center lg:w-full lg:justify-start lg:shrink-1"
                >
                  <tab.icon className="h-5 w-5 shrink-0" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="col-span-1 lg:col-span-9 w-full flex flex-col gap-8">
              {/* === SCHEDA ACCOUNT === */}
              <TabsContent
                value="account"
                className="mt-0 focus-visible:outline-none flex flex-col gap-8"
              >
                <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
                  <h2 className="text-2xl font-bold tracking-tight mb-8">
                    Informazioni Personali
                  </h2>

                  <ProfileForm user={currentUser} />
                </div>
              </TabsContent>

              {/* === SCHEDA PAGAMENTI === */}
              <TabsContent
                value="pagamenti"
                className="mt-0 focus-visible:outline-none flex flex-col gap-8"
              >
                {/* ... (Contenuto Pagamenti Invariato) ... */}
                <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Metodi di Pagamento
                    </h2>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-border/50 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 bg-background border border-border/50 shadow-sm rounded-lg flex items-center justify-center shrink-0">
                          <span className="font-bold text-lg text-primary tracking-tighter">
                            VISA
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-foreground">
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-xs font-medium text-muted-foreground">
                            Scade 12/2025
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive font-bold rounded-lg"
                      >
                        Rimuovi
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="h-16 w-full md:w-fit px-6 rounded-2xl border-dashed border-2 border-border/60 text-muted-foreground font-bold hover:text-foreground hover:border-foreground/30 gap-2"
                    >
                      <Plus className="h-5 w-5" /> Aggiungi nuovo metodo
                    </Button>
                  </div>

                  <div className="mt-10 pt-8 border-t border-border/50">
                    <h3 className="text-lg font-bold mb-4">
                      Storico Fatturazione
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      Non ci sono fatture recenti da mostrare.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* === SCHEDA NOTIFICHE === */}
              <TabsContent
                value="notifiche"
                className="mt-0 focus-visible:outline-none flex flex-col gap-8"
              >
                <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Preferenze Notifiche
                    </h2>
                  </div>

                  {/* ECCO IL COMPONENTE INIETTATO QUI - SOSTITUISCE I VECCHI SWITCH */}
                  {/* Nota: L'errore che potresti avere su currentUser è perché TypeScript pensa 
                      che currentUser non abbia le proprietà notifyBookings. 
                      Lo forziamo a 'any' temporaneamente se il tuo schema Prisma non è ancora aggiornato 
                      o lo passiamo così com'è. */}
                  <NotificationForm user={currentUser as any} />
                </div>
              </TabsContent>
              {/* === SCHEDA SICUREZZA === */}
              <TabsContent
                value="sicurezza"
                className="mt-0 focus-visible:outline-none"
              >
                <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Sicurezza
                    </h2>
                  </div>

                  {/* ECCO IL NOSTRO COMPONENTE DINAMICO! */}
                  <UpdatePasswordForm />
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
