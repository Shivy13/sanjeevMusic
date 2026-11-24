"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Music, Sparkles, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      id: "jagran",
      title: t.serviceJagran,
      desc: t.serviceJagranDesc,
      image: "/images/hero-devotional.jpg",
      tag: "All-Night Vigil",
      duration: "9:00 PM – 5:00 AM",
      highlights: ["Akhand Jyoti Sthapana", "Tara Rani Katha", "Kali Taandav Jhanki", "Divya Maha Aarti"],
    },
    {
      id: "sundarkand",
      title: t.serviceSundarkand,
      desc: t.serviceSundarkandDesc,
      image: "/images/sundarkand-path.jpg",
      tag: "Musical Paath",
      duration: "3 – 4 Hours",
      highlights: ["Sampurna Chaupai Recital", "Hanuman Sindoor Pujan", "Ram Darbar Jhanki", "Havan & Purnahuti"],
    },
    {
      id: "keertan",
      title: t.serviceKeertan,
      desc: t.serviceKeertanDesc,
      image: "/images/bhajan-keertan.jpg",
      tag: "Bhajan Sandhya",
      duration: "4 – 5 Hours",
      highlights: ["Chhappan Bhog Arpan", "Itra Varsha", "Phoolon Ki Holi", "Akhand Jyot"],
    },
    {
      id: "chowki",
      title: t.serviceChowki,
      desc: t.serviceChowkiDesc,
      image: "/images/mata-ki-chowki.jpg",
      tag: "Family Blessing",
      duration: "3 – 4 Hours",
      highlights: ["Ganesh Vandana", "Bhavan Poojan", "Mata Ki Bhent", "Devotee Ardas"],
    },
    {
      id: "shiv",
      title: t.serviceShiv,
      desc: t.serviceShivDesc,
      image: "https://images.pexels.com/photos/39594618/pexels-photo-39594618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "Maha Shivratri / Somwar",
      duration: "3 – 4 Hours",
      highlights: ["Shiv Stotram Chanting", "Damru & Shankhnaad", "Mahamrityunjaya Jaap", "Ganga Aarti Style"],
    },
    {
      id: "bhagwat",
      title: t.serviceBhagwat,
      desc: t.serviceBhagwatDesc,
      image: "https://images.pexels.com/photos/40971269/pexels-photo-40971269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tag: "7 Days Katha Saptah",
      duration: "7 Days (3 hrs daily)",
      highlights: ["Vyaspeeth Poojan", "Krishna Janmotsav", "Govardhan Puja Leela", "Rukmini Vivah"],
    },
  ];

  const highlights = [
    t.featuresTeam,
    t.featuresSound,
    t.featuresJhanki,
    t.featuresPrasad,
  ];

  return (
    <section id="services" className="py-24 bg-[#0e0804] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/70 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.servicesBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.servicesTitle}
          </h2>
          <p className="text-amber-200/70 text-base sm:text-lg">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="group bg-[#170e08] rounded-2xl overflow-hidden border border-amber-900/40 hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/50 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#170e08] via-[#170e08]/30 to-transparent" />
                <div className="absolute top-3 left-3 bg-amber-950/90 backdrop-blur-sm border border-amber-600/40 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-300">
                  {svc.tag}
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-amber-200/90">
                  {svc.duration}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2.5">
                    {svc.title}
                  </h3>
                  <p className="text-amber-200/70 text-sm leading-relaxed mb-4">
                    {svc.desc}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {svc.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-300/80 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`#booking`}
                  className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-950/50 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 border border-amber-800/50 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-semibold transition-all group/btn"
                >
                  <span>{t.bookNow}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mandali Highlights Strip */}
        <div className="mt-16 bg-gradient-to-r from-amber-950/60 via-[#261307] to-amber-950/60 border border-amber-800/40 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-sm font-medium text-amber-100 leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
