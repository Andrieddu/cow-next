import Link from "next/link";
import Image from "next/image"; // Ottimizzazione Next.js
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Camera,
  Save,
  ArrowLeft,
  Lock,
  Plus,
} from "lucide-react";

// 1. IMPORTIAMO IL SERVICE REALE
import { UserService } from "@/services/user-service";

export default async function SettingsPage() {
  // 2. RECUPERO DATI DAL DB (Luigi Verdi)
  const currentUser = await UserService.getUserById("seed-guest-1");

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground font-bold">
        Utente non trovato nel database. Effettua il login.
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-7xl mx-auto px-6 pt-8 md:pt-12">
        {/* Pulsante Indietro */}
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
            {/* =========================================
                SIDEBAR (TabsList)
                ========================================= */}
            <TabsList
              className="
              flex flex-row justify-start overflow-x-auto w-full h-auto p-1 bg-background border border-border/50 rounded-2xl col-span-1
              lg:col-span-3 lg:flex-col lg:bg-transparent lg:border-none lg:p-0 lg:shadow-none lg:gap-2 lg:sticky lg:top-28 lg:overflow-visible
            "
            >
              {[
                { id: "account", label: "Account", icon: User },
                { id: "pagamenti", label: "Pagamenti", icon: CreditCard },
                { id: "notifiche", label: "Notifiche", icon: Bell },
                { id: "sicurezza", label: "Sicurezza", icon: Shield },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="
                    flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-muted-foreground transition-all
                    data-[state=active]:bg-accent/10 data-[state=active]:text-accent
                    hover:bg-background/50 hover:text-foreground
                    shrink-0 justify-center
                    lg:w-full lg:justify-start lg:shrink-1
                  "
                >
                  <tab.icon className="h-5 w-5 shrink-0" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* =========================================
                AREA CONTENUTO
                ========================================= */}
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
                  <form className="flex flex-col gap-8">
                    {/* Immagine Profilo - Usando Next Image per performance */}
                    <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                      <div className="relative h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden border-2 border-background shadow-sm shrink-0">
                        <Image
                          src={
                            currentUser.image || "https://github.com/shadcn.png"
                          }
                          alt={`${currentUser.name} ${currentUser.surname}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl font-bold border-border/50 hover:bg-secondary/10 hover:text-accent gap-2"
                          >
                            <Camera className="h-4 w-4" /> Cambia Foto
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="rounded-xl font-bold text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Rimuovi
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Campi Form precompilati con dati dal DB */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field>
                        <FieldLabel
                          htmlFor="nome"
                          className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                        >
                          Nome
                        </FieldLabel>
                        <Input
                          id="nome"
                          name="name"
                          type="text"
                          defaultValue={currentUser.name || ""}
                          className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 font-medium"
                        />
                      </Field>

                      <Field>
                        <FieldLabel
                          htmlFor="cognome"
                          className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                        >
                          Cognome
                        </FieldLabel>
                        <Input
                          id="cognome"
                          name="surname"
                          type="text"
                          defaultValue={currentUser.surname || ""}
                          className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 font-medium"
                        />
                      </Field>

                      <Field className="md:col-span-2">
                        <FieldLabel
                          htmlFor="email"
                          className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                        >
                          Indirizzo Email
                        </FieldLabel>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={currentUser.email}
                          className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 font-medium"
                          disabled // Email solitamente protetta o gestita via Auth
                        />
                        <FieldDescription className="px-1">
                          Questa email verrà utilizzata per l accesso e le
                          ricevute.
                        </FieldDescription>
                      </Field>

                      <Field className="md:col-span-2">
                        <FieldLabel
                          htmlFor="telefono"
                          className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                        >
                          Numero di Telefono
                        </FieldLabel>
                        <Input
                          id="telefono"
                          name="phone"
                          type="tel"
                          defaultValue={currentUser.phone || ""}
                          className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 font-medium"
                        />
                      </Field>
                    </div>

                    <div className="pt-4 flex justify-end border-t border-border/50 mt-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="h-12 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
                      >
                        <Save className="h-5 w-5" /> Salva modifiche
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* === SCHEDA PAGAMENTI === */}
              <TabsContent
                value="pagamenti"
                className="mt-0 focus-visible:outline-none flex flex-col gap-8"
              >
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
                      {" "}
                      Storico Fatturazione{" "}
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
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Preferenze Notifiche
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="prenotazioni"
                          className="font-bold text-foreground cursor-pointer"
                        >
                          Prenotazioni e Aggiornamenti
                        </label>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Ricevi email per conferme, modifiche o cancellazioni.
                        </p>
                      </div>
                      <Switch
                        id="prenotazioni"
                        defaultChecked={
                          (currentUser as any).notifyBookings ?? true
                        }
                      />
                    </div>

                    <div className="w-full h-px bg-border/50"></div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="promozioni"
                          className="font-bold text-foreground cursor-pointer"
                        >
                          Promozioni e Offerte
                        </label>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Ricevi sconti esclusivi e novità sugli spazi.
                        </p>
                      </div>
                      <Switch
                        id="promozioni"
                        defaultChecked={
                          (currentUser as any).notifyPromos ?? false
                        }
                      />
                    </div>

                    <div className="w-full h-px bg-border/50"></div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="sms"
                          className="font-bold text-foreground cursor-pointer"
                        >
                          Notifiche SMS
                        </label>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Avvisi urgenti direttamente sul tuo telefono.
                        </p>
                      </div>
                      <Switch
                        id="sms"
                        defaultChecked={(currentUser as any).notifySms ?? false}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* === SCHEDA SICUREZZA === */}
              <TabsContent
                value="sicurezza"
                className="mt-0 focus-visible:outline-none"
              >
                <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {" "}
                      Sicurezza{" "}
                    </h2>
                  </div>

                  <form className="flex flex-col gap-6 max-w-md">
                    <Field>
                      <FieldLabel
                        htmlFor="current-password"
                        className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                      >
                        Password Attuale
                      </FieldLabel>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20"
                      />
                    </Field>

                    <Field>
                      <FieldLabel
                        htmlFor="new-password"
                        className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                      >
                        Nuova Password
                      </FieldLabel>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Inserisci nuova password"
                        className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20"
                      />
                      <FieldDescription className="px-1">
                        Assicurati che sia lunga almeno 8 caratteri.
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel
                        htmlFor="confirm-password"
                        className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
                      >
                        Conferma Nuova Password
                      </FieldLabel>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Ripeti la nuova password"
                        className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20"
                      />
                    </Field>

                    <div className="pt-2">
                      <Button
                        type="button"
                        className="h-12 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-accent/20 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        Aggiorna Password
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
