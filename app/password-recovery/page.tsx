import Link from "next/link";
import Image from "next/image";

import PasswordRecoveryForm from "@/components/forms/PasswordRecoveryForm";

export default function PasswordRecoveryPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center p-6 bg-secondary/5">
      <div className="w-full max-w-md bg-background p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-border/50">
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
            Recupera la tua password
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Inserisci la tua email e ti invieremo le istruzioni per reimpostarla.
          </p>
        </div>

        <PasswordRecoveryForm />

        <p className="text-center text-sm font-medium text-muted-foreground mt-8">
          Ricordi la password?{" "}
          <Link
            href="/login"
            className="font-bold text-accent hover:underline underline-offset-4"
          >
            Torna al login
          </Link>
        </p>
      </div>
    </main>
  );
}
