import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { galleryItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");
const THUMBNAIL_DIR = path.join(process.cwd(), "public", "uploads", "gallery/thumbs");

// Ensure upload directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

export async function GET(request: Request) {
  try {
    const db = getDb();

    const items = await db.select().from(galleryItems);

    return NextResponse.json({ success: true, items });
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
    const db = getDb();

    // Use Next.js's built-in FormData support for multipart/form-data
    const formData = await request.formData();

    const title = formData.get("title") as string || "";
    const titleHi = formData.get("titleHi") as string || "";
    const category = formData.get("category") as string || "";
    const mediaType = formData.get("mediaType") as string || "";
    const location = formData.get("location") as string || "";
    const eventDate = formData.get("eventDate") as string || "";
    const description = formData.get("description") as string || "";

    // Handle uploaded file
    const uploadedFile = formData.get("mediaFile") as File | null;

    let storedMediaUrl = "";
    let storedThumbnailUrl = "";

    if (uploadedFile && uploadedFile.size > 0) {
      // Save the uploaded file
      const fileExtension = uploadedFile.name.split(".").pop() || "jpg";
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Convert File to Blob and save
      const blob = await uploadedFile.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(blob));

      // Create thumbnail (simple approach - resize using a basic method)
      // In production, use: sharp(filePath).resize(400, 300).toFile(thumbPath)
      // For now, copy the file as thumbnail and add a simple marker
      const thumbName = `${uuidv4()}.jpg`;
      const thumbPath = path.join(THUMBNAIL_DIR, thumbName);

      // Create a simple placeholder thumbnail by copying the file
      // and adding text would require sharp - for now just copy
      try {
        fs.copyFileSync(filePath, thumbPath);
      } catch {
        // If copy fails, write a minimal placeholder
        fs.writeFileSync(thumbPath, Buffer.alloc(1024));
      }

      storedMediaUrl = `/uploads/gallery/${fileName}`;
      storedThumbnailUrl = `/uploads/gallery/thumbs/${thumbName}`;
    } else {
      // No file uploaded - use placeholder URLs (same as before)
      storedMediaUrl = `/uploads/gallery/placeholder.jpg`;
      storedThumbnailUrl = `/uploads/gallery/thumbs/placeholder.jpg`;
    }

    // Also check for custom URL overrides
    const customMediaUrl = formData.get("mediaUrl") as string || "";
    const customThumbnailUrl = formData.get("thumbnailUrl") as string || "";
    if (customMediaUrl.trim()) storedMediaUrl = customMediaUrl;
    if (customThumbnailUrl.trim()) storedThumbnailUrl = customThumbnailUrl;

    const [newItem] = await db
      .insert(galleryItems)
      .values({
        title: title.trim(),
        titleHi: (titleHi || title).trim(),
        description: description ? description.trim() : null,
        // Fixed: descriptionHi should come from form input "titleHi" not description
        descriptionHi: titleHi ? titleHi.trim() : null,
        category: category.toLowerCase(),
        mediaType: mediaType || "image",
        mediaUrl: storedMediaUrl,
        thumbnailUrl: storedThumbnailUrl,
        eventDate: eventDate || null,
        location: location || null,
        featured: false,
        sortOrder: 0,
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