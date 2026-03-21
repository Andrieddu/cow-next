"use client";

import React, {
  useState,
  useTransition,
  useCallback,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Importa l'azione creata al passaggio precedente
import { deleteSpaceAction } from "@/actions/space-actions";

// Helper MediaQuery
function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => matchMedia.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function HostSpaceDropdown({ spaceId }: { spaceId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false); // Stato per la modale
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const confirmDelete = () => {
    setIsModalOpen(false); // Chiudiamo la modale
    startTransition(async () => {
      const result = await deleteSpaceAction(spaceId);
      if (result?.success) {
        toast.success("Spazio eliminato con successo.");
      } else {
        toast.error("Errore", {
          description: result?.error || "Si è verificato un errore.",
        });
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground shrink-0 hover:bg-secondary/20 rounded-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-destructive" />
            ) : (
              <MoreHorizontal className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xl border-border/50 shadow-xl w-48 p-2 z-[50] bg-white"
        >
          <Link href={`/space/${spaceId}`}>
            <DropdownMenuItem className="font-bold cursor-pointer gap-2 py-2.5">
              <Eye className="h-4 w-4 text-muted-foreground" /> Visualizza
              annuncio
            </DropdownMenuItem>
          </Link>

          <Link href={`/host/edit/${spaceId}`}>
            <DropdownMenuItem className="font-bold cursor-pointer gap-2 py-2.5">
              <Edit className="h-4 w-4 text-muted-foreground" /> Modifica spazio
            </DropdownMenuItem>
          </Link>

          <Separator className="my-1 opacity-50" />

          {/* Invece di chiamare handleDelete, apriamo la modale */}
          <DropdownMenuItem
            onSelect={() => setIsModalOpen(true)}
            className="font-bold cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2 py-2.5"
          >
            <Trash2 className="h-4 w-4" /> Elimina spazio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- MODALE CONFERMA ELIMINAZIONE --- */}
      {isDesktop ? (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 gap-6 border-destructive/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-destructive">
                <AlertCircle className="h-6 w-6" /> Elimina spazio
              </DialogTitle>
              <DialogDescription className="text-base text-foreground font-medium mt-2">
                Sei sicuro di voler eliminare questo spazio? Questa azione
                rimuoverà definitivamente l annuncio e non può essere annullata.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-3 sm:space-x-0 mt-4">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto rounded-xl font-bold text-muted-foreground"
              >
                Annulla
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="w-full sm:w-auto rounded-xl font-bold"
              >
                Sì, elimina
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerContent className="rounded-t-[2rem] border-destructive/20">
            <div className="p-6 pb-8 gap-6 flex flex-col items-center text-center">
              <DrawerHeader className="px-0 flex flex-col items-center w-full">
                <DrawerTitle className="text-2xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 text-destructive">
                  <AlertCircle className="h-8 w-8 mb-2 sm:mb-0" /> Elimina
                  spazio
                </DrawerTitle>
                <DrawerDescription className="text-base text-foreground font-medium mt-3 max-w-[280px]">
                  Sei sicuro di voler eliminare questo spazio? Questa azione
                  rimuoverà definitivamente l annuncio e non può essere
                  annullata.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="px-0 w-full mt-4 flex-col gap-3">
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="w-full rounded-xl h-12 font-bold text-base"
                >
                  Sì, elimina
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full rounded-xl h-12 font-bold text-muted-foreground"
                >
                  Annulla
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
