"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useSyncExternalStore,
  useEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Prisma } from "@/generated/prisma/client";

import { checkAvailability } from "@/actions/booking-actions";
import { timeToMinutes, minutesToTime } from "@/utils/time";

import SpaceHeader from "./SpaceHeader";
import SpaceGallery from "./SpaceGallery";
import SpaceInfo from "./SpaceInfo";
import BookingWidget from "./BookingWidget";
import BookingModals from "./BookingModals";

export type SpaceDetailData = Prisma.SpaceGetPayload<{
  include: { reviews: true };
}>;

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => matchMedia.removeEventListener("change", callback);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export default function SpaceDetailClient({
  space,
  host,
}: {
  space: SpaceDetailData;
  host: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const urlStartDate = searchParams.get("startDate");
  const urlEndDate = searchParams.get("endDate");
  const urlStartHour = searchParams.get("start");
  const urlEndHour = searchParams.get("end");
  const urlGuests = searchParams.get("guests");

  const [date, setDate] = useState<DateRange | undefined>(() => {
    const from = urlStartDate ? parseISO(urlStartDate) : new Date();
    const to = urlEndDate ? parseISO(urlEndDate) : from;
    return {
      from: isValid(from) ? from : new Date(),
      to: isValid(to) ? to : isValid(from) ? from : new Date(),
    };
  });
  const [startTime, setStartTime] = useState(urlStartHour || "09:00");
  const [endTime, setEndTime] = useState(urlEndHour || "18:00");
  const [guests, setGuests] = useState(urlGuests ? parseInt(urlGuests, 10) : 1);
  const [isFullDay, setIsFullDay] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const handleStartTimeChange = useCallback(
    (newStart: string) => {
      setStartTime(newStart);
      const startMins = timeToMinutes(newStart);
      const endMins = timeToMinutes(endTime);
      const diff = endMins - startMins;

      if (diff < 60 || diff % 60 !== 0) {
        const nextValidEndMins = Math.min(startMins + 60, 23 * 60 + 30);
        setEndTime(minutesToTime(nextValidEndMins));
      }
    },
    [endTime],
  );

  const duration = useMemo(() => {
    const startMins = timeToMinutes(startTime);
    const endMins = timeToMinutes(endTime);
    return Math.max(0.5, (endMins - startMins) / 60);
  }, [startTime, endTime]);

  const isHourly = !!space.hourlyPrice;

  const calculatedHourlyTotal = isHourly
    ? space.hourlyPrice! * duration
    : space.dailyPrice || 0;

  useEffect(() => {
    if (
      isHourly &&
      space.dailyPrice !== null &&
      calculatedHourlyTotal > space.dailyPrice
    ) {
      setIsFullDay((prev) => {
        if (!prev) {
          toast.success("Sconto applicato!", {
            description:
              "Abbiamo applicato la tariffa giornaliera, è più conveniente!",
            icon: "💰",
          });
          return true;
        }
        return prev;
      });
    }
  }, [duration, calculatedHourlyTotal, isHourly, space.dailyPrice]);

  const totalPrice =
    isFullDay || !isHourly ? space.dailyPrice || 0 : calculatedHourlyTotal;

  const isDailyDiscountApplied = Boolean(
    isFullDay &&
    isHourly &&
    space.dailyPrice !== null &&
    calculatedHourlyTotal > space.dailyPrice,
  );

  const priceLabel = isFullDay || !isHourly ? "giorno" : "ora";
  const currentBasePrice =
    isFullDay || !isHourly ? space.dailyPrice || 0 : space.hourlyPrice || 0;

  const handleCheckAvailability = async () => {
    if (!date?.from) return toast.error("Seleziona una data per procedere.");
    setIsChecking(true);
    setAvailabilityError(null);
    try {
      const result = await checkAvailability(
        space.id,
        format(date.from, "yyyy-MM-dd"),
        startTime,
        endTime,
        guests,
      );
      if (result.available) setIsModalOpen(true);
      else setAvailabilityError(result.error || "Spazio non disponibile.");
    } catch (error) {
      console.error("Errore durante il controllo disponibilità:", error);
      toast.error("Errore di connessione");
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    const params = new URLSearchParams();
    params.set("spaceId", space.id);
    if (date?.from) params.set("startDate", format(date.from, "yyyy-MM-dd"));
    if (date?.to) params.set("endDate", format(date.to, "yyyy-MM-dd"));
    params.set("start", startTime);
    params.set("end", endTime);
    params.set("guests", guests.toString());
    params.set("totalPrice", totalPrice.toString());
    params.set("isFullDay", isFullDay ? "true" : "false");
    router.push(`/checkout?${params.toString()}`);
  };

  const averageRating =
    space.reviews?.length > 0
      ? (
          space.reviews.reduce((sum, r) => sum + r.rating, 0) /
          space.reviews.length
        ).toFixed(2)
      : "Nuovo";

  const widgetProps = {
    space,
    date,
    setDate,
    startTime,
    setStartTime: handleStartTimeChange,
    endTime,
    setEndTime,
    guests,
    setGuests,
    isFullDay,
    setIsFullDay,
    duration,
    currentBasePrice,
    priceLabel,
    originalPrice: calculatedHourlyTotal,
    totalPrice,
    isDailyDiscountApplied,
    calculatedHourlyTotal,
    isChecking,
    handleCheckAvailability,
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <SpaceHeader
        space={space}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        averageRating={averageRating}
      />

      <div className="container max-w-7xl mx-auto px-6">
        <SpaceGallery imageUrls={space.imageUrls} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <SpaceInfo space={space} host={host} />
          </div>

          <div className="lg:col-span-4 relative">
            <BookingWidget {...widgetProps} averageRating={averageRating} />
          </div>
        </div>
      </div>

      <BookingModals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        availabilityError={availabilityError}
        setAvailabilityError={setAvailabilityError}
        handleConfirmBooking={handleConfirmBooking}
        isDesktop={isDesktop}
        spaceTitle={space.title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        guests={guests}
        isFullDay={isFullDay}
        totalPrice={totalPrice}
      />
    </main>
  );
}
