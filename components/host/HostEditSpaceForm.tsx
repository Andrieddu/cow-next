"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  MapPin,
  Euro,
  Info,
  CheckCircle2,
  Users,
  Loader2,
  Clock,
} from "lucide-react";

// Attenzione: Dovrai creare questa azione!
import { updateSpaceAction } from "@/actions/space-actions";

export default function EditSpaceForm({ space }: { space: any }) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updateSpaceAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/host/listing");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Campo nascosto essenziale: passiamo l'ID dello spazio all'azione! */}
      <input type="hidden" name="spaceId" value={space.id} />

      {state?.error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm font-bold text-destructive">
          Si è verificato un errore: {state.error}
        </div>
      )}

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
              <FieldLabel>Titolo dell annuncio</FieldLabel>
              <Input
                name="title"
                defaultValue={space.title}
                className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Tipo di spazio</FieldLabel>
                <Select name="type" defaultValue={space.type}>
                  <SelectTrigger className="w-full h-12 px-3 rounded-xl border border-border/50 bg-secondary/5 font-medium text-sm">
                    <SelectValue placeholder="Seleziona tipo..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border rounded-xl shadow-2xl z-[100]">
                    <SelectGroup>
                      <SelectLabel className="font-bold text-[10px] uppercase text-muted-foreground px-2 py-2">
                        Postazioni di Lavoro
                      </SelectLabel>
                      <SelectItem
                        value="DESK"
                        className="font-medium py-2.5 px-2"
                      >
                        Scrivania Flessibile
                      </SelectItem>
                      <SelectItem
                        value="PRIVATE_OFFICE"
                        className="font-medium py-2.5 px-2"
                      >
                        Ufficio Privato
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator className="bg-border/50 my-1" />
                    <SelectGroup>
                      <SelectLabel className="font-bold text-[10px] uppercase text-muted-foreground px-2 py-2">
                        Spazi Condivisi
                      </SelectLabel>
                      <SelectItem
                        value="MEETING_ROOM"
                        className="font-medium py-2.5 px-2"
                      >
                        Sala Meeting
                      </SelectItem>
                      <SelectItem
                        value="EVENT_SPACE"
                        className="font-medium py-2.5 px-2"
                      >
                        Spazio Eventi
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Capienza massima</FieldLabel>
                <div className="relative">
                  <Input
                    name="capacity"
                    type="number"
                    min="1"
                    defaultValue={space.capacity}
                    className="h-12 pl-10 rounded-xl border-border/50 bg-secondary/5 font-bold"
                  />
                  <Users className="absolute left-4 top-4 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel>Descrizione</FieldLabel>
              <Textarea
                name="description"
                rows={4}
                defaultValue={space.description}
                className="resize-none rounded-xl border-border/50 bg-secondary/5 p-4 font-medium text-sm"
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
                name="address"
                defaultValue={space.address}
                className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium"
              />
            </Field>
            <div className="grid grid-cols-1 gap-6">
              <Field>
                <FieldLabel>Città</FieldLabel>
                <Input
                  name="city"
                  defaultValue={space.city}
                  className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium"
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>

      {/* SEZIONE 3: Orari */}
      <div className="bg-background rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-border/50">
        <FieldSet>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-accent/10 rounded-xl">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <FieldLegend className="text-xl font-bold tracking-tight mb-0">
              Disponibilità e Orari
            </FieldLegend>
          </div>
          <FieldGroup className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Orario di Apertura</FieldLabel>
                <Input
                  type="time"
                  name="openingTime"
                  defaultValue={space.openingTime || "09:00"}
                  className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium"
                />
              </Field>
              <Field>
                <FieldLabel>Orario di Chiusura</FieldLabel>
                <Input
                  type="time"
                  name="closingTime"
                  defaultValue={space.closingTime || "18:00"}
                  className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Giorni di Apertura</FieldLabel>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  { label: "Lun", value: 1 },
                  { label: "Mar", value: 2 },
                  { label: "Mer", value: 3 },
                  { label: "Gio", value: 4 },
                  { label: "Ven", value: 5 },
                  { label: "Sab", value: 6 },
                  { label: "Dom", value: 0 },
                ].map((day) => (
                  <label
                    key={day.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-secondary/5 cursor-pointer hover:bg-secondary/10"
                  >
                    <Checkbox
                      name="openDays"
                      value={day.value.toString()}
                      defaultChecked={space.openDays?.includes(day.value)}
                      className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <span className="text-sm font-bold">{day.label}</span>
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>

      {/* SEZIONE 4: Tariffe e Servizi */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Prezzo orario</FieldLabel>
                <div className="relative">
                  <Input
                    name="hourlyPrice"
                    type="number"
                    step="0.5"
                    defaultValue={space.hourlyPrice}
                    className="h-14 pl-12 text-lg font-bold rounded-2xl border-border/50 bg-secondary/5"
                  />
                  <Euro className="absolute left-4 top-4.5 h-5 w-5 text-muted-foreground" />
                </div>
              </Field>
              <Field>
                <FieldLabel>Prezzo giornaliero</FieldLabel>
                <div className="relative">
                  <Input
                    name="dailyPrice"
                    type="number"
                    step="0.5"
                    defaultValue={space.dailyPrice}
                    className="h-14 pl-12 text-lg font-bold rounded-2xl border-border/50 bg-secondary/5"
                  />
                  <Euro className="absolute left-4 top-4.5 h-5 w-5 text-muted-foreground" />
                </div>
              </Field>
            </div>
            <FieldSeparator />
            <Field>
              <FieldLabel>Cosa offre il tuo spazio?</FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-2">
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
                  <div key={servizio} className="flex items-center gap-3 group">
                    <Checkbox
                      id={`edit-${servizio}`}
                      name="amenities"
                      value={servizio}
                      defaultChecked={space.amenities?.includes(servizio)}
                      className="border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <label
                      htmlFor={`edit-${servizio}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {servizio}
                    </label>
                  </div>
                ))}
              </div>
            </Field>
            <FieldSeparator />
            <Field>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-accent/20 bg-accent/5">
                <div className="flex flex-col gap-1">
                  <FieldLabel className="text-base font-bold text-foreground">
                    Prenotazione Immediata
                  </FieldLabel>
                  <FieldDescription className="m-0 max-w-sm">
                    Gli utenti prenoteranno senza attendere la tua conferma
                    manuale.
                  </FieldDescription>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    name="instantBooking"
                    defaultChecked={space.instantBooking}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>

      {/* AZIONI FINALI */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-6">
        <Link
          href="/host/listing"
          className="text-sm font-bold text-muted-foreground hover:text-accent transition-colors order-last sm:order-first"
        >
          Annulla modifiche
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Su mobile va sotto (order-last), su desktop torna al suo posto naturale (sm:order-none) */}
          <Button
            type="submit"
            name="actionType"
            value="draft"
            variant="ghost"
            disabled={isPending}
            className="h-14 px-8 rounded-2xl font-bold w-full sm:w-auto order-last sm:order-none"
          >
            Salva come bozza
          </Button>

          <Button
            type="submit"
            name="actionType"
            value="publish"
            disabled={isPending}
            className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all w-full sm:w-auto gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Salvataggio...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" /> Aggiorna spazio
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
