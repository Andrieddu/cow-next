"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  // Inizializza il client Supabase per il server (legge/scrive i cookie)
  const supabase = await createClient();

  // Estrae i dati dal form React
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Tenta il login tramite Supabase Auth
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Se fallisce, rimanda alla pagina di login passando l'errore nell'URL
    return redirect("/login?error=Credenziali non valide");
  }

  // Se ha successo, aggiorna la cache e porta l'utente al suo profilo
  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Estraiamo TUTTI i campi dal form, inclusi nome e cognome
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const surname = formData.get("surname") as string;

  // Registra l'utente in Supabase i metadati (options.data)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        surname,
      },
    },
  });

  if (error) {
    // Se c'è un errore, torna alla pagina di signup per mostrare l'errore
    return redirect(`/signup?error=${error.message}`);
  }

  // Se la registrazione va a buon fine, reindirizza al login con un messaggio di successo
  revalidatePath("/", "layout");
  return redirect(
    "/login?message=Controlla la tua email per confermare l'account",
  );
}

export async function logout() {
  const supabase = await createClient();

  // Distrugge la sessione (elimina i cookie)
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updatePasswordAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non sei autorizzato." };
  }

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Le password non coincidono." };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "La password deve avere almeno 8 caratteri.",
    };
  }

  // Chiamata a Supabase per aggiornare la password!
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("[Update Password Error]:", error);
    return {
      success: false,
      error: "Impossibile aggiornare la password. Riprova.",
    };
  }

  return { success: true, message: "Password aggiornata con successo!" };
}
