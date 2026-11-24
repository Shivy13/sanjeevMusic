import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { youtubeVideos } from "@/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { extractYouTubeId, fetchYouTubeOEmbed } from "@/lib/youtube";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = db
      .select()
      .from(youtubeVideos)
      .orderBy(asc(youtubeVideos.sortOrder), desc(youtubeVideos.createdAt));

    if (category && category !== "all") {
      query = db
        .select()
        .from(youtubeVideos)
        .where(eq(youtubeVideos.category, category))
        .orderBy(asc(youtubeVideos.sortOrder), desc(youtubeVideos.createdAt)) as typeof query;
    }

    const videos = await query;
    return NextResponse.json({ success: true, videos });
  } catch (err) {
    console.error("GET /api/youtube error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch YouTube videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      url,
      youtubeId: rawId,
      title: inputTitle,
      titleHi,
      description,
      category,
      duration,
      viewsCount,
      featured,
      sortOrder,
    } = body;

    const youtubeId = extractYouTubeId(url || rawId);
    if (!youtubeId) {
      return NextResponse.json(
        { success: false, error: "Valid YouTube URL or Video ID is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    // Check if already exists
    const [existing] = await db
      .select()
      .from(youtubeVideos)
      .where(eq(youtubeVideos.youtubeId, youtubeId));

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This video has already been added to the portfolio" },
        { status: 409 }
      );
    }

    let resolvedTitle = inputTitle;
    let thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    if (!resolvedTitle) {
      const meta = await fetchYouTubeOEmbed(youtubeId);
      resolvedTitle = meta.title;
      if (meta.thumbnailUrl) thumbnailUrl = meta.thumbnailUrl;
    }

    const [newVideo] = await db
      .insert(youtubeVideos)
      .values({
        youtubeId,
        title: resolvedTitle.trim(),
        titleHi: titleHi ? titleHi.trim() : resolvedTitle.trim(),
        description: description ? description.trim() : null,
        category: (category || "keertan").toLowerCase(),
        thumbnailUrl,
        duration: duration || "15:00",
        viewsCount: viewsCount || "10K+",
        publishedAt: new Date().toISOString().split("T")[0],
        featured: !!featured,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
      })
      .returning();

    return NextResponse.json({ success: true, video: newVideo });
  } catch (err) {
    console.error("POST /api/youtube error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to add YouTube video" },
      { status: 500 }
    );
  }
}
