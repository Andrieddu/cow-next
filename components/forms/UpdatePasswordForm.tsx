"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updatePasswordAction } from "@/actions/auth-actions";

export default function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    updatePasswordAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset(); // Svuota i campi della password dopo il successo!
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-6 max-w-md"
    >
      {state?.error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-bold text-destructive">
          {state.error}
        </div>
      )}

      {/* Nota: L'input per la password attuale è stato rimosso in quanto Supabase 
          usa il token della sessione attiva per autorizzare l'operazione. */}

      <Field>
        <FieldLabel
          htmlFor="new-password"
          className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1"
        >
          Nuova Password
        </FieldLabel>
        <Input
          id="new-password"
          name="newPassword"
          type="password"
          required
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
          name="confirmPassword"
          type="password"
          required
          placeholder="Ripeti la nuova password"
          className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20"
        />
      </Field>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Aggiornamento...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Aggiorna Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
