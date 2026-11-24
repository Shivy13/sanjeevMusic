import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      return NextResponse.json({ success: false, error: "Invalid booking ID" }, { status: 400 });
    }

    const db = getDb();
    const body = await request.json();
    const {
      eventDate,
      timeSlot,
      status,
      adminNotes,
      clientName,
      phone,
      eventType,
      venueAddress,
      city,
      estimatedGuests,
      specialRequests,
      whatsappNotified,
    } = body;

    if (status !== undefined && !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking status" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (eventDate !== undefined) updateData.eventDate = eventDate;
    if (timeSlot !== undefined) updateData.timeSlot = timeSlot;
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (clientName !== undefined) updateData.clientName = clientName;
    if (phone !== undefined) updateData.phone = phone;
    if (eventType !== undefined) updateData.eventType = eventType;
    if (venueAddress !== undefined) updateData.venueAddress = venueAddress;
    if (city !== undefined) updateData.city = city;
    if (estimatedGuests !== undefined) updateData.estimatedGuests = estimatedGuests;
    if (specialRequests !== undefined) updateData.specialRequests = specialRequests;
    if (whatsappNotified !== undefined) updateData.whatsappNotified = whatsappNotified;

    const [updated] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, bookingId))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err) {
    console.error("PUT /api/bookings/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      return NextResponse.json({ success: false, error: "Invalid booking ID" }, { status: 400 });
    }

    const db = getDb();
    const [deleted] = await db
      .delete(bookings)
      .where(eq(bookings.id, bookingId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/bookings/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete booking" }, { status: 500 });
  }
}
