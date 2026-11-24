import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bookings, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  generateDevoteeToOrganizerWhatsAppText,
  generateOrganizerToDevoteeWhatsAppText,
  createWhatsAppUrl,
} from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { bookingId, target, customMessage } = body; // target = "organizer" | "client"

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, Number(bookingId)));

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Fetch organizer WhatsApp setting
    const [organizerPhoneSetting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, "organizer_whatsapp"));

    const organizerPhone = organizerPhoneSetting?.settingValue || "+919876543210";

    let messageText = "";
    let recipientPhone = "";

    if (target === "client") {
      recipientPhone = booking.phone;
      messageText =
        customMessage ||
        generateOrganizerToDevoteeWhatsAppText(
          {
            bookingRef: booking.bookingRef,
            clientName: booking.clientName,
            phone: booking.phone,
            eventType: booking.eventType,
            eventDate: booking.eventDate,
            timeSlot: booking.timeSlot,
            venueAddress: booking.venueAddress,
            city: booking.city,
            estimatedGuests: booking.estimatedGuests,
            specialRequests: booking.specialRequests,
          },
          booking.status,
          booking.adminNotes
        );
    } else {
      recipientPhone = organizerPhone;
      messageText =
        customMessage ||
        generateDevoteeToOrganizerWhatsAppText({
          bookingRef: booking.bookingRef,
          clientName: booking.clientName,
          phone: booking.phone,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          timeSlot: booking.timeSlot,
          venueAddress: booking.venueAddress,
          city: booking.city,
          estimatedGuests: booking.estimatedGuests,
          specialRequests: booking.specialRequests,
        });
    }

    const whatsappUrl = createWhatsAppUrl(recipientPhone, messageText);

    // Update whatsappNotified flag in DB
    await db
      .update(bookings)
      .set({ whatsappNotified: true, updatedAt: new Date() })
      .where(eq(bookings.id, booking.id));

    return NextResponse.json({
      success: true,
      whatsappUrl,
      recipientPhone,
      messageText,
      bookingRef: booking.bookingRef,
    });
  } catch (err) {
    console.error("POST /api/whatsapp/notify error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch WhatsApp notification" },
      { status: 500 }
    );
  }
}
