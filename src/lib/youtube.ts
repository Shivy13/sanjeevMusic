export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const str = urlOrId.trim();

  // If already 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // youtube.com/watch?v=ID
  const matchWatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (matchWatch) return matchWatch[1];

  // youtu.be/ID
  const matchShort = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (matchShort) return matchShort[1];

  // youtube.com/embed/ID
  const matchEmbed = str.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (matchEmbed) return matchEmbed[1];

  // youtube.com/shorts/ID
  const matchShorts = str.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (matchShorts) return matchShorts[1];

  return null;
}

export async function fetchYouTubeOEmbed(youtubeId: string) {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 DevotionalApp/1.0" },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || "Devotional Bhajan / Jagran Highlight",
        authorName: data.author_name,
        thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      };
    }
  } catch (err) {
    console.warn("oEmbed fetch failed:", err);
  }

  return {
    title: "Devotional Bhajan / Jagran Highlight",
    authorName: "Shree Jagran Mandali",
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}
