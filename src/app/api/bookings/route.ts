import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bookings, siteSettings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  generateDevoteeToOrganizerWhatsAppText,
  createWhatsAppUrl,
} from "@/lib/whatsapp";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view"); // "public" or "admin"

    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.eventDate), desc(bookings.createdAt));

    if (view === "public") {
      // Return only date & time & eventType & status for privacy
      const publicList = allBookings.map((b) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        eventType: b.eventType,
        eventDate: b.eventDate,
        timeSlot: b.timeSlot,
        city: b.city,
        status: b.status,
      }));
      return NextResponse.json({ success: true, bookings: publicList });
    }

    return NextResponse.json({ success: true, bookings: allBookings });
  } catch (err) {
    console.error("GET /api/bookings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      phone,
      email,
      eventType,
      eventDate,
      timeSlot,
      venueAddress,
      city,
      pincode,
      estimatedGuests,
      specialRequests,
    } = body;

    if (!clientName || !phone || !eventType || !eventDate || !timeSlot || !venueAddress || !city) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    // Generate unique reference
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const bookingRef = `BK-${year}-${randomSuffix}`;

    const [newBooking] = await db
      .insert(bookings)
      .values({
        bookingRef,
        clientName: clientName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        eventType,
        eventDate,
        timeSlot,
        venueAddress: venueAddress.trim(),
        city: city.trim(),
        pincode: pincode ? pincode.trim() : null,
        estimatedGuests: estimatedGuests ? String(estimatedGuests).trim() : null,
        specialRequests: specialRequests ? specialRequests.trim() : null,
        status: "pending",
        whatsappNotified: false,
      })
      .returning();

    // Fetch organizer WhatsApp phone from settings
    const [organizerPhoneSetting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingKey, "organizer_whatsapp"));

    const organizerPhone = organizerPhoneSetting?.settingValue || "+919876543210";

    const waText = generateDevoteeToOrganizerWhatsAppText({
      bookingRef: newBooking.bookingRef,
      clientName: newBooking.clientName,
      phone: newBooking.phone,
      eventType: newBooking.eventType,
      eventDate: newBooking.eventDate,
      timeSlot: newBooking.timeSlot,
      venueAddress: newBooking.venueAddress,
      city: newBooking.city,
      estimatedGuests: newBooking.estimatedGuests,
      specialRequests: newBooking.specialRequests,
    });

    const organizerWhatsAppUrl = createWhatsAppUrl(organizerPhone, waText);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      whatsappUrl: organizerWhatsAppUrl,
      whatsappMessage: waText,
    });
  } catch (err) {
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
