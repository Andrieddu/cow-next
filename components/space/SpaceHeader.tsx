import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Share, Heart, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SpaceDetailData } from "./SpaceDetailClient";

interface Props {
  space: SpaceDetailData;
  isSaved: boolean;
  setIsSaved: (val: boolean) => void;
  averageRating: string;
}

export default function SpaceHeader({
  space,
  isSaved,
  setIsSaved,
  averageRating,
}: Props) {
  const searchParams = useSearchParams();
  const backToSearchUrl = searchParams.toString()
    ? `/search?${searchParams.toString()}`
    : "/search";

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: space?.title, url });
      } catch (err) {
        console.error("Errore durante la condivisione:", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiato!");
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved)
      toast.success("Aggiunto ai preferiti", {
        icon: <Heart className="h-4 w-4 fill-red-500 text-red-500" />,
      });
    else toast.info("Rimosso dai preferiti");
  };

  return (
    <>
      <div className="container max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href={backToSearchUrl}
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
            onClick={handleSave}
            className={cn(
              "font-bold gap-2 rounded-xl border-border/50 transition-all",
              isSaved &&
                "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
            )}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />{" "}
            {isSaved ? "Salvato" : "Salva"}
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
          {space.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="font-bold text-foreground">{averageRating}</span>
            <span className="text-muted-foreground underline underline-offset-4 cursor-pointer">
              ({space.reviews?.length || 0} recensioni)
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
    </>
  );
}
