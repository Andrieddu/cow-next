import React from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  availabilityError: string | null;
  setAvailabilityError: (val: string | null) => void;
  handleConfirmBooking: () => void;
  isDesktop: boolean;
  spaceTitle: string;
  date: any;
  startTime: string;
  endTime: string;
  guests: number;
  isFullDay: boolean;
  totalPrice: number;
}

export default function BookingModals(props: Props) {
  const {
    isModalOpen,
    setIsModalOpen,
    availabilityError,
    setAvailabilityError,
    handleConfirmBooking,
    isDesktop,
    spaceTitle,
    date,
    startTime,
    endTime,
    guests,
    isFullDay,
    totalPrice,
  } = props;

  const BookingSummaryContent = (
    <div className="bg-secondary/10 rounded-2xl p-5 border border-border/50 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-foreground">Data</span>
        <span className="text-sm font-bold">
          {date?.from
            ? format(date.from, "dd MMM yyyy", { locale: it })
            : "Da definire"}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-foreground">Orario</span>
        <span className="text-sm font-bold">
          {isFullDay ? "Giornata Intera" : `${startTime} - ${endTime}`}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-foreground">Persone</span>
        <span className="text-sm font-bold">{guests}</span>
      </div>
      <Separator />
      <div className="flex justify-between items-center text-lg">
        <span className="font-extrabold">Totale</span>
        <span className="font-extrabold text-accent">
          €{totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* SUCCESSO */}
      {isDesktop ? (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 gap-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
                <CheckCircle className="h-6 w-6 text-primary" /> Spazio
                Disponibile!
              </DialogTitle>
              <DialogDescription className="text-base text-foreground font-medium mt-2">
                Ottime notizie, <span className="font-bold">{spaceTitle}</span>{" "}
                è libero per le date selezionate.
              </DialogDescription>
            </DialogHeader>
            {BookingSummaryContent}
            <DialogFooter className="flex-col sm:flex-col gap-3 sm:space-x-0">
              <Button
                onClick={handleConfirmBooking}
                className="w-full rounded-xl h-12 font-bold text-base"
              >
                Conferma e vai al pagamento
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-xl font-bold text-muted-foreground"
              >
                Annulla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerContent className="rounded-t-[2rem]">
            <div className="p-6 pb-8 gap-6 flex flex-col items-center text-center">
              <DrawerHeader className="px-0 flex flex-col items-center w-full">
                <DrawerTitle className="text-2xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 text-foreground">
                  <CheckCircle className="h-8 w-8 mb-2 sm:mb-0 text-primary" />{" "}
                  Spazio Disponibile!
                </DrawerTitle>
                <DrawerDescription className="text-base text-foreground font-medium mt-3 max-w-[280px]">
                  Ottime notizie,{" "}
                  <span className="font-bold">{spaceTitle}</span> è libero per
                  le date selezionate.
                </DrawerDescription>
              </DrawerHeader>
              <div className="w-full text-left">{BookingSummaryContent}</div>
              <DrawerFooter className="px-0 flex-col gap-3 w-full mt-2">
                <Button
                  onClick={handleConfirmBooking}
                  className="w-full rounded-xl h-12 font-bold text-base"
                >
                  Conferma e vai al pagamento
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl font-bold text-muted-foreground"
                >
                  Annulla
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* ERRORE */}
      {isDesktop ? (
        <Dialog
          open={!!availabilityError}
          onOpenChange={(open) => !open && setAvailabilityError(null)}
        >
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 gap-6 border-destructive/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-destructive">
                <AlertCircle className="h-6 w-6" /> Non disponibile
              </DialogTitle>
              <DialogDescription className="text-base text-foreground font-medium mt-2">
                {availabilityError}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/10 text-sm text-muted-foreground">
              Prova a modificare l'orario, ridurre i partecipanti o scegliere
              un'altra data.
            </div>
            <DialogFooter>
              <Button
                onClick={() => setAvailabilityError(null)}
                className="w-full rounded-xl h-12 font-bold"
              >
                Modifica ricerca
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={!!availabilityError}
          onOpenChange={(open) => !open && setAvailabilityError(null)}
        >
          <DrawerContent className="rounded-t-[2rem] border-destructive/20">
            <div className="p-6 pb-8 gap-6 flex flex-col items-center text-center">
              <DrawerHeader className="px-0 flex flex-col items-center w-full">
                <DrawerTitle className="text-2xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 text-destructive">
                  <AlertCircle className="h-8 w-8 mb-2 sm:mb-0" /> Non
                  disponibile
                </DrawerTitle>
                <DrawerDescription className="text-base text-foreground font-medium mt-3 max-w-[280px]">
                  {availabilityError}
                </DrawerDescription>
              </DrawerHeader>
              <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/10 text-sm text-muted-foreground w-full">
                Prova a modificare l'orario, ridurre i partecipanti o scegliere
                un'altra data.
              </div>
              <DrawerFooter className="px-0 w-full mt-2">
                <Button
                  onClick={() => setAvailabilityError(null)}
                  className="w-full rounded-xl h-12 font-bold"
                >
                  Modifica ricerca
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
