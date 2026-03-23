import { prisma } from "@/lib/prisma";

export const UserService = {
  /**
   * Recupera un utente dal DB.
   * Ritorna l'utente o null se non esiste.
   */
  getUserById: async (id: string) => {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`[DB Error] Impossibile recuperare l'utente ${id}:`, error);
      throw new Error("DATABASE_ERROR"); // Lanciamo l'errore in alto
    }
  },

  /**
   * Recupera il profilo completo di prenotazioni, spazi e host
   */
  getProfileWithBookings: async (id: string) => {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          bookings: {
            orderBy: { date: "asc" }, // Ordiniamo per data
            include: {
              space: {
                include: {
                  host: true, // Ci serve per mostrare la foto dell'host nel pannello laterale!
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Errore nel recupero profilo completo:", error);
      return null;
    }
  },

  /**
   * Aggiorna il profilo utente (dati anagrafici).
   */
  updateProfile: async (
    id: string,
    data: { name?: string; surname?: string; phone?: string; image?: string },
  ) => {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`[DB Error] Impossibile aggiornare l'utente ${id}:`, error);
      throw new Error("DATABASE_ERROR");
    }
  },

  /**
   * Aggiorna le preferenze di notifica dell'utente.
   */
  updateNotifications: async (
    id: string,
    data: {
      notifyBookings: boolean;
      notifyPromos: boolean;
      notifySms: boolean;
    },
  ) => {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(
        `[DB Error] Impossibile aggiornare le notifiche per ${id}:`,
        error,
      );
      throw new Error("DATABASE_ERROR");
    }
  },
};
