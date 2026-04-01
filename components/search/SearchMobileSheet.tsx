import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SearchSidebar from "./SearchSidebar";

type SidebarProps = React.ComponentProps<typeof SearchSidebar>;

interface SearchMobileSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sidebarProps: Omit<SidebarProps, "className">;
}

export default function SearchMobileSheet({
  isOpen,
  setIsOpen,
  sidebarProps,
}: SearchMobileSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] h-full flex flex-col rounded-t-3xl bg-background p-0"
      >
        <SheetHeader className="px-6 py-5 border-b border-border/50 shrink-0 bg-background rounded-t-3xl z-10">
          <SheetTitle className="text-2xl font-bold text-left">
            Filtra Risultati
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <SearchSidebar {...sidebarProps} className="pb-20" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
