import React from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Star, Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { timeToMinutes } from "@/utils/time";
import type { SpaceDetailData } from "./SpaceDetailClient";

interface Props {
  space: SpaceDetailData;
  date: any;
  setDate: any;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  guests: number;
  setGuests: (val: number) => void;
  isFullDay: boolean;
  setIsFullDay: (val: boolean) => void;
  duration: number;
  currentBasePrice: number;
  priceLabel: string;
  originalPrice: number;
  totalPrice: number;
  isDailyDiscountApplied: boolean;
  calculatedHourlyTotal: number;
  isChecking: boolean;
  handleCheckAvailability: () => void;
  averageRating: string;
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor((i * 30) / 60)
    .toString()
    .padStart(2, "0");
  const m = ((i * 30) % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
});

export default function BookingWidget(props: Props) {
  const {
    space,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    guests,
    setGuests,
    isFullDay,
    setIsFullDay,
    duration,
    currentBasePrice,
    priceLabel,
    totalPrice,
    isDailyDiscountApplied,
    calculatedHourlyTotal,
    isChecking,
    handleCheckAvailability,
    averageRating,
  } = props;

  const startMins = timeToMinutes(startTime);
  const endOptions = timeOptions.filter((time) => {
    const timeMins = timeToMinutes(time);
    const diff = timeMins - startMins;
    return diff >= 60 && diff % 60 === 0;
  });

  return (
    <div className="sticky top-28 bg-background border border-border/50 rounded-[2.5rem] p-8 shadow-2xl shadow-border/10 overflow-hidden">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-3xl font-extrabold text-foreground">
            €{currentBasePrice.toFixed(2)}
          </span>
          <span className="text-muted-foreground font-bold ml-1">
            {" "}
            / {priceLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
          <Star className="h-4 w-4 text-primary fill-primary" />
          <span>{averageRating}</span>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <FieldGroup className="space-y-6">
          <FieldSet>
            <FieldGroup className="space-y-6">
              <Field>
                <FieldLabel>Quando ne hai bisogno?</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-14 justify-start text-left font-bold rounded-2xl border-border/50 px-5",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-accent" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "dd MMM", { locale: it })} -{" "}
                            {format(date.to, "dd MMM", { locale: it })}
                          </>
                        ) : (
                          format(date.from, "dd MMM", { locale: it })
                        )
                      ) : (
                        <span>Seleziona date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-3xl border shadow-2xl bg-background z-50"
                    align="end"
                  >
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      locale={it}
                      className="bg-background rounded-3xl"
                    />
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  Cancellazione gratuita fino a 24 ore prima.
                </FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center justify-between mb-3 px-1">
                  <FieldLabel className="mb-0">Fascia Oraria</FieldLabel>
                  <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                    <Checkbox
                      id="fullDay"
                      checked={isFullDay}
                      onCheckedChange={(checked) => setIsFullDay(!!checked)}
                      className="border-yellow-500 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-black"
                    />
                    <label
                      htmlFor="fullDay"
                      className="text-[10px] font-extrabold uppercase tracking-tight cursor-pointer select-none text-yellow-700"
                    >
                      Giornata Intera
                    </label>
                  </div>
                </div>

                <div
                  className={cn(
                    "grid grid-cols-2 gap-3 transition-all duration-300",
                    isFullDay && "opacity-30 pointer-events-none scale-95",
                  )}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 tracking-widest">
                      Dalle
                    </span>
                    <div className="relative">
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="w-full h-14 pl-4 pr-10 rounded-2xl border-border/50 bg-secondary/5 font-bold text-sm [&>svg]:hidden">
                          <SelectValue placeholder="Inizio" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
                          {timeOptions.map((ora) => (
                            <SelectItem
                              key={ora}
                              value={ora}
                              className="font-bold"
                            >
                              {ora}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-2 tracking-widest">
                      Alle
                    </span>
                    <div className="relative">
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="w-full h-14 pl-4 pr-10 rounded-2xl border-border/50 bg-secondary/5 font-bold text-sm [&>svg]:hidden">
                          <SelectValue placeholder="Fine" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
                          {endOptions.length > 0 ? (
                            endOptions.map((ora) => (
                              <SelectItem
                                key={ora}
                                value={ora}
                                className="font-bold"
                              >
                                {ora}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="23:59" disabled>
                              Fine giornata
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  </div>
                </div>
              </Field>

              <Field>
                <FieldLabel>Partecipanti</FieldLabel>
                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/50">
                  <span className="font-bold text-sm text-muted-foreground">
                    Ospiti previsti
                  </span>
                  <div className="flex items-center gap-5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="h-8 w-8 rounded-full border-border/50 shadow-sm"
                    >
                      -
                    </Button>
                    <span className="font-extrabold w-4 text-center">
                      {guests}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setGuests(Math.min(space.capacity, guests + 1))
                      }
                      className="h-8 w-8 rounded-full border-border/50 shadow-sm"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <FieldDescription>
                  Capienza massima per questa sala: {space.capacity} persone.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            onClick={handleCheckAvailability}
            disabled={isChecking}
            className="w-full h-15 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-7 mt-4"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifica in
                corso...
              </>
            ) : (
              "Verifica Disponibilità"
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-8 space-y-4 pt-8 border-t border-border/50">
        <div className="flex justify-between text-sm font-bold items-center">
          <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
            €{currentBasePrice.toFixed(2)} x{" "}
            {isFullDay
              ? "1 giorno"
              : space.hourlyPrice
                ? `${duration} ore`
                : "1 giorno"}
          </span>
          {isDailyDiscountApplied ? (
            <span className="text-muted-foreground line-through decoration-destructive/60">
              €{calculatedHourlyTotal.toFixed(2)}
            </span>
          ) : (
            <span className="text-foreground">€{totalPrice.toFixed(2)}</span>
          )}
        </div>

        {isDailyDiscountApplied && (
          <div className="flex justify-between text-sm font-bold items-center text-emerald-500">
            <span>Tariffa giornaliera applicata</span>
            <span>-€{(calculatedHourlyTotal - totalPrice).toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-extrabold pt-4 border-t border-dashed border-border/50">
          <span>Totale stimato</span>
          <span className="text-accent">€{totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
