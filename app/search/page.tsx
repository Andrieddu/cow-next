import React, { Suspense } from "react";
import SearchClient from "@/components/search/SearchClient";
import { SpaceService } from "@/services/space-service";

// In Next.js 15, searchParams è una Promise!
type Props = {
  searchParams: Promise<{ q?: string; start?: string; end?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  // Risolviamo i parametri dell'URL
  const params = await searchParams;
  const searchQuery = params.q;

  // Richiediamo al Server i dati reali dal DB
  const spaces = await SpaceService.searchActiveSpaces(searchQuery);

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center animate-pulse text-muted-foreground font-bold">
            Caricamento spazi in corso...
          </div>
        }
      >
        <SearchClient initialSpaces={spaces} />
      </Suspense>
    </main>
  );
}
