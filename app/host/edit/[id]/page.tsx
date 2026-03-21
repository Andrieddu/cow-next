import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import HostEditSpaceForm from "@/components/host/HostEditSpaceForm";

export default async function EditSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Verifica utente loggato
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Recupera lo spazio dal database
  const space = await prisma.space.findUnique({
    where: { id: id },
  });

  // 3. Controlli di sicurezza: lo spazio esiste ed è di questo host?
  if (!space) {
    redirect("/host/dashboard"); // Spazio non trovato
  }

  if (space.hostId !== user.id) {
    redirect("/host/dashboard"); // Sta cercando di modificare lo spazio di un altro!
  }

  // 4. Passiamo i dati al form
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <div className="container max-w-3xl mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Modifica il tuo spazio
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Aggiorna i dettagli, le tariffe o gli orari di {space.title}.
          </p>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-6">
        <HostEditSpaceForm space={space} />
      </div>
    </main>
  );
}
