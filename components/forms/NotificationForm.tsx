"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";

// Importiamo l'azione che hai creato in user-actions.ts
import { updateNotificationsAction } from "@/actions/user-actions";

type NotificationFormProps = {
  user: {
    id: string;
    notifyBookings: boolean;
    notifyPromos: boolean;
    notifySms: boolean;
  };
};

export default function NotificationForm({ user }: NotificationFormProps) {
  // Leghiamo in modo sicuro l'ID dell'utente all'azione Server
  const updateAction = updateNotificationsAction.bind(null, user.id);

  // Gestiamo lo stato del form (caricamento, errori, successi)
  const [state, formAction, isPending] = useActionState(updateAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Box per i Messaggi di Errore o Successo */}
      {state?.error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm font-bold text-primary">
          {state.message}
        </div>
      )}

      {/* Switch: Prenotazioni e Aggiornamenti */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="notifyBookings"
            className="font-bold text-foreground cursor-pointer"
          >
            Prenotazioni e Aggiornamenti
          </label>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            Ricevi email per conferme, modifiche o cancellazioni.
          </p>
        </div>
        {/* Il parametro "name" è fondamentale: è quello che formData.get() cercherà! */}
        <Switch
          id="notifyBookings"
          name="notifyBookings"
          defaultChecked={user.notifyBookings}
        />
      </div>

      <div className="w-full h-px bg-border/50"></div>

      {/* Switch: Promozioni e Offerte */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="notifyPromos"
            className="font-bold text-foreground cursor-pointer"
          >
            Promozioni e Offerte
          </label>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            Ricevi sconti esclusivi e novità sugli spazi.
          </p>
        </div>
        <Switch
          id="notifyPromos"
          name="notifyPromos"
          defaultChecked={user.notifyPromos}
        />
      </div>

      <div className="w-full h-px bg-border/50"></div>

      {/* Switch: Notifiche SMS */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="notifySms"
            className="font-bold text-foreground cursor-pointer"
          >
            Notifiche SMS
          </label>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            Avvisi urgenti direttamente sul tuo telefono.
          </p>
        </div>
        <Switch
          id="notifySms"
          name="notifySms"
          defaultChecked={user.notifySms}
        />
      </div>

      {/* Tasto Salva */}
      <div className="pt-4 flex justify-end border-t border-border/50 mt-2">
        <Button
          type="submit"
          size="lg"
          disabled={isPending} // Disabilita il click mentre sta salvando
          className="h-12 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Salvataggio...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" /> Salva preferenze
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
