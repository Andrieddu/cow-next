import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpaceCard from "./SpaceCard";

interface Props {
  spaces: any[];
  sortOrder: string;
  setSortOrder: (val: string) => void;
  getBookingPrice: (space: any) => number;
  duration: number;
  detailQueryString: string;
  resetFilters: () => void;
}

export default function SearchResults({
  spaces,
  sortOrder,
  setSortOrder,
  getBookingPrice,
  duration,
  detailQueryString,
  resetFilters,
}: Props) {
  return (
    <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {spaces.length}{" "}
          {spaces.length === 1 ? "spazio trovato" : "spazi trovati"}
        </h1>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px] rounded-lg font-bold h-10">
            <SelectValue placeholder="Ordina" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="consigliati" className="font-medium">
              Consigliati
            </SelectItem>
            <SelectItem value="prezzo-basso" className="font-medium">
              Prezzo più basso
            </SelectItem>
            <SelectItem value="prezzo-alto" className="font-medium">
              Prezzo più alto
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {spaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              totalPrice={getBookingPrice(space)}
              duration={duration}
              detailQueryString={detailQueryString}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 rounded-[2rem] bg-background/50">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold tracking-tight">
            Nessuno spazio trovato
          </h3>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="mt-6 rounded-xl font-bold border-border/50"
          >
            Azzera filtri
          </Button>
        </div>
      )}
    </div>
  );
}
