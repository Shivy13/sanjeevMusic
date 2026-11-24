"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Play,
  RefreshCw,
  ExternalLink,
  X,
  Flame,
  CheckCircle,
} from "lucide-react";

interface YouTubeVideo {
  id: number;
  youtubeId: string;
  title: string;
  titleHi: string | null;
  description: string | null;
  category: string;
  thumbnailUrl: string;
  duration: string | null;
  viewsCount: string | null;
  publishedAt: string | null;
  featured: boolean;
}

export default function YouTubeSection() {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState("");
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/youtube");
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (e) {
      console.error("Failed to fetch videos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDynamicSync = async () => {
    setSyncing(true);
    setSyncFeedback("");
    try {
      const res = await fetch("/api/youtube/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback(data.message);
        await fetchVideos();
      }
    } catch {
      setSyncFeedback("Sync failed. Check channel ID in admin.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncFeedback(""), 5000);
    }
  };

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory === "all") return true;
    return v.category === selectedCategory;
  });

  return (
    <section id="youtube" className="py-24 bg-[#0a0603] relative border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-700/50 text-red-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>{t.ytBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.ytTitle}
          </h2>
          <p className="text-amber-200/70 text-base sm:text-lg">
            {t.ytSubtitle}
          </p>

          {/* Dynamic Sync Trigger Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDynamicSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/60 text-red-200 text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 text-red-400 ${syncing ? "animate-spin" : ""}`} />
              <span>
                {syncing
                  ? language === "hi"
                    ? "यूट्यूब से संकलन हो रहा है..."
                    : "Syncing from YouTube..."
                  : language === "hi"
                  ? "नवीनतम वीडियो संकलित करें (Sync YouTube)"
                  : "Sync Latest YouTube Videos"}
              </span>
            </button>

            <span className="text-xs text-amber-400/60">
              ({t.ytSyncNotice})
            </span>
          </div>

          {syncFeedback && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Filter Categories */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: language === "hi" ? "सभी भजन" : "All Bhajans" },
              { id: "sundarkand", label: language === "hi" ? "सुंदरकांड" : "Sundarkand" },
              { id: "jagran", label: language === "hi" ? "माता जागरण" : "Mata Jagran" },
              { id: "keertan", label: language === "hi" ? "श्याम संकीर्तन" : "Shyam Keertan" },
              { id: "chowki", label: language === "hi" ? "माता की चौकी" : "Mata Ki Chowki" },
              { id: "aarti", label: language === "hi" ? "महाआरती" : "Maha Aarti" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === c.id
                    ? "bg-red-700 text-white shadow-md shadow-red-950 border border-red-500"
                    : "bg-[#140c06] hover:bg-[#1f1208] text-amber-200/80 border border-amber-900/40"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-red-400 animate-pulse">
            {language === "hi" ? "यूट्यूब वीडियो लोड हो रहे हैं..." : "Loading YouTube videos..."}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center text-amber-300/60 bg-[#140c06] rounded-2xl border border-amber-900/40 max-w-md mx-auto">
            {language === "hi" ? "इस श्रेणी में कोई वीडियो उपलब्ध नहीं है।" : "No videos found in this category."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const displayTitle = language === "hi" ? video.titleHi || video.title : video.title;

              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group bg-[#140c06] rounded-2xl overflow-hidden border border-amber-900/40 hover:border-red-600/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/40 cursor-pointer flex flex-col"
                >
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={video.thumbnailUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    {/* Red YouTube Play button badge in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-950 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    {video.duration && (
                      <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono font-medium text-white">
                        {video.duration}
                      </div>
                    )}

                    {/* Category pill */}
                    <div className="absolute top-2.5 left-2.5 bg-red-950/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-red-200 border border-red-700/50 uppercase tracking-wider">
                      {video.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-amber-100 group-hover:text-red-300 transition-colors line-clamp-2 mb-2 leading-snug">
                        {displayTitle}
                      </h4>
                      {video.description && (
                        <p className="text-xs text-amber-200/60 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-2 border-t border-amber-900/30 flex items-center justify-between text-[11px] text-amber-400/80">
                      <span className="flex items-center gap-1 text-red-400 font-semibold">
                        <Flame className="w-3.5 h-3.5 fill-red-400" />
                        <span>{video.viewsCount || "10K+"} {language === "hi" ? "श्रवण" : "Views"}</span>
                      </span>

                      <span className="text-amber-300/60">
                        {video.publishedAt || "Recently Released"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EMBEDDED MODAL PLAYER */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#180e08] rounded-2xl border border-red-700/60 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-red-950/40 border-b border-red-900/40">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                    {t.ytPlayingNow}
                  </span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-black text-amber-200 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* YouTube IFrame Embed */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Footer info */}
              <div className="p-6 bg-[#180e08]">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 mb-2">
                  {language === "hi" ? activeVideo.titleHi || activeVideo.title : activeVideo.title}
                </h3>
                {activeVideo.description && (
                  <p className="text-sm text-amber-200/70 leading-relaxed mb-4">
                    {activeVideo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-900/40 text-xs">
                  <span className="text-amber-400">
                    Category: <strong className="text-amber-200 uppercase">{activeVideo.category}</strong>
                  </span>

                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold"
                  >
                    <span>{t.ytWatchOnYt}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
