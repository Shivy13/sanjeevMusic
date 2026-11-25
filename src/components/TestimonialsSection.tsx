"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Quote, Star, MapPin } from "lucide-react";

export default function TestimonialsSection() {
  const { t, language } = useLanguage();

  const testimonialsEn = [
    {
      id: 1,
      quote: "The Navratri Jagran organized by Pt. Sanjiv Goswami and his Mandali was truly divine. The Kali Jhanki and Tara Rani Katha brought tears of joy to everyone. Sacred and seamless management!",
      name: "Shri Rajesh Agarwal",
      role: "Host & Committee Member",
      location: "Rohini, Delhi",
      rating: 5,
    },
    {
      id: 2,
      quote: "Every Tuesday Sundarkand Paath by this Mandali fills our home with peace and divine energy. The musical chaupais and harmonium accompaniment are unmatched in Delhi NCR.",
      name: "Smt. Sunita Gupta",
      role: "Devotee & Yojak",
      location: "Surya Nagar, Ghaziabad",
      rating: 5,
    },
    {
      id: 3,
      quote: "The Khatu Shyam Bhajan Sandhya was breathtaking! The flower decoration, itra varsha, and soulful bhajans had 1,000+ devotees dancing in ecstatic devotion.",
      name: "Dr. Alok Verma",
      role: "Samiti President",
      location: "Karnal, Haryana",
      rating: 5,
    },
  ];

  const testimonialsHi = [
    {
      id: 1,
      quote: "पं. संजीव गोस्वामी जी एवं मंडल द्वारा आयोजित नवरात्रि जागरण वास्तव में अलौकिक था। मां काली का तांडव एवं तारा रानी की पावन कथा ने संपूर्ण वातावरण को भक्तिमय बना दिया।",
      name: "श्री राजेश अग्रवाल",
      role: "यजमान एवं समिति सदस्य",
      location: "रोहिणी, दिल्ली",
      rating: 5,
    },
    {
      id: 2,
      quote: "इस मंडल द्वारा सुंदरकांड पाठ का सस्वर गायन अद्भुत है। संपूर्ण परिवार एवं कॉलोनी में ऐसी सकारात्मक ऊर्जा का संचार हुआ कि सब मंत्रमुग्ध हो गए। बहुत-बहुत आभार!",
      name: "श्रीमती सुनीता गुप्ता",
      role: "भक्त व आयोजक",
      location: "सूर्य नगर, गाजियाबाद",
      rating: 5,
    },
    {
      id: 3,
      quote: "खाटू श्याम संकीर्तन की संध्या अविस्मरणीय रही। इत्र वर्षा, छप्पन भोग एवं पुष्प वर्षा के साथ भजनों की ऐसी अमृत धारा बही कि श्रद्धालु भाव-विभोर होकर झूम उठे।",
      name: "डॉ. आलोक वर्मा",
      role: "श्री श्याम मंडल अध्यक्ष",
      location: "करनाल, हरियाणा",
      rating: 5,
    },
  ];

  const items = language === "hi" ? testimonialsHi : testimonialsEn;

  return (
    <section id="testimonials" className="py-24 bg-[#0e0804] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sacred Quote Banner */}
        <div className="max-w-4xl mx-auto mb-20 bg-gradient-to-r from-amber-950/40 via-[#221208] to-amber-950/40 rounded-2xl p-8 border border-amber-800/40 text-center relative overflow-hidden">
          <Quote className="w-12 h-12 text-amber-500/20 absolute -top-2 left-6" />
          <p className="font-serif text-xl sm:text-2xl text-amber-200 font-bold mb-3 tracking-wide">
            {t.quoteText}
          </p>
          <p className="text-sm sm:text-base text-amber-300/80 italic">
            {t.quoteTranslation}
          </p>
          <div className="mt-4 pt-3 border-t border-amber-900/40 text-xs text-amber-400/70 font-serif">
            {t.quoteSecondary}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.testimonialsBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.testimonialsTitle}
          </h2>
          <p className="text-amber-200/70 text-base sm:text-lg">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#150d07] rounded-2xl p-7 border border-amber-900/40 hover:border-amber-600/50 transition-all flex flex-col justify-between shadow-lg shadow-black/40"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed italic mb-6">
                  “{item.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-amber-900/40 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-serif font-bold text-amber-200 text-sm">
                    {item.name}
                  </h4>
                  <p className="text-amber-400/70 text-[11px]">{item.role}</p>
                </div>

                <div className="flex items-center gap-1 text-amber-300/80 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
