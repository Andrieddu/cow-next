"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { timeToMinutes } from "@/utils/time";
import { Prisma } from "@/generated/prisma/client";

import SearchMobileSheet from "./SearchMobileSheet";
import SearchMobileHeader from "./SearchMobileHeader";
import SearchSidebar from "./SearchSidebar";
import SearchResults from "./SearchResults";

export type SpaceData = Prisma.SpaceGetPayload<{
  include: { reviews: true };
}>;

export default function SearchClient({
  initialSpaces,
}: {
  initialSpaces: SpaceData[];
}) {
  const searchParams = useSearchParams();
  const queryLocation = searchParams.get("q")?.toLowerCase() || "";
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");
  const startTime = searchParams.get("start") || "09:00";
  const endTime = searchParams.get("end") || "18:00";

  const [isOpen, setIsOpen] = useState(false);

  const duration = useMemo(() => {
    const startMins = timeToMinutes(startTime);
    const endMins = timeToMinutes(endTime);
    return Math.max(0.5, (endMins - startMins) / 60);
  }, [startTime, endTime]);

  const getBookingPrice = useCallback(
    (space: SpaceData) => {
      // If there's no hourly price, use the daily price
      if (!space.hourlyPrice) return space.dailyPrice || 0;
      // Calculate hourly cost, but if it exceeds the dailyPrice, apply the dailyPrice
      const calculatedHourlyTotal = space.hourlyPrice * duration;
      if (space.dailyPrice && calculatedHourlyTotal > space.dailyPrice) {
        return space.dailyPrice;
      }
      return calculatedHourlyTotal;
    },
    [duration],
  );

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [maxHourly, setMaxHourly] = useState<number>(100);
  const [maxTotal, setMaxTotal] = useState<number>(500);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("consigliati");

  const filteredSpaces = useMemo(() => {
    const result = initialSpaces.filter((space) => {
      if (
        queryLocation &&
        !space.city.toLowerCase().includes(queryLocation) &&
        !space.address.toLowerCase().includes(queryLocation) &&
        !space.title.toLowerCase().includes(queryLocation)
      )
        return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(space.type))
        return false;
      if (space.hourlyPrice && space.hourlyPrice > maxHourly) return false;
      if (getBookingPrice(space) > maxTotal) return false;
      if (selectedAmenities.length > 0) {
        if (!selectedAmenities.every((a) => space.amenities?.includes(a)))
          return false;
      }
      return true;
    });

    result.sort((a, b) => {
      const ratingA =
        a.reviews?.length > 0
          ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length
          : 0;
      const ratingB =
        b.reviews?.length > 0
          ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length
          : 0;
      if (sortOrder === "prezzo-basso")
        return getBookingPrice(a) - getBookingPrice(b);
      if (sortOrder === "prezzo-alto")
        return getBookingPrice(b) - getBookingPrice(a);
      return ratingB - ratingA;
    });

    return result;
  }, [
    initialSpaces,
    queryLocation,
    selectedTypes,
    maxHourly,
    maxTotal,
    selectedAmenities,
    sortOrder,
    getBookingPrice,
  ]);

  const resetFilters = () => {
    setSelectedTypes([]);
    setMaxHourly(100);
    setMaxTotal(500);
    setSelectedAmenities([]);
    setSortOrder("consigliati");
  };

  const sidebarProps = {
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
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <SearchMobileHeader
        queryLocation={queryLocation}
        startDateStr={startDateStr}
        startTime={startTime}
        endTime={endTime}
        onOpenFilters={() => setIsOpen(true)}
      />

      {/* MOBILE SHEET SIDEBAR */}
      <SearchMobileSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        sidebarProps={sidebarProps}
      />

      {/* DESKTOP LAYOUT */}
      <div className="container max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* DESKTOP SIDEBAR */}
          <SearchSidebar
            {...sidebarProps}
            className="hidden lg:flex sticky top-28 h-[calc(100vh-140px)] pr-4 pb-10" // Qui rimettiamo le classi desktop
          />
          <SearchResults
            spaces={filteredSpaces}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            getBookingPrice={getBookingPrice}
            duration={duration}
            detailQueryString={searchParams.toString()}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </>
  );
}
