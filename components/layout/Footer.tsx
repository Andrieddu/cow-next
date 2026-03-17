import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    /* Contenitore principale: Applichiamo l'arrotondamento e l'ombra qui.
       - rounded-t-[3rem]: Arrotondamento generoso degli angoli superiori.
       - shadow-... : Ombra leggera verso l'alto per dare profondità.
       - overflow-hidden: Assicura che i background interni seguano la curva.
    */
    <footer className="w-full border-t border-border/40 rounded-t-[3rem] shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* SEZIONE SOPRA: Aqua chiaro (#a1e8e3) 
          Prende il colore di sfondo mappato come 'secondary' nel globals.css
      */}
      <div className="bg-secondary/30 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
            {/* Brand & Descrizione */}
            <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
              <Link href="/" className="transition-opacity hover:opacity-90">
                <Image
                  src="/logo.png"
                  alt="Logo CoW"
                  width={90}
                  height={32}
                  className="object-contain"
                />
              </Link>
              <p className="text-sm text-foreground/80 max-w-[280px] leading-relaxed font-medium">
                La piattaforma definitiva per gestire e trovare il tuo prossimo
                spazio di coworking. Semplice, veloce, smart.
              </p>
            </div>

            {/* Piattaforma */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Piattaforma
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/spazi"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Esplora Spazi
                </Link>
                <Link
                  href="/prezzi"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Listino Prezzi
                </Link>
                <Link
                  href="/servizi"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Servizi Extra
                </Link>
              </nav>
            </div>

            {/* Azienda */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Azienda
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/chi-siamo"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Chi Siamo
                </Link>
                <Link
                  href="/contatti"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Contatti
                </Link>
                <Link
                  href="/blog"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Blog
                </Link>
              </nav>
            </div>

            {/* Legale */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Legale
              </h4>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/termini"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Termini d'uso
                </Link>
                <Link
                  href="/cookies"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors font-medium"
                >
                  Cookies
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* SEZIONE SOTTO: Teal (#5cc0ba)
          Prende il colore di sfondo mappato come 'accent' nel globals.css
      */}
      <div className="bg-accent py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-xs text-accent-foreground font-semibold">
            © {currentYear} CoW Spaces. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
