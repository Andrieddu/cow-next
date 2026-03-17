"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  ShieldCheck,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";

export default function CheckoutPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background pb-20">
      {/* 1. HEADER MINIMALE (Senza bordo inferiore) */}
      <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/space/1"
            className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Torna all'annuncio
          </Link>
          <div className="font-bold text-xl tracking-tight">
            Conferma e paga
          </div>
          <div className="w-24" /> {/* Spacer per centrare il titolo */}
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* =========================================
              COLONNA SINISTRA: DATI E PAGAMENTO
              ========================================= */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* SEZIONE 1: Il tuo viaggio/prenotazione */}
            <FieldSet>
              <FieldLegend className="text-2xl font-bold tracking-tight mb-6">
                La tua prenotazione
              </FieldLegend>
              <FieldGroup className="space-y-6 bg-secondary/5 rounded-[2rem] p-6 border border-border/50">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-accent" /> Date
                    </span>
                    <span className="text-muted-foreground font-medium">
                      15 Ottobre 2026
                    </span>
                  </div>
                  <Button
                    variant="link"
                    className="font-bold text-accent p-0 h-auto underline-offset-4"
                  >
                    Modifica
                  </Button>
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" /> Orario
                    </span>
                    <span className="text-muted-foreground font-medium">
                      09:00 - 13:00 (4 ore)
                    </span>
                  </div>
                  <Button
                    variant="link"
                    className="font-bold text-accent p-0 h-auto underline-offset-4"
                  >
                    Modifica
                  </Button>
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" /> Ospiti
                    </span>
                    <span className="text-muted-foreground font-medium">
                      4 partecipanti
                    </span>
                  </div>
                  <Button
                    variant="link"
                    className="font-bold text-accent p-0 h-auto underline-offset-4"
                  >
                    Modifica
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>

            <Separator className="bg-border/50" />

            {/* SEZIONE 2: Metodo di pagamento */}
            <FieldSet>
              <div className="flex items-center justify-between mb-6">
                {/* Ora usiamo FieldLegend coerentemente */}
                <FieldLegend className="text-2xl font-bold tracking-tight mb-0">
                  Paga con
                </FieldLegend>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Crittografato
                  </span>
                </div>
              </div>

              <FieldGroup>
                <RadioGroup defaultValue="card" className="gap-4">
                  {/* Opzione: Carta di Credito */}
                  <div className="relative flex flex-col p-6 rounded-[2rem] border-2 border-border/50 bg-background data-[state=checked]:border-accent transition-all [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="border-accent text-accent"
                        />
                        <label
                          htmlFor="card"
                          className="font-bold text-base cursor-pointer flex items-center gap-2"
                        >
                          <CreditCard className="h-5 w-5 text-accent" /> Carta
                          di credito o debito
                        </label>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">
                          VISA
                        </div>
                        <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center text-[8px] font-bold text-white">
                          MC
                        </div>
                      </div>
                    </div>

                    {/* Form Carta */}
                    <div className="mt-6">
                      <FieldGroup className="space-y-4">
                        <Field>
                          <FieldLabel>Numero della carta</FieldLabel>
                          <div className="relative">
                            <Input
                              placeholder="0000 0000 0000 0000"
                              className="h-12 rounded-xl font-mono text-base border-border/50 bg-background pl-10 focus-visible:ring-accent/20"
                            />
                            <Lock className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                          </div>
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Scadenza</FieldLabel>
                            <Input
                              placeholder="MM/AA"
                              className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-accent/20"
                            />
                          </Field>
                          <Field>
                            <FieldLabel>CVC</FieldLabel>
                            <Input
                              placeholder="123"
                              type="password"
                              maxLength={3}
                              className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-accent/20"
                            />
                          </Field>
                        </div>
                      </FieldGroup>
                    </div>
                  </div>

                  {/* Opzione: PayPal */}
                  <div className="flex items-center justify-between p-6 rounded-[2rem] border-2 border-border/50 bg-background transition-all [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value="paypal"
                        id="paypal"
                        className="border-accent text-accent"
                      />
                      <label
                        htmlFor="paypal"
                        className="font-bold text-base cursor-pointer flex items-center gap-2"
                      >
                        <Wallet className="h-5 w-5 text-accent" /> PayPal
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </FieldGroup>
            </FieldSet>

            <Separator className="bg-border/50" />

            {/* SEZIONE 3: Regole e Conferma */}
            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  Regole dello spazio
                </h2>
                <p className="text-muted-foreground font-medium leading-relaxed mb-4">
                  Chiediamo a tutti gli ospiti di ricordare alcune semplici
                  regole per mantenere uno spazio di lavoro produttivo e
                  rispettoso per tutti.
                </p>
                <ul className="list-disc list-inside text-sm font-bold text-foreground space-y-2">
                  <li>Nessun party o evento non autorizzato.</li>
                  <li>
                    Mantenere il livello di rumore adeguato agli altri
                    professionisti.
                  </li>
                  <li>Lasciare la sala pulita come è stata trovata.</li>
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-sm font-medium">
                Cliccando su "Paga e prenota", accetti le nostre{" "}
                <span className="font-bold text-primary underline underline-offset-4 cursor-pointer">
                  Condizioni del Servizio
                </span>{" "}
                e la{" "}
                <span className="font-bold text-primary underline underline-offset-4 cursor-pointer">
                  Politica di Cancellazione
                </span>{" "}
                dell'Host.
              </div>

              <Button
                size="lg"
                className="w-full h-16 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                <Lock className="mr-2 h-5 w-5" /> Paga €180,00 e prenota
              </Button>
            </section>
          </div>

          {/* =========================================
              COLONNA DESTRA: RIEPILOGO STICKY
              ========================================= */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-2xl shadow-border/10 overflow-hidden">
              {/* Miniatura Spazio */}
              <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border/50">
                <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0 border border-border/50">
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                    alt="Hub Innovazione"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Sala Meeting
                  </span>
                  <h3 className="text-lg font-bold leading-tight mb-2">
                    Hub Innovazione Milano
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                    <span>4.92</span>
                    <span className="text-muted-foreground font-medium">
                      (128)
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Prezzo */}
              <h4 className="text-xl font-bold tracking-tight mb-6">
                Dettagli del prezzo
              </h4>
              <div className="space-y-4 mb-6 text-base">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">€45 x 4 ore</span>
                  <span className="font-bold text-foreground">€180,00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground underline underline-offset-4 cursor-help">
                    Costi di servizio CoW
                  </span>
                  <span className="font-bold text-foreground">€0,00</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-dashed border-border/50 mb-8">
                <span className="text-xl font-bold">Totale (EUR)</span>
                <span className="text-3xl font-extrabold text-accent">
                  €180,00
                </span>
              </div>

              {/* Box Cancellazione */}
              <div className="bg-secondary/5 rounded-2xl p-5 border border-border/50 flex gap-3">
                <CalendarIcon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-sm mb-1">
                    Cancellazione gratuita prima del 14 Ott.
                  </h5>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Rimborso completo in caso di cancellazione fino a 24 ore
                    prima del check-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
