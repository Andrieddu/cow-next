import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { ArrowRight } from "lucide-react";

// 1. Importiamo l'azione di login
import { login } from "@/actions/auth-actions";

// 2. Tipo per i searchParams asincroni di Next 15
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage(props: { searchParams: SearchParams }) {
  // 3. Risolviamo i parametri in modo asincrono
  const searchParams = await props.searchParams;
  const error = searchParams.error as string | undefined;
  const message = searchParams.message as string | undefined;

  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 bg-secondary/5">
      <div className="w-full max-w-md bg-background p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-border/50">
        {/* Logo e Intestazione */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="mb-6 hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="Logo CoW"
              width={80}
              height={28}
              className="object-contain"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Bentornato in CoW
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Inserisci i tuoi dati per accedere al tuo spazio.
          </p>
        </div>

        {/* 4. Alert per Errori (es. Credenziali Errate) */}
        {error && (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-center text-sm font-bold text-destructive">
            {error}
          </div>
        )}

        {/* 5. Alert per Messaggi di Successo (es. Conferma inviata) */}
        {message && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 p-4 text-center text-sm font-bold text-primary">
            {message}
          </div>
        )}

        {/* 6. Colleghiamo il form all'azione */}
        <form action={login}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                {/* Aggiunti name e required */}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mario.rossi@esempio.com"
                  required
                  className="h-12 rounded-xl"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/recupero-password"
                    className="text-[11px] font-bold text-accent hover:underline"
                  >
                    Dimenticata?
                  </Link>
                </div>
                {/* Aggiunti name e required */}
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl"
                />
              </Field>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20 gap-2 hover:scale-[1.02] transition-transform"
              >
                Accedi <ArrowRight className="h-4 w-4" />
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>

        {/* Separatore */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
            <span className="bg-background px-2 text-muted-foreground/50">
              Oppure
            </span>
          </div>
        </div>

        {/* Social Login */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl font-bold border-border/50 hover:bg-secondary/10 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continua con Google
        </Button>

        <p className="text-center text-sm font-medium text-muted-foreground mt-8">
          Non hai un account?{" "}
          <Link
            href="/signup"
            className="font-bold text-accent hover:underline underline-offset-4"
          >
            Registrati
          </Link>
        </p>
      </div>
    </main>
  );
}
