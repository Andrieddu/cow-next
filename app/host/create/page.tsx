"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldSeparator,
} from "@/components/ui/field";
import {
  ArrowLeft,
  UploadCloud,
  MapPin,
  Euro,
  Info,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function CreateSpacePage() {
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-20">
      {/* 1. HEADER DELLA PAGINA */}
      <div className="container max-w-3xl mx-auto px-6 pt-12">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna al Profilo
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
            Aggiungi un nuovo spazio
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Descrivi il tuo ufficio o la tua scrivania per iniziare a ospitare
            professionisti.
          </p>
        </div>
      </div>

      {/* 2. FORM DI CREAZIONE */}
      <div className="container max-w-3xl mx-auto px-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-8"
        >
          {/* SEZIONE 1: Informazioni di base */}
          <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
            <FieldSet>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <Info className="h-5 w-5 text-accent" />
                </div>
                <FieldLegend className="text-xl font-bold tracking-tight mb-0">
                  Informazioni di base
                </FieldLegend>
              </div>

              <FieldGroup className="space-y-6">
                <Field>
                  <FieldLabel>Titolo dell'annuncio</FieldLabel>
                  <Input
                    placeholder="Es. Sala Meeting Luminosa in Centro"
                    className="h-12 rounded-xl border-border/50 bg-secondary/5 focus-visible:ring-accent/20 font-medium"
                  />
                  <FieldDescription>
                    Scegli un titolo accattivante che evidenzi i punti di forza.
                  </FieldDescription>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Select SHADCN */}
                  <Field>
                    <FieldLabel>Tipo di spazio</FieldLabel>
                    <Select>
                      {/* TRIGER: Dimensioni e stile allineati all'Input */}
                      <SelectTrigger className="w-full h-12 px-3 rounded-xl border border-border/50 bg-secondary/5 font-medium text-sm focus:ring-2 focus:ring-accent/20 focus:outline-none shadow-none">
                        <SelectValue placeholder="Seleziona tipo..." />
                      </SelectTrigger>

                      {/* CONTENT: bg-background solido e z-index alto */}
                      <SelectContent className="bg-background border border-border/50 rounded-xl shadow-2xl z-[100]">
                        {/* GRUPPO 1: Postazioni */}
                        <SelectGroup>
                          <SelectLabel className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-2">
                            Postazioni di Lavoro
                          </SelectLabel>

                          <SelectItem
                            value="desk"
                            className="cursor-pointer font-medium py-2.5 px-2 !text-foreground data-[highlighted]:!text-foreground"
                          >
                            Scrivania Flessibile
                          </SelectItem>

                          <SelectItem
                            value="office"
                            className="cursor-pointer font-medium py-2.5 px-2 !text-foreground data-[highlighted]:!text-foreground"
                          >
                            Ufficio Privato
                          </SelectItem>
                        </SelectGroup>

                        {/* SEPARATORE (Opzionale, ma sta bene) */}
                        <SelectSeparator className="bg-border/50 my-1" />

                        {/* GRUPPO 2: Sale */}
                        <SelectGroup>
                          <SelectLabel className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-2">
                            Spazi Condivisi
                          </SelectLabel>

                          <SelectItem
                            value="meeting"
                            className="cursor-pointer font-medium py-2.5 px-2 !text-foreground data-[highlighted]:!text-foreground"
                          >
                            Sala Meeting
                          </SelectItem>

                          <SelectItem
                            value="podcast"
                            className="cursor-pointer font-medium py-2.5 px-2 !text-foreground data-[highlighted]:!text-foreground"
                          >
                            Sala Podcast
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Input SHADCN con icona assoluta */}
                  <Field>
                    <FieldLabel>Capienza massima</FieldLabel>
                    <div className="relative">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Es. 4"
                        className="h-12 pl-10 rounded-xl border-border/50 bg-secondary/5 font-bold focus-visible:ring-accent/20"
                      />
                      <Users className="absolute left-4 top-4 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </Field>
                </div>

                {/* Textarea SHADCN */}
                <Field>
                  <FieldLabel>Descrizione</FieldLabel>
                  <Textarea
                    rows={4}
                    placeholder="Descrivi l'atmosfera, la luce naturale, o cosa rende unico questo posto..."
                    className="resize-none rounded-xl border-border/50 bg-secondary/5 p-4 font-medium text-sm focus-visible:ring-accent/20"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>

          {/* SEZIONE 2: Posizione */}
          <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
            <FieldSet>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <FieldLegend className="text-xl font-bold tracking-tight mb-0">
                  Posizione
                </FieldLegend>
              </div>

              <FieldGroup className="space-y-6">
                <Field>
                  <FieldLabel>Indirizzo completo</FieldLabel>
                  <Input
                    placeholder="Via Roma 10, Piano 2"
                    className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>Città</FieldLabel>
                    <Input
                      placeholder="Milano"
                      className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>CAP</FieldLabel>
                    <Input
                      placeholder="20121"
                      className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
          </div>

          {/* SEZIONE 3: Tariffe e Servizi */}
          <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
            <FieldSet>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <Euro className="h-5 w-5 text-accent" />
                </div>
                <FieldLegend className="text-xl font-bold tracking-tight mb-0">
                  Tariffe e Servizi
                </FieldLegend>
              </div>

              <FieldGroup className="space-y-8">
                {/* Prezzo */}
                <Field>
                  <FieldLabel>Prezzo orario</FieldLabel>
                  <div className="relative max-w-xs">
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="h-14 pl-12 text-lg font-bold rounded-2xl border-border/50 bg-secondary/5 focus-visible:ring-accent/20"
                    />
                    <Euro className="absolute left-4 top-4.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <span className="absolute right-4 top-4 font-bold text-muted-foreground pointer-events-none">
                      / ora
                    </span>
                  </div>
                  <FieldDescription>
                    Il prezzo include la commissione di servizio del 10% di CoW.
                  </FieldDescription>
                </Field>

                <FieldSeparator />

                {/* Servizi (Checkbox SHADCN integrati) */}
                <Field>
                  <FieldLabel>Cosa offre il tuo spazio?</FieldLabel>
                  <FieldDescription className="mb-4">
                    Seleziona tutte le comodità incluse nel prezzo.
                  </FieldDescription>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {[
                      "WiFi Fibra",
                      "Caffè e Acqua",
                      "Monitor Esterno",
                      "Aria Condizionata",
                      "Stampante/Scanner",
                      "Accesso 24/7",
                      "Pet Friendly",
                      "Parcheggio privato",
                    ].map((servizio) => (
                      <div
                        key={servizio}
                        className="flex items-center gap-3 group"
                      >
                        <Checkbox
                          id={servizio}
                          className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <label
                          htmlFor={servizio}
                          className="text-sm font-medium cursor-pointer group-hover:text-accent transition-colors"
                        >
                          {servizio}
                        </label>
                      </div>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>

          {/* SEZIONE 4: Foto */}
          <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
            <FieldSet>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <UploadCloud className="h-5 w-5 text-accent" />
                </div>
                <FieldLegend className="text-xl font-bold tracking-tight mb-0">
                  Galleria Fotografica
                </FieldLegend>
              </div>

              <FieldGroup>
                <div className="border-2 border-dashed border-border/60 hover:border-accent/50 bg-secondary/5 hover:bg-accent/5 transition-colors rounded-[2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer group">
                  <div className="h-16 w-16 bg-background rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="text-lg font-bold mb-1">
                    Trascina le tue foto qui
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium mb-6">
                    Supporta JPG, PNG ad alta risoluzione. Minimo 3 foto
                    consigliate.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold border-border/50 pointer-events-none"
                  >
                    Sfoglia file
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </div>

          {/* AZIONI FINALI */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4">
            <Button
              variant="ghost"
              className="h-14 px-8 rounded-2xl font-bold w-full sm:w-auto"
            >
              Salva come bozza
            </Button>
            <Button className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all w-full sm:w-auto gap-2">
              <CheckCircle2 className="h-5 w-5" /> Pubblica lo spazio
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
