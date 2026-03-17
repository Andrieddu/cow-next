import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactsPage() {
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5">
      <section className="container max-w-7xl mx-auto px-6 py-16 md:py-24 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* =========================================
              COLONNA SINISTRA: Info (Stile Unboxed)
              ========================================= */}
          <div className="flex flex-col">
            <div className="inline-flex w-fit items-center rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-6">
              Get in touch
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Parliamo del tuo <br />
              <span className="text-accent italic">prossimo spazio.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-12 max-w-md">
              Hai domande su CoW? Il nostro team è pronto a guidarti verso la
              soluzione più smart per il tuo lavoro.
            </p>

            {/* Info Items */}
            <div className="flex flex-col gap-10">
              {/* Email */}
              <div className="flex items-start gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-background border border-border/50 shadow-sm flex items-center justify-center shrink-0 group-hover:border-accent/50 transition-colors">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div className="flex flex-col pt-1">
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:hello@cowspaces.it"
                    className="text-xl font-bold hover:text-accent transition-colors"
                  >
                    hello@cowspaces.it
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-background border border-border/50 shadow-sm flex items-center justify-center shrink-0 group-hover:border-accent/50 transition-colors">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div className="flex flex-col pt-1">
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 mb-1">
                    Telefono
                  </h4>
                  <a
                    href="tel:+39021234567"
                    className="text-xl font-bold hover:text-accent transition-colors"
                  >
                    +39 02 1234 567
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-background border border-border/50 shadow-sm flex items-center justify-center shrink-0 group-hover:border-accent/50 transition-colors">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div className="flex flex-col pt-1">
                  <h4 className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 mb-1">
                    Sede
                  </h4>
                  <p className="text-xl font-bold">Milano, Italia</p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Via dell'Innovazione, 10
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              COLONNA DESTRA: Card del Messaggio
              ========================================= */}
          <div className="bg-background p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-border/10 border border-border/50 w-full max-w-lg mx-auto lg:mx-0 relative">
            {/* Elemento decorativo giallo dietro la card per dare profondità */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl -z-10" />

            <h3 className="text-2xl font-bold mb-8 tracking-tight">
              Inviaci un messaggio
            </h3>

            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  placeholder="Mario Rossi"
                  className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 focus-visible:border-accent text-base px-4 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="mario@esempio.com"
                  className="h-12 rounded-xl border-border/50 focus-visible:ring-accent/20 focus-visible:border-accent text-base px-4 font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground/80 px-1">
                  Messaggio
                </label>
                <textarea
                  placeholder="Come possiamo aiutarti?"
                  className="min-h-[140px] w-full rounded-xl border border-border/50 bg-transparent px-4 py-3 text-base font-medium shadow-sm outline-none transition-all focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/10 resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              <p className="text-[11px] text-muted-foreground/70 font-medium px-1">
                Premendo invia confermi di accettare la nostra{" "}
                <Link
                  href="/privacy"
                  className="text-accent font-bold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Bottone Giallo #fece51 */}
              <Button
                size="lg"
                className="w-full h-14 mt-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 text-base"
              >
                Invia messaggio <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
