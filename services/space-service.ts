import { prisma } from "@/lib/prisma";
import { SpaceType } from "@/generated/prisma/client";

export const SpaceService = {
  /**
   * Recupera un singolo spazio tramite ID, includendo l'Host e le recensioni
   */
  getSpaceById: async (spaceId: string) => {
    try {
      return await prisma.space.findUnique({
        where: { id: spaceId },
        include: {
          host: true,
          reviews: true,
        },
      });
    } catch (error) {
      console.error("[DB Error] Errore recupero spazio:", error);
      return null;
    }
  },

  /**
   * Recupera tutti gli spazi attivi per la pagina di ricerca
   */
  searchActiveSpaces: async (query?: string) => {
    try {
      // Se c'è una query testuale, cerchiamo nella città, indirizzo o titolo
      const whereClause = query
        ? {
            isActive: true,
            OR: [
              { city: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
              { title: { contains: query, mode: "insensitive" } },
            ],
          }
        : { isActive: true };

      return await prisma.space.findMany({
        where: whereClause as any,
        include: {
          reviews: true,
        },
      });
    } catch (error) {
      console.error("[DB Error] Errore ricerca spazi:", error);
      return [];
    }
  },

  /**
   * Crea un nuovo annuncio (Space) nel database
   */
  createSpace: async (data: {
    title: string;
    description: string;
    type: SpaceType;
    city: string;
    address: string;
    capacity: number;
    hourlyPrice: number;
    dailyPrice: number;
    imageUrls: string[];
    amenities: string[];
    hostId: string;
    openingTime?: string;
    closingTime?: string;
    openDays?: number[];
    isActive?: boolean;
    instantBooking?: boolean;
  }) => {
    try {
      return await prisma.space.create({
        data,
      });
    } catch (error) {
      console.error("[DB Error] Errore creazione spazio:", error);
      throw new Error("SPACE_CREATION_FAILED");
    }
  },
};
