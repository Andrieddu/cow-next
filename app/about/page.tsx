import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, Globe, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex flex-col w-full bg-background">
      {/* 1. HERO "UNBOXED" */}
      <section className="container max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="max-w-4xl">
          <div className="inline-flex items-center rounded-full bg-secondary/30 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-8">
            La nostra missione
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-8">
            Rendiamo il lavoro <br />
            <span className="text-primary italic">umano</span>, ovunque tu sia.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
            CoW nasce dall'idea che l'ufficio non debba essere un limite, ma
            un'opportunità di connessione. Abbiamo eliminato la burocrazia per
            lasciarti solo il piacere di creare.
          </p>
        </div>
      </section>

      {/* 2. VISION & IMMAGINE LIBERA */}
      <section className="w-full py-24 bg-secondary/10">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Immagine Libera (Senza box o overflow-hidden) */}
            <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center">
              <Image
                src="/coworker.png"
                alt="Persone che collaborano"
                fill
                className="object-contain drop-shadow-2xl transition-transform hover:-translate-y-2 duration-500"
              />
            </div>

            {/* Testo Vision */}
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Perché CoW?
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Il mondo del lavoro è cambiato. Oggi non cerchiamo solo una
                scrivania, ma un ecosistema che ci stimoli. CoW è il ponte tra
                chi ha uno spazio da condividere e chi ha un progetto da
                realizzare.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold">Velocità</h4>
                  <p className="text-sm text-muted-foreground">
                    Prenoti in 30 secondi, entri subito.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold">Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Non sei mai solo, sei tra pari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. I NOSTRI VALORI */}
      <section className="container max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            I pilastri di CoW
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] hover:bg-secondary/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6">
              <Globe className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-4">Sostenibilità</h3>
            <p className="text-muted-foreground font-medium">
              Ridurre gli sprechi riutilizzando spazi esistenti e ottimizzando
              le risorse urbane.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] hover:bg-secondary/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-4">Flessibilità</h3>
            <p className="text-muted-foreground font-medium">
              Nessun canone fisso, nessuna caparra. Paghi solo lo spazio che
              respiri.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] hover:bg-secondary/5 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-4">Inclusività</h3>
            <p className="text-muted-foreground font-medium">
              Dal freelance alla startup, ogni idea trova la sua casa ideale su
              CoW.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CTA FINALE */}
      <section className="container max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-accent rounded-[3rem] p-12 md:p-20 text-center text-accent-foreground relative overflow-hidden shadow-xl shadow-accent/10">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto a cambiare modo di lavorare?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-xl mx-auto font-medium">
              Unisciti a migliaia di professionisti che hanno già scelto la
              libertà di CoW.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-bold h-14 px-10 rounded-2xl text-accent hover:bg-white/90"
                >
                  Esplora gli spazi
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-10 rounded-2xl gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                  Inizia ora <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
