"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Phone, Mail, MapPin, Lock, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer id="contact" className="bg-[#080503] border-t border-amber-900/50 text-amber-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About Mandali */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center shadow-md">
                <Flame className="w-6 h-6 text-amber-100 fill-amber-200" />
              </div>
              <span className="font-serif text-lg font-bold text-amber-100">
                {t.siteTitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/70 leading-relaxed">
              {t.footerAbout}
            </p>
            <div className="text-xs text-amber-400 font-serif italic pt-1">
              ॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥
            </div>
          </div>

          {/* Col 2: Devotional Offerings */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-amber-100 border-b border-amber-900/60 pb-2">
              {language === "hi" ? "पावन अनुष्ठान" : "Devotional Offerings"}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  {t.serviceJagran}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  {t.serviceSundarkand}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  {t.serviceKeertan}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  {t.serviceChowki}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-300 transition-colors">
                  {t.serviceShiv}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-amber-100 border-b border-amber-900/60 pb-2">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#booking" className="hover:text-amber-300 transition-colors">
                  {t.navBooking}
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-amber-300 transition-colors">
                  {t.navSchedule}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">
                  {t.navGallery}
                </a>
              </li>
              <li>
                <a href="#youtube" className="hover:text-amber-300 transition-colors">
                  {t.navVideos}
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-amber-300 transition-colors">
                  {t.navTestimonials}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Seva */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-amber-100 border-b border-amber-900/60 pb-2">
              {t.contactInfo}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {language === "hi"
                    ? "बी-42, मंदिर मार्ग, प्राचीन हनुमान मंदिर के समीप, कनाट प्लेस, नई दिल्ली - 110001"
                    : "B-42, Mandir Marg, Near Hanuman Mandir, Connaught Place, New Delhi - 110001"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+919876543210" className="text-white hover:text-emerald-300 font-semibold">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:bhaktiras.mandali@gmail.com" className="hover:text-amber-300">
                  bhaktiras.mandali@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Booking Seva</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with subtle Admin Access */}
        <div className="pt-8 border-t border-amber-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-400/60">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} {t.siteTitle}. {t.allRightsReserved}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-[11px]">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Sanatan Dharma
            </span>

            {/* Discreet Admin Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1 text-amber-500/40 hover:text-amber-400 transition-colors"
              title="Mandali Administration"
            >
              <Lock className="w-3 h-3" />
              <span>{t.adminLink}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
