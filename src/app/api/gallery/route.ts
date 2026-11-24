import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const mediaType = searchParams.get("mediaType");

    let query = db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt));

    if (category && category !== "all") {
      query = db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.category, category))
        .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt)) as typeof query;
    }

    const items = await query;
    let filtered = items;
    if (mediaType && mediaType !== "all") {
      filtered = filtered.filter((i) => i.mediaType === mediaType);
    }

    return NextResponse.json({ success: true, items: filtered });
  } catch (err) {
    console.error("GET /api/gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

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

    if (!title || !mediaUrl || !category) {
      return NextResponse.json(
        { success: false, error: "Title, media URL, and category are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const [newItem] = await db
      .insert(galleryItems)
      .values({
        title: title.trim(),
        titleHi: (titleHi || title).trim(),
        description: description ? description.trim() : null,
        descriptionHi: descriptionHi ? descriptionHi.trim() : null,
        category: category.toLowerCase(),
        mediaType: mediaType || "image",
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : mediaUrl.trim(),
        eventDate: eventDate || null,
        location: location ? location.trim() : null,
        featured: !!featured,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
      })
      .returning();

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    console.error("POST /api/gallery error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to add gallery item" },
      { status: 500 }
    );
  }
}
