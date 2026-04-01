import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesSection() {
  return (
    <section className="w-full bg-secondary/5 py-24 border-t border-border/50">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Una piattaforma,{" "}
            <span className="text-accent italic">due anime.</span>
          </h2>
          <p className="mt-4 text-muted-foreground font-medium text-lg">
            Sia che tu cerchi un posto tranquillo per lavorare, sia che tu
            voglia affittare la tua scrivania libera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* CARD: PROFESSIONAL */}
          <div className="flex flex-col gap-8 bg-background p-8 md:p-10 rounded-[3rem] shadow-sm border border-border/50 hover:shadow-xl transition-all group">
            <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
              <Image
                src="/coworker.png"
                alt="Professionista al lavoro"
                fill
                className="object-contain drop-shadow-2xl transition-transform group-hover:-translate-y-4 duration-500"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-bold text-primary-foreground uppercase tracking-widest mb-4">
                Per i Professionisti
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">
                Trova lo spazio perfetto.
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8 flex-1">
                Hai bisogno di una scrivania per oggi o di una sala meeting per
                domani? Esplora centinaia di spazi certificati e prenota in un
                click.
              </p>
              <Link href="/search">
                <Button
                  size="lg"
                  className="w-fit font-bold rounded-2xl gap-2 shadow-sm px-8 h-12"
                >
                  Cerca uno spazio <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* CARD: OWNER */}
          <div className="flex flex-col gap-8 bg-background p-8 md:p-10 rounded-[3rem] shadow-sm border border-border/50 hover:shadow-xl transition-all group">
            <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
              <Image
                src="/desk.png"
                alt="Scrivania pronta per affitto"
                fill
                className="object-contain drop-shadow-2xl transition-transform group-hover:-translate-y-4 duration-500"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[10px] font-bold text-accent uppercase tracking-widest mb-4">
                Per i Proprietari
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">
                Metti a rendita il tuo ufficio.
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8 flex-1">
                Hai un ufficio con postazioni vuote o una sala riunioni
                inutilizzata? Pubblica il tuo annuncio gratuitamente e inizia a
                guadagnare.
              </p>
              <Link href="/become-host">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-fit font-bold rounded-2xl gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-sm px-8 h-12"
                >
                  Diventa Host <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
