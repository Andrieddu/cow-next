"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  timeToMinutes,
  minutesToTime,
  generateTimeOptions,
} from "@/utils/time";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
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

const timeOptions = generateTimeOptions(30);

export function HeroSearchForm() {
  const router = useRouter();

  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("18:00");

  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);

    const startMins = timeToMinutes(newStart);
    const endMins = timeToMinutes(endTime);
    const diff = endMins - startMins;

    if (diff < 60 || diff % 60 !== 0) {
      const nextValidEndMins = Math.min(startMins + 60, 23 * 60 + 30);
      setEndTime(minutesToTime(nextValidEndMins));
    }
  };

  const startMins = timeToMinutes(startTime);

  const endOptions = timeOptions.filter((time) => {
    const timeMins = timeToMinutes(time);
    const diff = timeMins - startMins;

    return diff >= 60 && diff % 60 === 0;
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (date?.from) params.set("startDate", format(date.from, "yyyy-MM-dd"));
    if (date?.to) params.set("endDate", format(date.to, "yyyy-MM-dd"));
    params.set("start", startTime);
    params.set("end", endTime);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mt-14 mx-auto max-w-6xl w-full">
      <FieldGroup className="bg-background border border-border/60 shadow-2xl rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2">
        {/* FIELD: LOCATION */}
        <div className="w-full md:flex-[1.2] border-b md:border-b-0 md:border-r border-border/50">
          <Field className="px-5 py-2 border-none">
            <div className="flex items-center gap-3 text-left">
              <MapPin className="h-5 w-5 text-accent shrink-0" />
              <div className="flex flex-col items-start w-full">
                <FieldLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0">
                  Dove
                </FieldLabel>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Città o Coworking"
                  className="h-auto border-none bg-transparent p-0 focus-visible:ring-0 text-sm md:text-base w-full font-bold placeholder:text-muted-foreground/30 shadow-none"
                />
              </div>
            </div>
          </Field>
        </div>

        {/* FIELD: WHEN */}
        <div className="w-full md:flex-1 border-b md:border-b-0 md:border-r border-border/50">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full text-left outline-none">
                <Field className="px-5 py-2 border-none cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-accent shrink-0" />
                    <div className="flex flex-col items-start">
                      <FieldLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0">
                        Quando
                      </FieldLabel>
                      <span
                        className={cn(
                          "text-sm md:text-base font-bold truncate transition-colors",
                          !date?.from && "text-muted-foreground/30",
                        )}
                      >
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
                          "Seleziona date"
                        )}
                      </span>
                    </div>
                  </div>
                </Field>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-3xl border border-border/50 bg-background shadow-2xl z-[60]"
              align="center"
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
        </div>

        {/* FIELD: DYNAMIC TIME */}
        <div className="w-full md:flex-1">
          <Field className="px-5 py-2 border-none">
            <div className="flex items-center gap-3 text-left">
              <Clock className="h-5 w-5 text-accent shrink-0" />
              <div className="flex flex-col items-start w-full">
                <FieldLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0">
                  Orario
                </FieldLabel>
                <div className="flex items-center gap-1">
                  {/* SELECT START TIME */}
                  <Select
                    value={startTime}
                    onValueChange={handleStartTimeChange}
                  >
                    <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 font-bold text-sm md:text-base bg-transparent hover:text-accent transition-colors w-fit gap-1">
                      <SelectValue placeholder="Inizio" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-background border border-border/50 shadow-2xl rounded-xl max-h-60 overflow-y-auto">
                      {timeOptions.map((time) => (
                        <SelectItem
                          key={time}
                          value={time}
                          className="font-medium focus:text-accent cursor-pointer"
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-muted-foreground/30 mx-0.5">-</span>

                  {/* SELECT END TIME (Only filtered options) */}
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="h-auto p-0 border-none shadow-none focus:ring-0 font-bold text-sm md:text-base bg-transparent hover:text-accent transition-colors w-fit gap-1">
                      <SelectValue placeholder="Fine" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-background border border-border/50 shadow-2xl rounded-xl max-h-60 overflow-y-auto">
                      {endOptions.length > 0 ? (
                        endOptions.map((time) => (
                          <SelectItem
                            key={time}
                            value={time}
                            className="font-medium focus:text-accent cursor-pointer"
                          >
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="23:59" disabled>
                          Fine giornata
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Field>
        </div>
        <Button
          size="lg"
          onClick={handleSearch}
          className="w-[calc(100%-16px)] md:w-auto h-14 lg:px-10 rounded-2xl md:rounded-full font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all m-2 md:m-0"
        >
          <Search className="h-5 w-5 lg:mr-2 stroke-[3]" />
          <span className="md:hidden lg:inline">Cerca</span>
        </Button>
      </FieldGroup>
    </div>
  );
}
