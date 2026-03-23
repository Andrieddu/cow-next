"use client";

import React, {
  useActionState,
  useEffect,
  useRef,
  useState,
  useMemo,
  startTransition,
} from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
  UploadCloud,
  MapPin,
  Euro,
  Info,
  CheckCircle2,
  Users,
  Loader2,
  Clock,
  X,
} from "lucide-react";

import { createSpaceAction } from "@/actions/space-actions";

export default function HostCreateSpaceForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createSpaceAction,
    null,
  );

  // --- STATI PRO PER LE IMMAGINI ---
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGICA GESTIONE IMMAGINI (CLIENT) ---

  // Deriviamo gli URL direttamente dai file correnti (senza setState in useEffect)
  const previewUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  // Cleanup: Evitiamo memory leak quando il componente viene smontato
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      if (files.length + newFiles.length > 5) {
        toast.error("Puoi caricare al massimo 5 immagini per il tuo spazio.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
      // Resettiamo l'input per permettere di caricare lo stesso file due volte se rimosso
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- INTERCETTIAMO IL SUBMIT ---
  // Dato che gestiamo i file in uno stato custom, dobbiamo inserirli a mano nel FormData
  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Controlliamo i file prima ancora di inviare al server
    if (files.length !== 5) {
      toast.error("Devi caricare esattamente 5 immagini per poter pubblicare.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Aggiungiamo i file del nostro stato custom
    files.forEach((file) => {
      formData.append("images", file);
    });

    // Passiamo il FormData all'azione DENTRO una transition!
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state?.success) {
      toast.success("Spazio creato con successo!");
      router.push("/host/dashboard");
    } else if (state?.error) {
      toast.error("Errore", { description: state.error });
    }
  }, [state, router]);

  return (
    <form onSubmit={handleCustomSubmit} className="flex flex-col gap-8">
      {/* Banner Errore Globale */}
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
                placeholder="Es. Sala Meeting Luminosa in Centro"
                className="h-12 rounded-xl border-border/50 bg-secondary/5 focus-visible:ring-accent/20 font-medium"
                required
              />
              <FieldDescription>
                Scegli un titolo accattivante che evidenzi i punti di forza.
              </FieldDescription>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Tipo di spazio</FieldLabel>
                <Select name="type" required>
                  <SelectTrigger className="w-full h-12 px-3 rounded-xl border border-border/50 bg-secondary/5 font-medium text-sm focus:ring-2 focus:ring-accent/20 focus:outline-none shadow-none">
                    <SelectValue placeholder="Seleziona tipo..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border/50 rounded-xl shadow-2xl z-[100]">
                    <SelectGroup>
                      <SelectLabel className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-2">
                        Postazioni di Lavoro
                      </SelectLabel>
                      <SelectItem
                        value="DESK"
                        className="cursor-pointer font-medium py-2.5 px-2"
                      >
                        Scrivania Flessibile
                      </SelectItem>
                      <SelectItem
                        value="PRIVATE_OFFICE"
                        className="cursor-pointer font-medium py-2.5 px-2"
                      >
                        Ufficio Privato
                      </SelectItem>
                    </SelectGroup>
                    <SelectSeparator className="bg-border/50 my-1" />
                    <SelectGroup>
                      <SelectLabel className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-2">
                        Spazi Condivisi
                      </SelectLabel>
                      <SelectItem
                        value="MEETING_ROOM"
                        className="cursor-pointer font-medium py-2.5 px-2"
                      >
                        Sala Meeting
                      </SelectItem>
                      <SelectItem
                        value="EVENT_SPACE"
                        className="cursor-pointer font-medium py-2.5 px-2"
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
                    required
                    placeholder="Es. 4"
                    className="h-12 pl-10 rounded-xl border-border/50 bg-secondary/5 font-bold focus-visible:ring-accent/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
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
                required
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
                name="address"
                required
                placeholder="Via Roma 10, Piano 2"
                className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
              />
            </Field>

            <div className="grid grid-cols-1 gap-6">
              <Field>
                <FieldLabel>Città</FieldLabel>
                <Input
                  name="city"
                  required
                  placeholder="Milano"
                  className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
                />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>

      {/* SEZIONE 3: Disponibilità e Orari */}
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
                  defaultValue="09:00"
                  required
                  className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
                />
              </Field>
              <Field>
                <FieldLabel>Orario di Chiusura</FieldLabel>
                <Input
                  type="time"
                  name="closingTime"
                  defaultValue="18:00"
                  required
                  className="h-12 rounded-xl border-border/50 bg-secondary/5 font-medium focus-visible:ring-accent/20"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Giorni di Apertura</FieldLabel>
              <FieldDescription className="mb-4">
                Seleziona i giorni in cui il tuo spazio è prenotabile.
              </FieldDescription>
              <div className="flex flex-wrap gap-3">
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-secondary/5 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    <Checkbox
                      name="openDays"
                      value={day.value.toString()}
                      defaultChecked={day.value !== 0 && day.value !== 6}
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
                    min="1"
                    required
                    placeholder="0.00"
                    className="h-14 pl-12 text-lg font-bold rounded-2xl border-border/50 bg-secondary/5 focus-visible:ring-accent/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Euro className="absolute left-4 top-4.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <span className="absolute right-4 top-4 font-bold text-muted-foreground pointer-events-none">
                    / ora
                  </span>
                </div>
              </Field>

              <Field>
                <FieldLabel>Prezzo giornaliero</FieldLabel>
                <div className="relative">
                  <Input
                    name="dailyPrice"
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    placeholder="0.00"
                    className="h-14 pl-12 text-lg font-bold rounded-2xl border-border/50 bg-secondary/5 focus-visible:ring-accent/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Euro className="absolute left-4 top-4.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <span className="absolute right-4 top-4 font-bold text-muted-foreground pointer-events-none">
                    / giorno
                  </span>
                </div>
              </Field>
            </div>
            <FieldDescription>
              I prezzi includono la commissione di servizio del 10% di CoW.
            </FieldDescription>

            <FieldSeparator />

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
                  <div key={servizio} className="flex items-center gap-3 group">
                    <Checkbox
                      id={servizio}
                      name="amenities"
                      value={servizio}
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

            <FieldSeparator />

            <Field>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-accent/20 bg-accent/5">
                <div className="flex flex-col gap-1">
                  <FieldLabel className="text-base font-bold text-foreground">
                    Prenotazione Immediata (Instant Booking)
                  </FieldLabel>
                  <FieldDescription className="m-0 max-w-sm">
                    Se attivo, gli utenti potranno prenotare istantaneamente
                    senza attendere la tua conferma manuale.
                  </FieldDescription>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    name="instantBooking"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>

      {/* SEZIONE 5: Foto PRO (Incrementale + X) */}
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
            {/* L'input nativo ora ci serve solo come "ponte" per aprire la finestra file */}
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Zona di upload visibile (disabilitata se siamo arrivati a 5 foto) */}
            <div
              onClick={() => files.length < 5 && fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed border-accent/40 bg-accent/5 transition-colors rounded-[2rem] p-12 flex flex-col items-center justify-center text-center group",
                files.length < 5
                  ? "hover:bg-accent/10 cursor-pointer"
                  : "opacity-50 cursor-not-allowed",
              )}
            >
              <UploadCloud className="h-10 w-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-base text-foreground font-bold mb-1">
                {files.length < 5
                  ? "Clicca per aggiungere foto"
                  : "Hai raggiunto il limite di 5 foto"}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Carica {5 - files.length} foto rimanenti. Supporta JPG, PNG e
                WEBP. Max 2MB/foto.
              </p>
            </div>

            {/* Griglia Preview con Pulsante 'X' */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-sm group/thumb"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover"
                    />

                    {/* IL PULSANTE 'X' PER RIMUOVERE L'IMMAGINE */}
                    <button
                      type="button" // IMPORTANTE: tipo 'button' per non far partire il form!
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive/80 text-white transition-opacity hover:bg-destructive shadow-lg"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FieldGroup>
        </FieldSet>
      </div>

      {/* AZIONI FINALI (Fixate per il Mobile!) */}
      <div className="flex flex-col sm:flex-row items-center justify-end mt-4 w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Un bottone hidden per salvare lo stato Publish/Draft */}
          <input
            type="hidden"
            name="actionType"
            value="publish"
            id="actionTypeInput"
          />

          <Button
            type="submit"
            variant="ghost"
            disabled={isPending}
            onClick={() => {
              (
                document.getElementById("actionTypeInput") as HTMLInputElement
              ).value = "draft";
            }}
            className="h-14 px-8 rounded-2xl font-bold w-full sm:w-auto order-last sm:order-none"
          >
            Salva come bozza
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            onClick={() => {
              (
                document.getElementById("actionTypeInput") as HTMLInputElement
              ).value = "publish";
            }}
            className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all w-full sm:w-auto gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Salvataggio...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" /> Pubblica lo spazio
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
