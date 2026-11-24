"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Image as ImageIcon, PlayCircle, Phone, Sparkles, Flame, ShieldCheck } from "lucide-react";

export default function Hero() {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with devotional image & sacred dark overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('/images/hero-devotional.jpg')`,
        }}
      />
      {/* Multi-layer gradient overlays for supreme readability & warm glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0704] via-[#0b0704]/80 to-[#120b06]/65" />
      <div className="absolute inset-0 bg-radial from-amber-600/10 via-transparent to-[#0b0704]/90" />

      {/* Decorative divine aura circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Sacred Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-amber-950/40 backdrop-blur-md">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
          <span>{t.heroBadge}</span>
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
        </div>

        {/* Hero Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          <span className="block text-amber-100">{t.heroTitlePrefix}</span>
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">
            {t.heroTitleHighlight}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-amber-100/80 mb-10 leading-relaxed font-normal">
          {t.heroDescription}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
          <a
            href="#booking"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-950/70 border border-amber-400/50 hover:scale-[1.02] transition-all"
          >
            <Calendar className="w-5 h-5 text-amber-200" />
            <span>{t.ctaBook}</span>
          </a>

          <a
            href="#gallery"
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#1d120a]/80 hover:bg-[#28180c] border border-amber-700/60 hover:border-amber-500 text-amber-200 hover:text-white font-semibold text-sm sm:text-base transition-all backdrop-blur-sm"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>{t.ctaExploreGallery}</span>
          </a>

          <a
            href="#youtube"
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-700/50 text-red-200 hover:text-white font-semibold text-sm sm:text-base transition-all backdrop-blur-sm"
          >
            <PlayCircle className="w-4 h-4 text-red-400" />
            <span>{t.ctaWatchLive}</span>
          </a>

          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 font-semibold text-sm sm:text-base transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>{t.ctaCallNow}</span>
          </a>
        </div>

        {/* Devotional Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-amber-800/40">
          <div className="bg-[#180e08]/60 backdrop-blur-md rounded-xl p-4 border border-amber-800/30">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">18+</div>
            <div className="text-xs sm:text-sm text-amber-200/80 mt-1 font-medium">{t.heroExperience}</div>
          </div>
          <div className="bg-[#180e08]/60 backdrop-blur-md rounded-xl p-4 border border-amber-800/30">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-serif">2,500+</div>
            <div className="text-xs sm:text-sm text-amber-200/80 mt-1 font-medium">{t.heroEventsCount}</div>
          </div>
          <div className="bg-[#180e08]/60 backdrop-blur-md rounded-xl p-4 border border-amber-800/30">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif">50,000+</div>
            <div className="text-xs sm:text-sm text-amber-200/80 mt-1 font-medium">{t.heroDevotees}</div>
          </div>
        </div>

        {/* Mandali assurance badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-amber-400/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {language === "hi"
              ? "अनुभवी गायकों, वाद्य कलाकारों, झांकी टीम एवं उच्चस्तरीय साउंड सिस्टम से सुसज्जित"
              : "Complete traditional orchestration with chorus singers, sound, lights & divine jhankis"}
          </span>
        </div>
      </div>
    </section>
  );
}
