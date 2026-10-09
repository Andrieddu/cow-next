"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Loader2, Save } from "lucide-react";

import { updateRecoveryPasswordAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    updateRecoveryPasswordAction,
    null,
  );

  if (state?.success) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-bold text-primary">
          {state.message}
        </div>
        <Button
          asChild
          size="lg"
          className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 hover:scale-[1.02] transition-transform"
        >
          <Link href="/profile">
            Vai al profilo <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-bold text-destructive">
          {state.error}
        </div>
      )}

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="new-password">Nuova password</FieldLabel>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Inserisci nuova password"
              minLength={8}
              required
              className="h-12 rounded-xl"
            />
            <FieldDescription>
              La password deve avere almeno 8 caratteri.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">
              Conferma nuova password
            </FieldLabel>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Ripeti la nuova password"
              minLength={8}
              required
              className="h-12 rounded-xl"
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full h-12 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20 gap-2 hover:scale-[1.02] transition-transform"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Reimposta password
              </>
            )}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
