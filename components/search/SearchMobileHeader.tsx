import React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface Props {
  queryLocation: string;
  startDateStr: string | null;
  startTime: string;
  endTime: string;
  onOpenFilters: () => void;
}

export default function SearchMobileHeader({
  queryLocation,
  startDateStr,
  startTime,
  endTime,
  onOpenFilters,
}: Props) {
  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return "Oggi";
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, "dd MMM", { locale: it }) : "Oggi";
  };

  return (
    <div className="lg:hidden sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm py-4">
      <div className="container px-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex flex-1 items-center justify-between gap-3 bg-background border border-border/60 shadow-sm rounded-full pl-5 pr-2 py-2"
        >
          <div className="flex flex-col overflow-hidden leading-tight">
            <span className="text-sm font-bold text-foreground truncate capitalize">
              {queryLocation || "Ovunque"}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              {formatDateDisplay(startDateStr)} • {startTime}-{endTime}
            </span>
          </div>
          <div className="bg-primary rounded-full p-2 shrink-0 ml-2">
            <Search className="h-4 w-4 text-primary-foreground stroke-[3]" />
          </div>
        </Link>
        <Button
          variant="outline"
          className="rounded-xl h-12 px-4 border-border/50"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
