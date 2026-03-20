import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/server";
import { UserService } from "@/services/user-service";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoW",
  description: "CoW - Coworking Space Management App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Inizializza Supabase
  const supabase = await createClient();

  // 2. Controlla se c'è un utente loggato nei cookie
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // 3. Se è loggato, recupera i suoi dati dal DB
  let currentUser = null;
  if (authUser) {
    currentUser = await UserService.getProfileWithBookings(authUser.id);
  }
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <Navbar user={currentUser} />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
