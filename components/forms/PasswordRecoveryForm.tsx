"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { requestPasswordResetAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type RecoveryState = {
  success: boolean;
  error?: string;
  message?: string;
};

export default function PasswordRecoveryForm() {
  const [state, formAction, isPending] = useActionState(
    async (
      _previousState: RecoveryState | null,
      formData: FormData,
    ): Promise<RecoveryState> => requestPasswordResetAction(formData),
    null,
  );

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-bold text-destructive">
          {state.error}
        </div>
      )}

      {state?.success && state.message && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-bold text-primary">
          {state.message}
        </div>
      )}

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="mario.rossi@esempio.com"
              required
              className="h-12 rounded-xl"
            />
            <FieldDescription>
              Ti invieremo un link per reimpostare la password.
            </FieldDescription>
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
                Invio in corso...
              </>
            ) : (
              <>
                Invia link <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
