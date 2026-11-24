"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Play, Image as ImageIcon, X, MapPin, Calendar, ExternalLink } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  titleHi: string;
  description: string | null;
  descriptionHi: string | null;
  category: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  eventDate: string | null;
  location: string | null;
  featured: boolean;
}

export default function GallerySection() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "all" ? "/api/gallery" : `/api/gallery?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (e) {
      console.error("Gallery fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: t.filterAll },
    { id: "jagran", label: t.filterJagran },
    { id: "sundarkand", label: t.filterSundarkand },
    { id: "keertan", label: t.filterKeertan },
    { id: "chowki", label: t.filterChowki },
    { id: "aarti", label: t.filterAarti },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedMediaType === "all") return true;
    return item.mediaType === selectedMediaType;
  });

  return (
    <section id="gallery" className="py-24 bg-[#0d0704] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.galleryBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.galleryTitle}
          </h2>
          <p className="text-amber-200/70 text-base sm:text-lg">
            {t.gallerySubtitle}
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-950/70 border border-amber-400/40"
                    : "bg-[#180e08] hover:bg-[#22140b] text-amber-200/80 border border-amber-900/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Media type toggle */}
          <div className="mt-4 inline-flex items-center gap-1 p-1 rounded-lg bg-[#140c06] border border-amber-900/40 text-xs">
            <button
              onClick={() => setSelectedMediaType("all")}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedMediaType === "all" ? "bg-amber-600 text-white font-semibold" : "text-amber-300/70"
              }`}
            >
              {language === "hi" ? "सभी माध्यम" : "All Media"}
            </button>
            <button
              onClick={() => setSelectedMediaType("image")}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedMediaType === "image" ? "bg-amber-600 text-white font-semibold" : "text-amber-300/70"
              }`}
            >
              {language === "hi" ? "तस्वीरें (Photos)" : "Photos"}
            </button>
            <button
              onClick={() => setSelectedMediaType("video")}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedMediaType === "video" ? "bg-amber-600 text-white font-semibold" : "text-amber-300/70"
              }`}
            >
              {language === "hi" ? "वीडियो (Videos)" : "Videos"}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-amber-400 animate-pulse">
            {language === "hi" ? "गैलरी लोड हो रही है..." : "Loading portfolio..."}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-amber-300/60 bg-[#140c06] rounded-2xl border border-amber-900/40 max-w-md mx-auto">
            {language === "hi" ? "इस श्रेणी में कोई तस्वीर उपलब्ध नहीं है।" : "No items found in this category."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const displayTitle = language === "hi" ? item.titleHi || item.title : item.title;
              const displayDesc = language === "hi" ? item.descriptionHi || item.description : item.description;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-[#140c06] rounded-2xl overflow-hidden border border-amber-900/40 hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/60 cursor-pointer flex flex-col"
                >
                  {/* Media Thumbnail Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-black">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140c06] via-transparent to-black/30 group-hover:via-[#140c06]/30 transition-all" />

                    {/* Media Type Icon Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm p-1.5 rounded-full text-amber-300 border border-amber-500/30">
                      {item.mediaType === "video" ? (
                        <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-3 left-3 bg-amber-950/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 border border-amber-700/50 uppercase tracking-wider">
                      {item.category}
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                        {displayTitle}
                      </h4>
                      {displayDesc && (
                        <p className="text-xs text-amber-200/60 line-clamp-2 leading-relaxed">
                          {displayDesc}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-900/30 flex items-center justify-between text-[11px] text-amber-400/80">
                      {item.location && (
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                      {item.eventDate && (
                        <span className="flex items-center gap-1 text-amber-300/60 shrink-0 ml-auto">
                          <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{item.eventDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#180e08] rounded-2xl border border-amber-700/60 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-amber-200 hover:text-white border border-amber-600/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media viewer */}
              <div className="relative max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                {selectedItem.mediaType === "video" && selectedItem.mediaUrl.includes("youtube.com") ? (
                  <iframe
                    src={selectedItem.mediaUrl.replace("watch?v=", "embed/")}
                    title={selectedItem.title}
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedItem.mediaType === "video" ? (
                  <video src={selectedItem.mediaUrl} controls autoPlay className="max-h-[65vh] w-auto max-w-full" />
                ) : (
                  <img
                    src={selectedItem.mediaUrl}
                    alt={selectedItem.title}
                    className="max-h-[65vh] w-auto max-w-full object-contain"
                  />
                )}
              </div>

              {/* Modal Details */}
              <div className="p-6 bg-[#180e08]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                    {language === "hi" ? selectedItem.titleHi || selectedItem.title : selectedItem.title}
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                    {selectedItem.category.toUpperCase()}
                  </span>
                </div>

                <p className="text-amber-200/80 text-sm leading-relaxed mb-4">
                  {language === "hi" ? selectedItem.descriptionHi || selectedItem.description : selectedItem.description}
                </p>

                <div className="flex flex-wrap items-center justify-between text-xs text-amber-400/80 pt-4 border-t border-amber-900/50">
                  <div className="flex items-center gap-4">
                    {selectedItem.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{selectedItem.location}</span>
                      </span>
                    )}
                    {selectedItem.eventDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{selectedItem.eventDate}</span>
                      </span>
                    )}
                  </div>

                  <a
                    href="#booking"
                    onClick={() => setSelectedItem(null)}
                    className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    <span>{t.bookNow}</span>
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
