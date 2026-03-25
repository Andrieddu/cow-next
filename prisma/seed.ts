import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  SpaceType,
  BookingStatus,
  PaymentStatus,
  PayoutStatus,
} from "@/generated/prisma/client";

const connectionString = `${process.env.DIRECT_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Inizio il seeding completo del database...");

  // 1. Upsert dell'Host con Dati di Fatturazione
  const host = await prisma.user.upsert({
    where: { email: "mario.host@cownext.com" },
    update: {},
    create: {
      id: "seed-host-1",
      name: "Mario",
      surname: "Rossi",
      email: "mario.host@cownext.com",
      phone: "+39 333 1234567",
      role: UserRole.HOST,
      notifyBookings: true,
      billingInfo: {
        create: {
          legalName: "Rossi Coworking SRL",
          vatId: "IT12345678901",
          address: "Via Roma 10",
          city: "Milano",
          zipCode: "20121",
        },
      },
    },
  });

  // 2. Upsert del Guest con Metodo di Pagamento
  const guest = await prisma.user.upsert({
    where: { email: "luigi.guest@gmail.com" },
    update: {},
    create: {
      id: "seed-guest-1",
      name: "Luigi",
      surname: "Verdi",
      email: "luigi.guest@gmail.com",
      phone: "+39 347 9876543",
      role: UserRole.USER,
      paymentMethods: {
        create: {
          stripeMethodId: "pm_card_visa_seed",
          brand: "visa",
          last4: "4242",
          expMonth: 12,
          expYear: 2026,
          isDefault: true,
        },
      },
    },
  });

  // 3. Upsert dello Spazio
  const space = await prisma.space.upsert({
    where: { id: "seed-space-1" },
    update: {},
    create: {
      id: "seed-space-1",
      title: "Ufficio Panoramico Duomo",
      description:
        "Splendido ufficio privato con vista sul Duomo, perfetto per startup e professionisti.",
      type: SpaceType.PRIVATE_OFFICE,
      city: "Milano",
      address: "Piazza del Duomo 1",
      capacity: 4,
      hourlyPrice: 25.0,
      dailyPrice: 150.0,
      amenities: ["WiFi Veloce", "Aria Condizionata", "Macchina del Caffè"],
      imageUrls: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80",
      ],
      hostId: host.id,
      instantBooking: true,
    },
  });

  // 4. Upsert della Prenotazione
  const booking = await prisma.booking.upsert({
    where: { id: "seed-booking-1" },
    update: {},
    create: {
      id: "seed-booking-1",
      userId: guest.id,
      spaceId: space.id,
      date: new Date("2026-04-15"),
      startTime: "09:00",
      endTime: "18:00",
      isFullDay: true,
      totalPrice: 150.0,
      status: BookingStatus.COMPLETED,
    },
  });

  // 5. Upsert del Payout (Il bonifico verso l'Host)
  const payout = await prisma.payout.upsert({
    where: { id: "seed-payout-1" },
    update: {},
    create: {
      id: "seed-payout-1",
      amount: 135.0, // 150€ - 10% fee
      status: PayoutStatus.PAID,
      arrivalDate: new Date("2026-04-16"),
      stripeTransferId: "tr_test_98765_seed",
      hostId: host.id,
    },
  });

  // 6. Upsert del Pagamento (Collegato sia alla Prenotazione che al Payout)
  const payment = await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: {},
    create: {
      amount: 150.0,
      platformFee: 15.0,
      hostPayout: 135.0,
      status: PaymentStatus.COMPLETED,
      stripePaymentId: "pi_test_12345_seed",
      invoiceNumber: "INV-2026-001",
      billingName: "Luigi Verdi",
      billingAddress: "Via dei Pini 4, Roma",
      userId: guest.id,
      bookingId: booking.id,
      payoutId: payout.id,
    },
  });

  // 7. Upsert della Conversazione con messaggi
  const conversation = await prisma.conversation.upsert({
    where: { bookingId: booking.id },
    update: {},
    create: {
      bookingId: booking.id,
      participants: {
        connect: [{ id: host.id }, { id: guest.id }],
      },
      messages: {
        create: [
          {
            text: "Ciao Mario, c'è un monitor sulla scrivania?",
            senderId: guest.id,
          },
          {
            text: "Ciao Luigi, certamente! Troverai un monitor 27'' pronto all'uso.",
            senderId: host.id,
          },
        ],
      },
    },
  });

  // 8. Upsert della Recensione
  const review = await prisma.review.upsert({
    where: { id: "seed-review-1" },
    update: {},
    create: {
      id: "seed-review-1",
      rating: 5,
      comment:
        "Spazio fantastico e host super disponibile. Vista mozzafiato, il monitor era perfetto!",
      userId: guest.id,
      spaceId: space.id,
      bookingId: booking.id,
    },
  });

  console.log(
    `✅ Seeding completato con successo! Tutti i modelli sono stati popolati.`,
  );
  console.log({
    host: host.email,
    guest: guest.email,
    space: space.title,
    booking: booking.id,
    paymentStatus: payment.status,
    conversationId: conversation.id,
    messagesCount: 2,
    reviewRating: review.rating,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
