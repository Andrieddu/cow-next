import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Star, Search, SlidersHorizontal } from "lucide-react";

// Dati fittizi per i risultati
const spaces = [
  {
    id: 1,
    nome: "Copernico Isola for Castillia",
    tipo: "Flex Desk",
    prezzo: "25€",
    unita: "al giorno",
    rating: 4.9,
    recensioni: 128,
    distanza: "A 0.5 km dal centro",
    immagine:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    nome: "Talent Garden Calabiana",
    tipo: "Sala Meeting",
    prezzo: "35€",
    unita: "all'ora",
    rating: 4.8,
    recensioni: 84,
    distanza: "Zona Porta Romana",
    immagine:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    nome: "Tenoha Milano",
    tipo: "Hot Desk",
    prezzo: "20€",
    unita: "al giorno",
    rating: 4.7,
    recensioni: 56,
    distanza: "Zona Navigli",
    immagine:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    nome: "Spaces Porta Nuova",
    tipo: "Ufficio Privato",
    prezzo: "110€",
    unita: "al giorno",
    rating: 5.0,
    recensioni: 32,
    distanza: "Zona Garibaldi",
    immagine:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    nome: "WeWork Via Mazzini",
    tipo: "Flex Desk",
    prezzo: "30€",
    unita: "al giorno",
    rating: 4.6,
    recensioni: 210,
    distanza: "Duomo",
    immagine:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    nome: "Cowo Milano Lambrate",
    tipo: "Sala Podcast",
    prezzo: "45€",
    unita: "all'ora",
    rating: 4.9,
    recensioni: 18,
    distanza: "Lambrate",
    immagine:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop",
  },
];

export default function SearchPage() {
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      {/* =========================================
          1. HEADER DI RICERCA (SOLO MOBILE)
          ========================================= */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm py-4">
        <div className="container px-6 flex items-center justify-between gap-4">
          <button className="flex flex-1 items-center justify-between gap-3 bg-background border border-border/60 shadow-sm rounded-full pl-5 pr-2 py-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-sm font-bold text-foreground truncate">
                Milano
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
              <span className="text-sm font-medium text-muted-foreground shrink-0">
                Oggi
              </span>
            </div>
            <div className="bg-primary rounded-full p-2 shrink-0 ml-2">
              <Search className="h-4 w-4 text-primary-foreground stroke-[3]" />
            </div>
          </button>
          <Button
            variant="outline"
            className="rounded-xl h-12 px-4 font-bold border-border/50 shrink-0 gap-2 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* =========================================
          2. LAYOUT A DUE COLONNE
          ========================================= */}
      <div className="container max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* =========================================
              COLONNA SINISTRA: Sidebar (Ora con componenti veri)
              ========================================= */}
          <aside className="hidden lg:flex flex-col gap-8 sticky top-28 h-[calc(100vh-140px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-4 pb-10">
            {/* Card Riepilogo Ricerca */}
            <div className="bg-background border border-border/50 shadow-sm rounded-[1.5rem] p-5 flex flex-col gap-3 group cursor-pointer hover:shadow-md hover:border-accent/50 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-accent/10 transition-colors" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  La tua ricerca
                </span>
                <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <Search className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-bold text-foreground tracking-tight">
                  Milano
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Oggi • 1 Persona
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <h2 className="text-xl font-bold tracking-tight">Filtra per</h2>
              <button className="text-xs font-bold text-accent hover:underline">
                Azzera
              </button>
            </div>

            {/* Filtro: Tipo di Spazio (Checkbox reali) */}
            <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Tipo di spazio
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  "Flex Desk",
                  "Ufficio Privato",
                  "Sala Meeting",
                  "Sala Podcast",
                ].map((tipo) => (
                  <div key={tipo} className="flex items-center space-x-3">
                    <Checkbox
                      id={tipo}
                      className="rounded-md border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <label
                      htmlFor={tipo}
                      className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      {tipo}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro: Fascia di Prezzo (Slider reale) */}
            <div className="flex flex-col gap-5 pb-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  Prezzo max giornaliero
                </h3>
                <span className="text-sm font-bold text-accent">150€</span>
              </div>
              <Slider
                defaultValue={[150]}
                max={300}
                step={10}
                className="[&_[role=slider]]:bg-background [&_[role=slider]]:border-accent [&_[role=slider]]:border-2 [&>.relative>.absolute]:bg-accent"
              />
            </div>

            {/* Filtro: Servizi Inclusi (Checkbox reali) */}
            <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Servizi Inclusi
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  "Monitor Esterno",
                  "Caffè illimitato",
                  "Aria Condizionata",
                  "Stampante",
                  "Parcheggio",
                ].map((servizio) => (
                  <div key={servizio} className="flex items-center space-x-3">
                    <Checkbox
                      id={servizio}
                      className="rounded-md border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <label
                      htmlFor={servizio}
                      className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                      {servizio}
                    </label>
                  </div>
                ))}
              </div>
              <button className="text-sm font-bold text-accent text-left hover:underline">
                Mostra tutti
              </button>
            </div>
          </aside>

          {/* =========================================
              COLONNA DESTRA: Lista Risultati (Griglia)
              ========================================= */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            {/* Header Risultati (Ora con vero Select di Shadcn) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                150+ spazi a Milano
              </h1>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground">
                  Ordina per:
                </span>
                <Select defaultValue="consigliati">
                  <SelectTrigger className="w-[180px] rounded-lg border-border/50 bg-background font-bold text-foreground h-10">
                    <SelectValue placeholder="Ordina" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem
                      value="consigliati"
                      className="font-medium cursor-pointer"
                    >
                      Consigliati
                    </SelectItem>
                    <SelectItem
                      value="prezzo-basso"
                      className="font-medium cursor-pointer"
                    >
                      Prezzo più basso
                    </SelectItem>
                    <SelectItem
                      value="prezzo-alto"
                      className="font-medium cursor-pointer"
                    >
                      Prezzo più alto
                    </SelectItem>
                    <SelectItem
                      value="distanza"
                      className="font-medium cursor-pointer"
                    >
                      Distanza dal centro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Griglia Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <Link
                  href={`/space/${space.id}`}
                  key={space.id}
                  className="group"
                >
                  <div className="bg-background rounded-[2rem] p-3 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-primary/5 hover:border-accent/30 transition-all duration-300 flex flex-col h-full">
                    {/* Immagine */}
                    <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-muted">
                      <Image
                        src={space.immagine}
                        alt={space.nome}
                        fill
                        unoptimized // Temporaneo per sviluppo locale
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm">
                        {space.tipo}
                      </div>
                      <button className="absolute top-3 right-3 h-8 w-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-accent transition-colors">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Dettagli Spazio */}
                    <div className="flex flex-col flex-1 px-2 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 pr-2">
                          {space.nome}
                        </h3>
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg shrink-0">
                          <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                          <span className="text-sm font-bold text-foreground">
                            {space.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-4">
                        <MapPin className="h-3.5 w-3.5" /> {space.distanza}
                      </p>

                      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-foreground">
                            {space.prezzo}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {" "}
                            / {space.unita}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-accent group-hover:underline underline-offset-4">
                          Prenota
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginazione */}
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl font-bold border-border/50 hover:bg-secondary/10 px-10 h-12"
              >
                Carica altri spazi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
