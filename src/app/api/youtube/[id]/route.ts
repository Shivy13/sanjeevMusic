import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { youtubeVideos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { extractYouTubeId } from "@/lib/youtube";
import { requireAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const videoId = parseInt(id, 10);
    if (isNaN(videoId)) {
      return NextResponse.json({ success: false, error: "Invalid video ID" }, { status: 400 });
    }

    const db = getDb();
    const body = await request.json();
    const {
      youtubeId: rawId,
      title,
      titleHi,
      description,
      category,
      thumbnailUrl,
      duration,
      viewsCount,
      featured,
      sortOrder,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (rawId) {
      const parsedId = extractYouTubeId(rawId);
      if (parsedId) updateData.youtubeId = parsedId;
    }
    if (title !== undefined) updateData.title = title;
    if (titleHi !== undefined) updateData.titleHi = titleHi;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (duration !== undefined) updateData.duration = duration;
    if (viewsCount !== undefined) updateData.viewsCount = viewsCount;
    if (featured !== undefined) updateData.featured = !!featured;
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);

    const [updated] = await db
      .update(youtubeVideos)
      .set(updateData)
      .where(eq(youtubeVideos.id, videoId))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, video: updated });
  } catch (err) {
    console.error("PUT /api/youtube/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to update video" }, { status: 500 });
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
    const videoId = parseInt(id, 10);
    if (isNaN(videoId)) {
      return NextResponse.json({ success: false, error: "Invalid video ID" }, { status: 400 });
    }

    const db = getDb();
    const [deleted] = await db
      .delete(youtubeVideos)
      .where(eq(youtubeVideos.id, videoId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/youtube/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to delete video" }, { status: 500 });
  }
}
