import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  ArrowLeft,
  Star,
  Search,
  MessageSquare,
  Filter,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// IMPORT DATABASE E AUTH
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function HostReviewsPage() {
  // 1. AUTENTICAZIONE E SICUREZZA
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. RECUPERO TUTTE LE RECENSIONI PER GLI SPAZI DI QUESTO HOST
  // Usiamo Prisma per trovare tutte le recensioni collegate agli spazi dove l'hostId = user.id
  const reviews = await prisma.review.findMany({
    where: {
      space: {
        hostId: user.id,
      },
    },
    include: {
      user: true, // Chi ha lasciato la recensione
      space: true, // Su quale spazio
    },
    orderBy: {
      createdAt: "desc", // Le più recenti prima
    },
  });

  // 3. CALCOLO STATISTICHE REALI
  const totalReviews = reviews.length;

  // Calcolo media generale
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews;

  // Calcolo distribuzione delle stelle (quante da 5, quante da 4, ecc.)
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((rev) => {
    if (rev.rating >= 1 && rev.rating <= 5) {
      ratingCounts[rev.rating as keyof typeof ratingCounts]++;
    }
  });

  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER */}
      <div className="bg-background sticky top-0 z-30 border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Recensioni
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none font-bold">
              {averageRating.toFixed(2)} Media
            </Badge>
            {averageRating >= 4.8 && totalReviews > 5 && (
              <Badge className="bg-accent/10 text-accent border-none font-bold">
                Superhost
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNA SINISTRA: RIEPILOGO STATISTICHE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-background rounded-[2.5rem] p-8 shadow-sm border border-border/50 sticky top-28">
              <div className="text-center mb-8">
                <h2 className="text-6xl font-extrabold text-foreground mb-2">
                  {averageRating.toFixed(1)}
                </h2>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.round(averageRating)
                          ? "text-primary fill-primary"
                          : "text-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground font-medium">
                  Valutazione basata su {totalReviews} recensioni
                </p>
              </div>

              {/* BARRE DI PROGRESSO REALI */}
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star as keyof typeof ratingCounts];
                  const percentage =
                    totalReviews === 0 ? 0 : (count / totalReviews) * 100;

                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-sm font-bold w-3">{star}</span>
                      <Progress
                        value={percentage}
                        className="h-2 bg-secondary/20"
                      />
                      <span className="text-xs font-medium text-muted-foreground w-6 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Rimosso il sentiment hardcoded finché non avrai le metriche separate a DB */}
            </div>
          </div>

          {/* COLONNA DESTRA: LISTA RECENSIONI REALI */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca tra i commenti..."
                  className="pl-11 h-11 rounded-xl bg-background border-border/50"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-xl font-bold border-border/50 gap-2 h-11"
              >
                <Filter className="h-4 w-4" /> Filtra per spazio{" "}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {totalReviews === 0 ? (
              <div className="bg-background rounded-[2.5rem] p-12 text-center border-2 border-dashed border-border/50">
                <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Nessuna recensione</h3>
                <p className="text-muted-foreground font-medium">
                  Quando i tuoi ospiti lasceranno un feedback, apparirà qui.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-background rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/50 transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                          <AvatarImage src={review.user.image || ""} />
                          <AvatarFallback>
                            {review.user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-lg leading-tight">
                            {review.user.name} {review.user.surname?.charAt(0)}.
                          </h4>
                          <p className="text-xs font-medium text-muted-foreground mt-1 capitalize">
                            {format(
                              new Date(review.createdAt),
                              "dd MMMM yyyy",
                              { locale: it },
                            )}
                          </p>
                          <div className="flex gap-0.5 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < review.rating
                                    ? "text-primary fill-primary"
                                    : "text-muted-foreground/30",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <Link href={`/space/${review.space.id}`}>
                          <Badge
                            variant="outline"
                            className="bg-secondary/5 border-border/50 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary/10 transition-colors"
                          >
                            {review.space.title}
                          </Badge>
                        </Link>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-foreground font-medium leading-relaxed italic text-sm md:text-base">
                        {review.comment}
                      </p>
                    </div>

                    {/* SEZIONE RISPOSTA (Al momento visiva, da implementare a DB se lo desideri) */}
                    <div className="pt-6 border-t border-dashed border-border/50">
                      <Button
                        variant="ghost"
                        className="text-accent font-bold hover:bg-accent/10 gap-2 rounded-xl h-10 px-4"
                      >
                        <MessageSquare className="h-4 w-4" /> Rispondi
                        pubblicamente
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
