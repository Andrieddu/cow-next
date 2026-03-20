"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Share,
  Heart,
  Wifi,
  Coffee,
  Printer,
  ShieldCheck,
  Users,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Compass,
  Navigation,
  Monitor,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";

import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";

// Helper MediaQuery (Versione sicura per React 18+ senza errori ESLint)
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => matchMedia.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Helper Icone
const getAmenityIcon = (amenity: string) => {
  const lowerAmenity = amenity.toLowerCase();
  if (
    lowerAmenity.includes("wi-fi") ||
    lowerAmenity.includes("wifi") ||
    lowerAmenity.includes("lan")
  )
    return <Wifi className="h-6 w-6 text-accent" />;
  if (
    lowerAmenity.includes("caff") ||
    lowerAmenity.includes("acqua") ||
    lowerAmenity.includes("break")
  )
    return <Coffee className="h-6 w-6 text-accent" />;
  if (lowerAmenity.includes("stampante"))
    return <Printer className="h-6 w-6 text-accent" />;
  if (
    lowerAmenity.includes("schermo") ||
    lowerAmenity.includes("monitor") ||
    lowerAmenity.includes("proiettore")
  )
    return <Monitor className="h-6 w-6 text-accent" />;
  if (
    lowerAmenity.includes("sanificazione") ||
    lowerAmenity.includes("reception")
  )
    return <ShieldCheck className="h-6 w-6 text-accent" />;
  return <CheckCircle className="h-6 w-6 text-accent" />;
};

// Accettiamo Space e Host dal Server
export default function SpaceDetailClient({
  space,
  host,
}: {
  space: any;
  host: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // --- LOGICA DI LETTURA PARAMETRI URL ---
  const urlStartDate = searchParams.get("startDate");
  const urlEndDate = searchParams.get("endDate");
  const urlStartHour = searchParams.get("start");
  const urlEndHour = searchParams.get("end");

  // Inizializzazione Date
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const from = urlStartDate ? parseISO(urlStartDate) : new Date();
    const to = urlEndDate ? parseISO(urlEndDate) : from;

    return {
      from: isValid(from) ? from : new Date(),
      to: isValid(to) ? to : isValid(from) ? from : new Date(),
    };
  });
  // Inizializzazione Orari
  const [startTime, setStartTime] = useState(urlStartHour || "09:00");
  const [endTime, setEndTime] = useState(urlEndHour || "13:00");

  const [guests, setGuests] = useState(1);
  const [isFullDay, setIsFullDay] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isChecking, setIsChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: space?.title, url });
      } catch (err) {
        console.log("Condivisione annullata", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiato!", {
        description: "Incollalo dove vuoi per condividere lo spazio.",
      });
    }
  };

  const handleSave = () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    if (nextState)
      toast.success("Aggiunto ai preferiti", {
        icon: <Heart className="h-4 w-4 fill-red-500 text-red-500" />,
      });
    else toast.info("Rimosso dai preferiti");
  };

  const handleCheckAvailability = () => {
    if (!date?.from) {
      toast.error("Seleziona una data per procedere.");
      return;
    }
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setIsModalOpen(true);
    }, 1000); // Simuliamo la chiamata DB
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    // TODO: In the future, we will send data to the checkout via URL params or state
    router.push(`/checkout?spaceId=${space.id}`);
  };

  const duration = useMemo(() => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    return Math.max(1, endHour - startHour);
  }, [startTime, endTime]);

  // Calcoli Prezzi & Rating dinamici
  const isHourly = !!space.hourlyPrice;
  const currentBasePrice = isFullDay
    ? space.dailyPrice || 0
    : space.hourlyPrice || space.dailyPrice || 0;
  const priceLabel = isFullDay ? "giorno" : isHourly ? "ora" : "giorno";
  const totalPrice = isFullDay
    ? space.dailyPrice || 0
    : isHourly
      ? (space.hourlyPrice || 0) * duration
      : space.dailyPrice || 0;

  const averageRating =
    space.reviews.length > 0
      ? (
          space.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          space.reviews.length
        ).toFixed(2)
      : "Nuovo";

  // Immagini Sicure (nel caso non ne abbia 5, ripete l'array)
  const defaultImage =
    "https://images.unsplash.com/photo-1497366216548-37526070297c";
  const safeImages =
    space.imageUrls && space.imageUrls.length > 0
      ? space.imageUrls
      : [defaultImage];
  const galleryImages = Array.from({ length: 5 }).map(
    (_, i) => safeImages[i % safeImages.length],
  );

  const BookingSummaryContent = (
    <div className="bg-secondary/10 rounded-2xl p-5 border border-border/50 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-foreground">Data</span>
        <span className="text-sm font-bold">
          {date?.from
            ? format(date.from, "dd MMM yyyy", { locale: it })
            : "Da definire"}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-foreground">Orario</span>
        <span className="text-sm font-bold">
          {isFullDay ? "Giornata Intera" : `${startTime} - ${endTime}`}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-foreground">Persone</span>
        <span className="text-sm font-bold">{guests}</span>
      </div>
      <Separator />
      <div className="flex justify-between items-center text-lg">
        <span className="font-extrabold">Totale</span>
        <span className="font-extrabold text-accent">
          €{totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/search"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla ricerca
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="font-bold gap-2 rounded-xl border-border/50"
            onClick={handleShare}
          >
            <Share className="h-4 w-4" /> Condividi
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "font-bold gap-2 rounded-xl border-border/50 transition-all",
              isSaved &&
                "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
            )}
            onClick={handleSave}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
            {isSaved ? "Salvato" : "Salva"}
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6">
        {/* TITOLO E RATING */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {space.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="font-bold text-foreground">{averageRating}</span>
              <span className="text-muted-foreground underline underline-offset-4 cursor-pointer">
                ({space.reviews.length} recensioni)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="underline underline-offset-4 hover:text-accent transition-colors cursor-pointer">
                {space.address}, {space.city}
              </span>
            </div>
            <Badge className="rounded-lg font-bold bg-accent/10 text-accent border-none uppercase text-[10px] tracking-widest px-3 py-1">
              {space.type.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* GALLERIA */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[350px] md:h-[550px] rounded-[3rem] overflow-hidden mb-12 shadow-sm border border-border/50">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
            <Image
              unoptimized
              src={galleryImages[0]}
              alt="Main Space"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {galleryImages.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              className="hidden md:block relative group cursor-pointer overflow-hidden bg-muted"
            >
              <Image
                unoptimized
                src={img}
                alt={`Space ${idx + 2}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {idx === 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-bold text-sm bg-background/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    Mostra tutte le foto
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* LAYOUT A DUE COLONNE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Sezione Host */}
            <div className="flex items-center justify-between pb-10 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Spazio gestito da {host?.name} {host?.surname}
                </h2>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" /> Fino a {space.capacity}{" "}
                  {space.capacity === 1 ? "persona" : "persone"}
                  {host?.createdAt &&
                    ` • Host dal ${new Date(host.createdAt).getFullYear()}`}
                </p>
              </div>
              <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                <AvatarImage
                  src={host?.image || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>{host?.name?.charAt(0) || "H"}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Informazioni sullo spazio</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium whitespace-pre-line line-clamp-4">
                {space.description}
              </p>
              {/* Bottone ripristinato */}
              <Button
                variant="link"
                className="p-0 h-auto font-bold text-accent text-base hover:no-underline transition-colors"
              >
                Leggi la descrizione completa{" "}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-8">
              <h3 className="text-xl font-bold">Cosa offre questo spazio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-foreground">
                {space.amenities &&
                  space.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-5">
                      <div className="p-3.5 bg-accent/10 rounded-2xl">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="font-bold">{amenity}</span>
                    </div>
                  ))}
              </div>
            </div>

            <Separator />

            {/* Sezione Mappa Ripristinata */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Dove ti troverai</h3>
              <div className="relative w-full h-[350px] rounded-[2.5rem] overflow-hidden border border-border/50 group shadow-inner bg-secondary/20">
                <Image
                  unoptimized
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80"
                  alt="Mappa position"
                  fill
                  className="object-cover opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 bg-accent/20 rounded-full animate-ping" />
                    <div className="bg-accent p-3 rounded-full shadow-2xl border-2 border-white">
                      <Compass className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                {/* Elemento Navigation Overlay */}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Navigation className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">
                        Indicazioni Stradali
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        5 min dalla Metro
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Griglia info aggiuntive mappa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-2 p-5 bg-secondary/5 rounded-2xl border border-border/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Il quartiere
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Distretto tecnologico e vibrante, pieno di bar e aree verdi
                    a pochi passi.
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-secondary/5 rounded-2xl border border-border/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Come arrivare
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Metro M2 e M3 raggiungibili in pochi minuti.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA (Box Prenotazione) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-2xl shadow-border/10 overflow-hidden">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">
                    €{currentBasePrice.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground font-bold ml-1">
                    {" "}
                    / {priceLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span>{averageRating}</span>
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <FieldGroup className="space-y-6">
                  <FieldSet>
                    <FieldGroup className="space-y-6">
                      <Field>
                        <FieldLabel>Quando ne hai bisogno?</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-14 justify-start text-left font-bold rounded-2xl border-border/50 px-5",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-3 h-5 w-5 text-accent" />
                              {date?.from ? (
                                date.to ? (
                                  <>
                                    {format(date.from, "dd MMM", {
                                      locale: it,
                                    })}{" "}
                                    -{" "}
                                    {format(date.to, "dd MMM", { locale: it })}
                                  </>
                                ) : (
                                  format(date.from, "dd MMM", { locale: it })
                                )
                              ) : (
                                <span>Seleziona date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-3xl border shadow-2xl bg-background z-50"
                            align="end"
                          >
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={date?.from}
                              selected={date}
                              onSelect={setDate}
                              numberOfMonths={2}
                              locale={it}
                              className="bg-background rounded-3xl"
                            />
                          </PopoverContent>
                        </Popover>
                        <FieldDescription>
                          Cancellazione gratuita fino a 24 ore prima.
                        </FieldDescription>
                      </Field>

                      <Field>
                        <div className="flex items-center justify-between mb-3 px-1">
                          <FieldLabel className="mb-0">
                            Fascia Oraria
                          </FieldLabel>
                          <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                            <Checkbox
                              id="fullDay"
                              checked={isFullDay}
                              onCheckedChange={(checked) =>
                                setIsFullDay(!!checked)
                              }
                              className="border-yellow-500 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-black"
                            />
                            <label
                              htmlFor="fullDay"
                              className="text-[10px] font-extrabold uppercase tracking-tight cursor-pointer select-none text-yellow-700"
                            >
                              Giornata Intera
                            </label>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "grid grid-cols-2 gap-3 transition-all duration-300",
                            isFullDay &&
                              "opacity-30 pointer-events-none scale-95",
                          )}
                        >
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 tracking-widest">
                              Dalle
                            </span>
                            <div className="relative">
                              <Select
                                value={startTime}
                                onValueChange={setStartTime}
                              >
                                <SelectTrigger className="w-full h-14 pl-4 pr-10 rounded-2xl border-border/50 bg-secondary/5 font-bold text-sm [&>svg]:hidden">
                                  <SelectValue placeholder="Inizio" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border rounded-xl shadow-2xl z-[100]">
                                  {[
                                    "08:00",
                                    "09:00",
                                    "10:00",
                                    "11:00",
                                    "14:00",
                                  ].map((ora) => (
                                    <SelectItem
                                      key={ora}
                                      value={ora}
                                      className="font-bold"
                                    >
                                      {ora}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 tracking-widest">
                              Alle
                            </span>
                            <div className="relative">
                              <Select
                                value={endTime}
                                onValueChange={setEndTime}
                              >
                                <SelectTrigger className="w-full h-14 pl-4 pr-10 rounded-2xl border-border/50 bg-secondary/5 font-bold text-sm [&>svg]:hidden">
                                  <SelectValue placeholder="Fine" />
                                </SelectTrigger>
                                <SelectContent className="bg-background border rounded-xl shadow-2xl z-[100]">
                                  {[
                                    "11:00",
                                    "12:00",
                                    "13:00",
                                    "14:00",
                                    "18:00",
                                    "20:00",
                                  ].map((ora) => (
                                    <SelectItem
                                      key={ora}
                                      value={ora}
                                      className="font-bold"
                                    >
                                      {ora}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                            </div>
                          </div>
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel>Partecipanti</FieldLabel>
                        <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/50">
                          <span className="font-bold text-sm text-muted-foreground">
                            Ospiti previsti
                          </span>
                          <div className="flex items-center gap-5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setGuests(Math.max(1, guests - 1))}
                              className="h-8 w-8 rounded-full border-border/50 shadow-sm"
                            >
                              -
                            </Button>
                            <span className="font-extrabold w-4 text-center">
                              {guests}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setGuests(Math.min(space.capacity, guests + 1))
                              }
                              className="h-8 w-8 rounded-full border-border/50 shadow-sm"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <FieldDescription>
                          Capienza massima per questa sala: {space.capacity}{" "}
                          persone.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <Button
                    onClick={handleCheckAvailability}
                    disabled={isChecking}
                    className="w-full h-15 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-7 mt-4"
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Verifica in corso...
                      </>
                    ) : (
                      "Verifica Disponibilità"
                    )}
                  </Button>
                </FieldGroup>
              </form>

              <div className="mt-8 space-y-4 pt-8 border-t border-border/50">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
                    €{currentBasePrice.toFixed(2)} x{" "}
                    {isFullDay
                      ? "1 giorno"
                      : isHourly
                        ? `${duration} ore`
                        : "1 giorno"}
                  </span>
                  <span className="text-foreground">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-extrabold pt-4 border-t border-dashed border-border/50">
                  <span>Totale stimato</span>
                  <span className="text-accent">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE MODAL: DIALOG (DESKTOP) o DRAWER (MOBILE) --- */}
      {isDesktop ? (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 gap-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Spazio Disponibile!
              </DialogTitle>
              <DialogDescription className="text-base">
                Ottime notizie, {space.title} è libero per le date selezionate.
              </DialogDescription>
            </DialogHeader>
            {BookingSummaryContent}
            <DialogFooter className="flex-col sm:flex-col gap-3 sm:space-x-0">
              <Button
                onClick={handleConfirmBooking}
                className="w-full rounded-xl h-12 font-bold text-base"
              >
                Conferma e vai al pagamento
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-xl font-bold text-muted-foreground"
              >
                Annulla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerContent className="rounded-t-[2rem]">
            <div className="p-6 pb-8 gap-6 flex flex-col">
              <DrawerHeader className="px-0 text-left">
                <DrawerTitle className="text-2xl font-bold">
                  Spazio Disponibile! 🎉
                </DrawerTitle>
                <DrawerDescription className="text-base">
                  Ottime notizie, {space.title} è libero per le date
                  selezionate.
                </DrawerDescription>
              </DrawerHeader>
              {BookingSummaryContent}
              <DrawerFooter className="px-0 flex-col gap-3">
                <Button
                  onClick={handleConfirmBooking}
                  className="w-full rounded-xl h-12 font-bold text-base"
                >
                  Conferma e vai al pagamento
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl font-bold text-muted-foreground"
                >
                  Annulla
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </main>
  );
}
