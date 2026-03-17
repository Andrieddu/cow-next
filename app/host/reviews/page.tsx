"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Search,
  MessageSquare,
  ThumbsUp,
  Filter,
  ChevronDown,
} from "lucide-react";

// Import standard di shadcn e utility
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// --- DATI MOCKUP RECENSIONI ---
const reviewsData = [
  {
    id: "r1",
    user: "Marco Rossi",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    date: "12 Marzo 2026",
    space: "Sala Meeting Galileo",
    comment:
      "Spazio incredibile, molto luminoso e con una connessione internet velocissima. L'host è stato super disponibile per il monitor extra richiesto. Torneremo sicuramente!",
    reply: "Grazie Marco! È stato un piacere ospitarvi.",
  },
  {
    id: "r2",
    user: "Giulia Bianchi",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 4,
    date: "05 Marzo 2026",
    space: "Flex Desk Centrale",
    comment:
      "Ottima posizione, proprio accanto alla stazione. Un po' di rumore la mattina presto, ma per il resto tutto perfetto. Molto pulito.",
    reply: null,
  },
  {
    id: "r3",
    user: "Luca Verdi",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    date: "28 Febbraio 2026",
    space: "Sala Meeting Galileo",
    comment:
      "Prenotazione last-minute gestita perfettamente. Lo spazio è molto professionale e i clienti sono rimasti colpiti.",
    reply: null,
  },
];

export default function HostReviewsPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-secondary/5 pb-20">
      {/* 1. HEADER */}
      <div className="bg-background sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Recensioni
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none font-bold">
              4.92 Media
            </Badge>
            <Badge className="bg-accent/10 text-accent border-none font-bold">
              Superhost
            </Badge>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* COLONNA SINISTRA: RIEPILOGO STATISTICHE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-background rounded-[2.5rem] p-8 shadow-sm border border-border/50">
              <div className="text-center mb-8">
                <h2 className="text-6xl font-extrabold text-foreground mb-2">
                  4.92
                </h2>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground font-medium">
                  Valutazione basata su 48 recensioni
                </p>
              </div>

              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-sm font-bold w-3">{star}</span>
                    <Progress
                      value={star === 5 ? 90 : star === 4 ? 8 : 2}
                      className="h-2 bg-secondary/20"
                    />
                  </div>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
                  Sentiment
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Pulizia</span>
                    <span className="font-bold">5.0</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Comunicazione</span>
                    <span className="font-bold">4.9</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span>Check-in</span>
                    <span className="font-bold">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNA DESTRA: LISTA RECENSIONI */}
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

            <div className="flex flex-col gap-6">
              {reviewsData.map((review) => (
                <div
                  key={review.id}
                  className="bg-background rounded-[2rem] p-6 md:p-8 shadow-sm border border-border/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-lg leading-tight">
                          {review.user}
                        </h4>
                        <p className="text-xs font-medium text-muted-foreground mt-1">
                          {review.date}
                        </p>
                        <div className="flex gap-0.5 mt-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 text-primary fill-primary"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <Badge
                        variant="outline"
                        className="bg-secondary/5 border-border/50 text-[10px] uppercase font-bold tracking-widest"
                      >
                        {review.space}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-foreground font-medium leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-border/50">
                    {review.reply ? (
                      <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 ml-0 md:ml-8">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-3.5 w-3.5 text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                            La tua risposta
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {review.reply}
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="text-accent font-bold hover:bg-accent/10 gap-2 rounded-xl"
                      >
                        <MessageSquare className="h-4 w-4" /> Rispondi a questa
                        recensione
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground gap-2 font-bold hover:text-foreground"
                    >
                      <ThumbsUp className="h-4 w-4" /> Utile
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-10">
              <Button
                variant="outline"
                className="rounded-2xl h-14 px-8 font-bold border-border/50 shadow-sm"
              >
                Carica altre recensioni
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
