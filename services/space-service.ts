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
