"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Sparkles } from "lucide-react";

export default function MarqueeTicker() {
  const { language } = useLanguage();
  const [tickerText, setTickerText] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          const key = language === "hi" ? "welcome_marquee_hi" : "welcome_marquee_en";
          setTickerText(data.settings[key] || "");
        }
      })
      .catch(() => {});
  }, [language]);

  const defaultText =
    language === "hi"
      ? "॥ जय माता दी ॥ जय श्री राम ॥ हारे का सहारा बाबा श्याम हमारा ॥ आगामी नवरात्र, हनुमान जन्मोत्सव एवं एकादशी संकीर्तन हेतु अग्रिम बुकिंग जारी ॥ संपर्क: +91 98765 43210 ॥ संगीतमय सुंदरकांड पाठ एवं विशाल भगवती जागरण ॥"
      : "॥ Jai Mata Di ॥ Jai Shree Ram ॥ Hare Ka Sahara Baba Shyam Hamara ॥ Advance Bookings open for upcoming Navratri, Hanuman Jayanti & Ekadashi ॥ Contact: +91 98765 43210 ॥";

  const display = tickerText || defaultText;

  return (
    <div className="bg-gradient-to-r from-[#200e05] via-[#351608] to-[#200e05] border-y border-amber-800/40 py-2.5 overflow-hidden text-amber-300">
      <div className="flex items-center space-x-6 text-xs sm:text-sm tracking-wide font-medium">
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-0.5 ml-4 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === "hi" ? "सूचना" : "Notice"}</span>
        </div>

        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 inline" />
            {display}
          </span>
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 inline" />
            {display}
          </span>
        </div>
      </div>
    </div>
  );
}
