import { prisma } from "@/lib/prisma";

export const HostService = {
  /**
   * Recupera tutti i dati aggregati necessari per la Dashboard dell'Host
   * (Spazi, Prenotazioni, Utenti collegati e Recensioni)
   */
  getDashboardData: async (hostId: string) => {
    try {
      return await prisma.space.findMany({
        where: { hostId },
        include: {
          bookings: {
            include: { user: true }, // Includiamo chi ha prenotato (il Guest)
            orderBy: { date: "asc" }, // Ordiniamo per data
          },
          reviews: true, // Includiamo le recensioni per la media
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("[DB Error] Errore recupero dashboard host:", error);
      return [];
    }
  },
};
