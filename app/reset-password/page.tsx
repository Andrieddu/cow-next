import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { createClient } from "@/utils/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/login?error=Il%20link%20di%20recupero%20non%20%C3%A8%20valido%20o%20%C3%A8%20scaduto",
    );
  }

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
            Imposta una nuova password
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Scegli una nuova password sicura per il tuo account.
          </p>
        </div>

        <ResetPasswordForm />

        <p className="text-center text-sm font-medium text-muted-foreground mt-8">
          Vuoi tornare al login?{" "}
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
