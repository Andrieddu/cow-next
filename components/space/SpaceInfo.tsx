import React from "react";
import {
  Users,
  ChevronRight,
  Wifi,
  Coffee,
  Printer,
  Monitor,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SpaceDetailData } from "./SpaceDetailClient";

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

interface Props {
  space: SpaceDetailData;
  host: any;
}

export default function SpaceInfo({ space, host }: Props) {
  return (
    <>
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
          <AvatarImage src={host?.image || "https://github.com/shadcn.png"} />
          <AvatarFallback>{host?.name?.charAt(0) || "H"}</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Informazioni sullo spazio</h3>
        <p className="text-muted-foreground leading-relaxed text-lg font-medium whitespace-pre-line line-clamp-4">
          {space.description}
        </p>
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

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Dove ti troverai</h3>
        <div className="relative w-full h-[350px] rounded-sm overflow-hidden border border-border/50 shadow-inner bg-secondary/20">
          <iframe
            title={`Mappa per ${space.title}`}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${space.address}, ${space.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale-[30%] contrast-125 transition-all duration-500 hover:grayscale-0"
          ></iframe>
        </div>
      </div>
    </>
  );
}
