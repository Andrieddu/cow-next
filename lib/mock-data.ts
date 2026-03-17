// lib/mock-data.ts

// =========================================
// ENUMS (Speculari a Prisma)
// =========================================
export type UserRole = "USER" | "HOST" | "ADMIN";
export type SpaceType =
  | "FLEX_DESK"
  | "FIXED_DESK"
  | "PRIVATE_OFFICE"
  | "MEETING_ROOM"
  | "PODCAST_ROOM";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

// =========================================
// INTERFACES (Speculari ai modelli Prisma)
// =========================================

export interface User {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  stripeCustomerId: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Space {
  id: string;
  title: string;
  description: string;
  type: SpaceType;
  city: string;
  address: string;
  capacity: number;
  hourlyPrice: number | null;
  dailyPrice: number | null;
  imageUrls: string[];
  amenities: string[];
  hostId: string; // Relazione con User
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string; // Chi prenota
  spaceId: string; // Cosa prenota
  date: Date;
  startTime: string; // es. "09:00"
  endTime: string; // es. "18:00"
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  stripeMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentId: string | null;
  receiptUrl: string | null;
  userId: string;
  bookingId: string; // Relazione 1-a-1 con Booking
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number; // 1-5
  comment: string | null;
  userId: string; // Chi scrive
  spaceId: string; // Spazio recensito
  createdAt: Date;
}

// =========================================
// DATI MOCK (Tabelle del database simulate)
// =========================================

const ora = new Date();

export const mockUsers: User[] = [
  {
    id: "usr_host1",
    name: "Marco",
    surname: "Bianchi",
    email: "marco.host@example.com",
    image: "https://github.com/shadcn.png",
    phone: "+39 333 1234567",
    stripeCustomerId: "cus_host1",
    role: "HOST",
    createdAt: new Date("2023-01-15"),
    updatedAt: ora,
  },
  {
    id: "usr_guest1",
    name: "Giulia",
    surname: "Rossi",
    email: "giulia.guest@example.com",
    image: "https://i.pravatar.cc/150?u=giulia",
    phone: "+39 340 9876543",
    stripeCustomerId: "cus_guest1",
    role: "USER",
    createdAt: new Date("2024-02-10"),
    updatedAt: ora,
  },
];

export const mockSpaces: Space[] = [
  {
    id: "spc_1",
    title: "Open Space Navigli",
    description:
      "Postazione flessibile in un loft industriale ristrutturato sui Navigli. Luce naturale, caffè specialty illimitato e community vivace.",
    type: "FLEX_DESK",
    city: "Milano",
    address: "Via Tortona 21, Milano",
    capacity: 1,
    hourlyPrice: 4.5,
    dailyPrice: 25.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800&h=600",
    ],
    amenities: ["Wi-Fi 1Gbps", "Aria Condizionata", "Area Break", "Stampante"],
    hostId: "usr_host1", // Appartiene a Marco
    createdAt: new Date("2023-02-20"),
    updatedAt: ora,
  },
  {
    id: "spc_2",
    title: "Sala Meeting 'Duomo'",
    description:
      "Elegante sala riunioni per 8 persone con vista. Dotata di schermo 4K e lavagna interattiva per presentazioni impeccabili.",
    type: "MEETING_ROOM",
    city: "Milano",
    address: "Piazza del Duomo 1, Milano",
    capacity: 8,
    hourlyPrice: 35.0,
    dailyPrice: 200.0,
    imageUrls: [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800&h=600",
    ],
    amenities: [
      "Schermo 4K",
      "Lavagna Interattiva",
      "Acqua Inclusa",
      "Reception",
    ],
    hostId: "usr_host1", // Appartiene a Marco
    createdAt: new Date("2023-05-11"),
    updatedAt: ora,
  },
];

export const mockBookings: Booking[] = [
  {
    id: "bkg_1",
    userId: "usr_guest1", // Prenotato da Giulia
    spaceId: "spc_1", // Per l'Open Space Navigli
    date: new Date("2026-03-20"), // Data futura!
    startTime: "09:00",
    endTime: "18:00",
    totalPrice: 25.0, // Prezzo giornaliero
    status: "CONFIRMED",
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-03-10"),
  },
  {
    id: "bkg_2",
    userId: "usr_guest1", // Prenotato da Giulia
    spaceId: "spc_2", // Sala Meeting
    date: new Date("2026-03-25"),
    startTime: "14:00",
    endTime: "16:00",
    totalPrice: 70.0, // 2 ore x 35€
    status: "PENDING",
    createdAt: ora,
    updatedAt: ora,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    stripeMethodId: "pm_card_visa",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2028,
    isDefault: true,
    userId: "usr_guest1", // Carta di Giulia
    createdAt: new Date("2024-02-11"),
    updatedAt: new Date("2024-02-11"),
  },
];

export const mockPayments: Payment[] = [
  {
    id: "pay_1",
    amount: 25.0,
    currency: "EUR",
    status: "COMPLETED",
    stripePaymentId: "pi_123abc",
    receiptUrl: "https://pay.stripe.com/receipts/acct_123/receipt_abc",
    userId: "usr_guest1",
    bookingId: "bkg_1", // Legato alla prima prenotazione confermata
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-03-10"),
  },
];

export const mockReviews: Review[] = [
  {
    id: "rev_1",
    rating: 5,
    comment:
      "Spazio stupendo, internet velocissimo e host super disponibile. Tornerò sicuramente!",
    userId: "usr_guest1",
    spaceId: "spc_1",
    createdAt: new Date("2025-11-20"),
  },
];

// =========================================
// HELPER PER LA UI
// (Simulano le query "include" di Prisma)
// =========================================

// Esempio: Spazio con il numero di recensioni e la media (utile per le Card)
export const getSpacesWithAggregates = () => {
  return mockSpaces.map((space) => {
    const spaceReviews = mockReviews.filter((r) => r.spaceId === space.id);
    const rating =
      spaceReviews.length > 0
        ? spaceReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          spaceReviews.length
        : 0;

    return {
      ...space,
      rating: parseFloat(rating.toFixed(1)),
      reviewsCount: spaceReviews.length,
    };
  });
};

// Esempio: Prenotazione con i dettagli dello spazio (utile per la Dashboard/Profilo)
export const getBookingsWithSpace = (userId: string) => {
  return mockBookings
    .filter((b) => b.userId === userId)
    .map((booking) => ({
      ...booking,
      space: mockSpaces.find((s) => s.id === booking.spaceId),
    }));
};
