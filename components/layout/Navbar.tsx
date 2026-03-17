"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Info,
  Mail,
  Home,
  LogIn,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Lato Sinistro: Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Logo CoW"
              width={100}
              height={35}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Destra: Menu Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Chi Siamo
            </Link>
            <Link
              href="/contacts"
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Contatti
            </Link>
          </nav>

          <div className="flex items-center gap-4 border-l pl-6 ml-2 border-border/60">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-bold">
                Accedi
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 border cursor-pointer hover:ring-2 hover:ring-accent/20 transition-all outline-none">
                  <AvatarImage
                    src="https://avatars.githubusercontent.com/u/75944229?v=4"
                    alt="User"
                  />
                  <AvatarFallback className="bg-accent/10 text-accent font-bold">
                    AL
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 shadow-2xl bg-background border border-border/50 opacity-100 z-[100]"
              >
                <DropdownMenuLabel className="font-bold text-muted-foreground text-[10px] uppercase tracking-widest px-3 py-2">
                  Il mio Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Link Profilo */}
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer py-2.5">
                    <User className="mr-2 h-4 w-4" /> Profilo
                  </DropdownMenuItem>
                </Link>

                {/* Link Impostazioni */}
                <Link href="/profile/settings">
                  <DropdownMenuItem className="cursor-pointer py-2.5">
                    <Settings className="mr-2 h-4 w-4" /> Impostazioni
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-bold py-2.5">
                  <LogOut className="mr-2 h-4 w-4" /> Esci
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile: Menu Burger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] flex flex-col px-6 bg-background"
            >
              <SheetHeader className="border-b pb-6 text-left">
                <SheetTitle>
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={30}
                    className="object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 mt-8 flex-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 py-3 text-md font-bold px-2 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <Home className="h-5 w-5 opacity-70" /> Home
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 py-3 text-md font-bold px-2 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <Info className="h-5 w-5 opacity-70" /> Chi Siamo
                </Link>
                <Link
                  href="/contacts"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 py-3 text-md font-bold px-2 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <Mail className="h-5 w-5 opacity-70" /> Contatti
                </Link>
                <div className="h-px bg-border/50 my-2" />
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 py-3 text-md font-bold px-2 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <LogIn className="h-5 w-5 opacity-70" /> Accedi
                </Link>
              </div>

              {/* Sezione Account Mobile */}
              <div className="border-t pt-8 pb-6">
                <div className="flex items-center gap-3 mb-8 px-2">
                  <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/75944229?v=4" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold">Andrea Lai</span>
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest">
                      Membro Pro
                    </span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start gap-4 rounded-xl font-bold"
                    >
                      <User className="h-5 w-5 opacity-70" /> Profilo
                    </Button>
                  </Link>

                  <Link
                    href="/profile/settings"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start gap-4 rounded-xl font-bold"
                    >
                      <Settings className="h-5 w-5 opacity-70" /> Impostazioni
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="lg"
                    className="w-full justify-start gap-4 rounded-xl font-bold mt-2"
                  >
                    <LogOut className="h-5 w-5" /> Esci
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
