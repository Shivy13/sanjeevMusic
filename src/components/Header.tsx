"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Bell, Volume2, VolumeX, Menu, X, Calendar, Phone, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { language, toggleLanguage, t, isAudioPlaying, toggleAudioAmbiance } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t.navHome, href: "#home" },
    { label: t.navServices, href: "#services" },
    { label: t.navBooking, href: "#booking" },
    { label: t.navSchedule, href: "#schedule" },
    { label: t.navGallery, href: "#gallery" },
    { label: t.navVideos, href: "#youtube" },
    { label: t.navTestimonials, href: "#testimonials" },
    { label: t.navContact, href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#120b06]/95 backdrop-blur-md border-b border-amber-900/40 text-amber-50 transition-all">
      {/* Top sacred banner */}
      <div className="bg-gradient-to-r from-amber-950 via-red-950 to-amber-950 px-4 py-1.5 text-xs text-amber-300/90 text-center flex items-center justify-center gap-2 border-b border-amber-900/30">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="font-medium tracking-wide">
          {language === "hi"
            ? "॥ ॐ गं गणपतये नमः ॥ जय माता दी ॥ जय श्री राम ॥ हरे का सहारा बाबा श्याम हमारा ॥"
            : "॥ Om Gam Ganapataye Namaha ॥ Jai Mata Di ॥ Jai Shree Ram ॥ Hare Ka Sahara Baba Shyam Hamara ॥"}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 flex items-center justify-center shadow-lg shadow-orange-950/60 ring-2 ring-amber-400/30 group-hover:ring-amber-400 transition-all">
              <Flame className="w-7 h-7 text-amber-100 fill-amber-200 animate-bounce" style={{ animationDuration: "3s" }} />
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-orange-300">
                {t.siteTitle}
              </div>
              <div className="text-xs text-amber-400/80 font-medium tracking-wide line-clamp-1">
                {t.siteSubtitle}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {/* <nav className=" items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-amber-200/80 hover:text-amber-300 transition-colors py-1 hover:border-b-2 hover:border-amber-500"
              >
                {item.label}
              </a>
            ))}
          </nav> */}

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Devotional Bell / Chime sound toggle */}
            <button
              onClick={toggleAudioAmbiance}
              title={isAudioPlaying ? "Mute sacred bell" : "Ring temple bell"}
              className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-amber-950/60 border border-amber-800/50 hover:bg-amber-900/60 text-amber-300 flex items-center gap-1.5 text-xs font-medium transition-all"
            >
              <Bell className="w-4 h-4 text-amber-400 animate-pulse" />
              {isAudioPlaying ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-amber-400/60" />
              )}
              <span className="hidden md:inline">
                {language === "hi" ? "मंदिर घंटी" : "Temple Bell"}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-950 to-amber-950 border border-amber-700/60 hover:border-amber-400 text-amber-200 hover:text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-bold">文A</span>
              <span>{t.langToggle}</span>
            </button>

            {/* WhatsApp Contact Direct Button */}
            <a
              href="https://wa.me/919876543210?text=%E0%A5%A5%20%E0%A4%9C%E0%A4%AF%20%E0%A4%AE%E0%A4%BE%E0%A4%A4%E0%A4%BE%20%E0%A4%A6%E0%A5%80%20%E0%A5%A5%20%E0%A4%AA%E0%A4%82.%20%E0%A4%B0%E0%A4%BE%E0%A4%AE%E0%A5%87%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%B0%20%E0%A4%B6%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%BE%20%E0%A4%9C%E0%A5%80%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%BF%E0%A4%95%20%E0%A4%86%E0%A4%AF%E0%A5%8B%E0%A4%9C%E0%A4%A8%20%E0%A4%B9%E0%A5%87%E0%A4%A4%E0%A5%81%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A5%80%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Book Now Button */}
            <a
              href="#booking"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-orange-950/50 hover:shadow-amber-500/20 transition-all border border-amber-400/40"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              <span>{t.bookNow}</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className=" p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className=" bg-[#180e08] border-b border-amber-900/60 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-200/90 hover:text-amber-300 px-3 py-2 rounded-md hover:bg-amber-950/50 text-sm font-medium border-l-2 border-transparent hover:border-amber-500"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-amber-900/50 flex flex-col gap-2">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              <span>{language === "hi" ? "व्हाट्सएप पर बात करें" : "Chat on WhatsApp"}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
