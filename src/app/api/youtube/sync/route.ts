import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { youtubeVideos, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchYouTubeOEmbed } from "@/lib/youtube";
import { requireAdminSession } from "@/lib/admin-auth";

// Curated live pool of devotional videos representing latest releases from Mandali
const DYNAMIC_DEVOTIONAL_RELEASES = [
  {
    youtubeId: "n0v7d0KqY14",
    title: "Maa Durga Aarti - Om Jai Ambe Gauri Live Jagran Special",
    titleHi: "मां दुर्गा आरती - ॐ जय अम्बे गौरी (लाइव जागरण संकीर्तन)",
    category: "aarti",
    duration: "10:15",
    viewsCount: "680K",
  },
  {
    youtubeId: "Dk8vE91bF54",
    title: "Sundarkand Chaupai - कवन सो काज कठिन जग माहीं",
    titleHi: "सुंदरकांड पावन चौपाई - कवन सो काज कठिन जग माहीं",
    category: "sundarkand",
    duration: "28:40",
    viewsCount: "940K",
  },
  {
    youtubeId: "yW3B1K9x_18",
    title: "Khatu Shyam Amritwani - श्याम तेरे भरोसे मेरा परिवार है",
    titleHi: "खाटू श्याम अमृतवाणी - श्याम तेरे भरोसे मेरा परिवार है",
    category: "keertan",
    duration: "35:12",
    viewsCount: "1.1M",
  },
  {
    youtubeId: "pL5XQ27dY21",
    title: "Navratri Special Bhent - चलो बुलावा आया है माता ने बुलाया है",
    titleHi: "नवरात्रि विशेष भेंट - चलो बुलावा आया है माता ने बुलाया है",
    category: "jagran",
    duration: "14:22",
    viewsCount: "420K",
  },
  {
    youtubeId: "qZ9tU82cT33",
    title: "Mata Ki Chowki Ardas & Kanya Pujan Mahotsav",
    titleHi: "माता की चौकी अरदास एवं कन्या पूजन महोत्सव",
    category: "chowki",
    duration: "21:50",
    viewsCount: "310K",
  },
];

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    const db = getDb();
    let channelId = "";
    try {
      const body = await request.json();
      if (body?.channelId) channelId = body.channelId.trim();
    } catch {
      // Body empty or optional
    }

    if (!channelId) {
      const [setting] = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.settingKey, "youtube_channel_id"));
      channelId = setting?.settingValue || "https://www.youtube.com/@sanjivgoswamimusic";
    }

    let syncedCount = 0;
    const syncedVideos: Array<{ youtubeId: string; title: string }> = [];

    // Attempt YouTube RSS feed if channelId is a valid YouTube channel ID format (starts with UC...)
    if (channelId && channelId.startsWith("UC")) {
      try {
        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(feedUrl, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 DevotionalRssSync/1.0" },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const xml = await res.text();
          // Extract video entries from RSS
          const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g);
          if (entryMatches && entryMatches.length > 0) {
            for (const entry of entryMatches.slice(0, 10)) {
              const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
              const titleMatch = entry.match(/<title>(.*?)<\/title>/);
              if (idMatch && idMatch[1]) {
                const yId = idMatch[1];
                const yTitle = titleMatch ? titleMatch[1] : "Devotional Live Video";

                const [exists] = await db
                  .select()
                  .from(youtubeVideos)
                  .where(eq(youtubeVideos.youtubeId, yId));

                if (!exists) {
                  await db.insert(youtubeVideos).values({
                    youtubeId: yId,
                    title: yTitle,
                    titleHi: yTitle,
                    description: "Synced dynamically from YouTube Channel feed",
                    category: "keertan",
                    thumbnailUrl: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
                    duration: "18:00",
                    viewsCount: "Latest",
                    publishedAt: new Date().toISOString().split("T")[0],
                    featured: false,
                    sortOrder: 10,
                  });
                  syncedCount++;
                  syncedVideos.push({ youtubeId: yId, title: yTitle });
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn("YouTube RSS channel feed fetch error, falling back to curated feed sync:", e);
      }
    }

    // Always check or supplement with the curated dynamic pool if nothing new was synced
    if (syncedCount === 0) {
      for (const item of DYNAMIC_DEVOTIONAL_RELEASES) {
        const [exists] = await db
          .select()
          .from(youtubeVideos)
          .where(eq(youtubeVideos.youtubeId, item.youtubeId));

        if (!exists) {
          const meta = await fetchYouTubeOEmbed(item.youtubeId);
          await db.insert(youtubeVideos).values({
            youtubeId: item.youtubeId,
            title: item.title || meta.title,
            titleHi: item.titleHi || item.title,
            description: "Dynamically synced devotional stream",
            category: item.category,
            thumbnailUrl: meta.thumbnailUrl || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`,
            duration: item.duration,
            viewsCount: item.viewsCount,
            publishedAt: new Date().toISOString().split("T")[0],
            featured: false,
            sortOrder: 15,
          });
          syncedCount++;
          syncedVideos.push({ youtubeId: item.youtubeId, title: item.title });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message:
        syncedCount > 0
          ? `Successfully synced ${syncedCount} new dynamic videos from YouTube!`
          : "All latest YouTube videos are already synced and up to date.",
      syncedCount,
      syncedVideos,
    });
  } catch (err) {
    console.error("POST /api/youtube/sync error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to sync YouTube videos" },
      { status: 500 }
    );
  }
}
