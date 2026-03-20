"use client"; // Questo ci permette di usare gli hook e l'interattività

import { useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Camera, Save, Loader2 } from "lucide-react";
import { updateUserProfileAction } from "@/actions/user-actions";

type ProfileFormProps = {
  user: {
    id: string;
    name: string | null;
    surname: string | null;
    email: string;
    phone: string | null;
    image: string | null;
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  // Leghiamo l'ID in modo sicuro alla Server Action
  const updateAction = updateUserProfileAction.bind(null, user.id);

  // useActionState gestisce caricamento, errori e successi
  const [state, formAction, isPending] = useActionState(updateAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Box Messaggi */}
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

      {/* Immagine Profilo */}
      <div className="flex items-center gap-6 pb-6 border-b border-border/50">
        <div className="relative h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden border-2 border-background shadow-sm shrink-0">
          <Image
            src={user.image || "https://github.com/shadcn.png"}
            alt={`${user.name} ${user.surname}`}
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
            defaultValue={user.name || ""}
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
            defaultValue={user.surname || ""}
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
            type="email"
            defaultValue={user.email}
            disabled
            className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 font-medium opacity-60"
          />
          <FieldDescription className="px-1">
            L email non può essere modificata da qui.
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
            defaultValue={user.phone || ""}
            className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 font-medium"
          />
        </Field>
      </div>

      <div className="pt-4 flex justify-end border-t border-border/50 mt-2">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="h-12 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 transition-transform active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Salvataggio...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" /> Salva modifiche
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
