import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isValid, parseISO } from "date-fns";
import { it } from "date-fns/locale";

const spaceTypesFilter = [
  { label: "Scrivania Singola", value: "DESK" },
  { label: "Ufficio Privato", value: "PRIVATE_OFFICE" },
  { label: "Sala Meeting", value: "MEETING_ROOM" },
  { label: "Spazio Eventi", value: "EVENT_SPACE" },
];

const amenitiesFilter = [
  "WiFi Fibra",
  "Aria Condizionata",
  "Caffè e Acqua",
  "Stampante/Scanner",
  "Monitor Esterno",
  "Parcheggio privato",
];

interface Props {
  className?: string;
  queryLocation: string;
  startDateStr: string | null;
  endDateStr: string | null;
  startTime: string;
  endTime: string;
  duration: number;
  maxHourly: number;
  setMaxHourly: (val: number) => void;
  maxTotal: number;
  setMaxTotal: (val: number) => void;
  selectedTypes: string[];
  setSelectedTypes: (val: React.SetStateAction<string[]>) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (val: React.SetStateAction<string[]>) => void;
  resetFilters: () => void;
}

export default function SearchSidebar(props: Props) {
  const {
    className,
    queryLocation,
    startDateStr,
    endDateStr,
    startTime,
    endTime,
    duration,
    maxHourly,
    setMaxHourly,
    maxTotal,
    setMaxTotal,
    selectedTypes,
    setSelectedTypes,
    selectedAmenities,
    setSelectedAmenities,
    resetFilters,
  } = props;

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return "Oggi";
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, "dd MMM", { locale: it }) : "Oggi";
  };

  const toggleArray = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    setter((prev: string[]) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <aside className={`flex flex-col gap-8 custom-scrollbar ${className}`}>
      <Link href="/">
        <div className="bg-background border border-border/50 shadow-sm rounded-[1.5rem] p-5 flex flex-col gap-3 group hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              La tua ricerca
            </span>
            <Clock className="h-4 w-4 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground capitalize">
              {queryLocation || "Ovunque"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {formatDateDisplay(startDateStr)}{" "}
              {endDateStr &&
                endDateStr !== startDateStr &&
                `- ${formatDateDisplay(endDateStr)}`}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {startTime} - {endTime} ({duration}h)
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-bold tracking-tight">Filtra per</h2>
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-accent hover:underline"
        >
          Azzera
        </button>
      </div>

      <div className="space-y-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
              Prezzo Orario Max
            </h3>
            <span className="text-sm font-bold text-accent">
              {maxHourly}€/h
            </span>
          </div>
          <Slider
            value={[maxHourly]}
            onValueChange={(val) => setMaxHourly(val[0])}
            max={100}
            min={1}
            step={1}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
              Prezzo Totale Max
            </h3>
            <span className="text-sm font-bold text-accent">{maxTotal}€</span>
          </div>
          <Slider
            value={[maxTotal]}
            onValueChange={(val) => setMaxTotal(val[0])}
            max={500}
            min={5}
            step={5}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Tipo di spazio
        </h3>
        <div className="flex flex-col gap-3">
          {spaceTypesFilter.map((tipo) => (
            <div key={tipo.value} className="flex items-center space-x-3">
              <Checkbox
                id={tipo.value}
                checked={selectedTypes.includes(tipo.value)}
                onCheckedChange={() =>
                  toggleArray(setSelectedTypes, tipo.value)
                }
              />
              <label
                htmlFor={tipo.value}
                className="text-sm font-medium cursor-pointer"
              >
                {tipo.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Servizi Inclusi
        </h3>
        <div className="flex flex-col gap-3">
          {amenitiesFilter.map((s) => (
            <div key={s} className="flex items-center space-x-3">
              <Checkbox
                id={s}
                checked={selectedAmenities.includes(s)}
                onCheckedChange={() => toggleArray(setSelectedAmenities, s)}
              />
              <label htmlFor={s} className="text-sm font-medium cursor-pointer">
                {s}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
