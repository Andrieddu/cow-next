"use client";
import { HeroSearchForm } from "@/components/home/HeroSearchForm";
import { QuickExplore } from "@/components/home/QuickExplore";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 md:py-20 text-center container max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.15]">
          Lavora dove vuoi, <br className="hidden md:block" />
          <span className="text-accent italic">quando vuoi.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[650px] mx-auto font-medium leading-relaxed">
          Scrivanie, uffici privati e sale meeting pronti all'uso. Prenota in
          pochi secondi e inizia a produrre.
        </p>

        {/* HERO SEARCH FORM */}
        <HeroSearchForm />

        {/* QUICK EXPLORE COMPONENT */}
        <QuickExplore />
      </section>

      {/* FEATURES SECTION (CARDS) */}
      <FeaturesSection />
    </main>
  );
}
