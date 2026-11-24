import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";
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
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ success: false, error: "Invalid gallery item ID" }, { status: 400 });
    }

    const db = getDb();
    const body = await request.json();
    const {
      title,
      titleHi,
      description,
      descriptionHi,
      category,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      eventDate,
      location,
      featured,
      sortOrder,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (titleHi !== undefined) updateData.titleHi = titleHi;
    if (description !== undefined) updateData.description = description;
    if (descriptionHi !== undefined) updateData.descriptionHi = descriptionHi;
    if (category !== undefined) updateData.category = category;
    if (mediaType !== undefined) updateData.mediaType = mediaType;
    if (mediaUrl !== undefined) updateData.mediaUrl = mediaUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (eventDate !== undefined) updateData.eventDate = eventDate;
    if (location !== undefined) updateData.location = location;
    if (featured !== undefined) updateData.featured = !!featured;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

    const [updated] = await db
      .update(galleryItems)
      .set(updateData)
      .where(eq(galleryItems.id, itemId))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error("PUT /api/gallery/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
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
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ success: false, error: "Invalid gallery item ID" }, { status: 400 });
    }

    const db = getDb();
    const [deleted] = await db
      .delete(galleryItems)
      .where(eq(galleryItems.id, itemId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/gallery/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
