import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import type { SpaceData } from "./SearchClient";

const formatSpaceType = (type: string) => {
  const types: Record<string, string> = {
    DESK: "Scrivania Singola",
    PRIVATE_OFFICE: "Ufficio Privato",
    MEETING_ROOM: "Sala Meeting",
    EVENT_SPACE: "Spazio Eventi",
  };
  return types[type] || type;
};

interface Props {
  space: SpaceData;
  totalPrice: number;
  duration: number;
  detailQueryString: string;
}

export default function SpaceCard({
  space,
  totalPrice,
  duration,
  detailQueryString,
}: Props) {
  const averageRating =
    space.reviews?.length > 0
      ? (
          space.reviews.reduce((acc, r) => acc + r.rating, 0) /
          space.reviews.length
        ).toFixed(2)
      : "Nuovo";

  // Calculate how much it would have cost at full hourly price
  const originalPrice = space.hourlyPrice ? space.hourlyPrice * duration : 0;
  const isDailyDiscountApplied =
    space.dailyPrice &&
    originalPrice > space.dailyPrice &&
    totalPrice === space.dailyPrice;

  return (
    <Link href={`/space/${space.id}?${detailQueryString}`} className="group">
      <div className="bg-background rounded-[2rem] p-3 shadow-sm border border-border/50 hover:shadow-xl transition-all flex flex-col h-full relative">
        <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-muted">
          <Image
            src={
              space.imageUrls?.[0] ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c"
            }
            alt={space.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {formatSpaceType(space.type)}
          </div>

          {/* EXTRA BADGE: Visible only if there's a daily discount */}
          {isDailyDiscountApplied && (
            <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
              Sconto applicato
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-2 pb-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold tracking-tight line-clamp-1 pr-2">
              {space.title}
            </h3>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg shrink-0">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="text-sm font-bold">{averageRating}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-4 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {space.address},{" "}
            {space.city}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Prezzo Orario
              </span>
              <span className="text-sm font-bold text-foreground">
                {space.hourlyPrice?.toFixed(2) || "-"}€{" "}
                <span className="text-[10px] text-muted-foreground">/ora</span>
              </span>
            </div>

            <div className="flex items-end justify-between mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-0.5">
                Totale
              </span>
              <div className="text-right flex flex-col items-end">
                {/* STRIKETHROUGH PRICE */}
                {isDailyDiscountApplied && (
                  <span className="text-[11px] font-bold text-muted-foreground line-through decoration-destructive/60 mb-0.5">
                    {originalPrice.toFixed(2)}€
                  </span>
                )}

                {/* FINAL PRICE */}
                <span className="text-xl font-extrabold text-accent leading-none">
                  {totalPrice?.toFixed(2)}€
                </span>

                {/* FINAL LABEL BELOW PRICE */}
                <span className="block text-[9px] font-bold text-muted-foreground/60 mt-1">
                  {isDailyDiscountApplied
                    ? "Tariffa giornaliera applicata"
                    : `per ${duration}h di lavoro`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
