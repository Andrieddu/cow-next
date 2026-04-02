import React from "react";
import Image from "next/image";

export default function SpaceGallery({ imageUrls }: { imageUrls: string[] }) {
  const defaultImage =
    "https://images.unsplash.com/photo-1497366216548-37526070297c";
  const safeImages = imageUrls?.length > 0 ? imageUrls : [defaultImage];
  const galleryImages = Array.from({ length: 5 }).map(
    (_, i) => safeImages[i % safeImages.length],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[350px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-sm border border-border/50">
      <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
        <Image
          unoptimized
          src={galleryImages[0]}
          alt="Main Space"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      {galleryImages.slice(1, 5).map((img, idx) => (
        <div
          key={idx}
          className="hidden md:block relative group cursor-pointer overflow-hidden bg-muted"
        >
          <Image
            unoptimized
            src={img}
            alt={`Space ${idx + 2}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {idx === 3 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-sm bg-background/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                Mostra tutte le foto
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
