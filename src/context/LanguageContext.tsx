"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations["en"];
  isAudioPlaying: boolean;
  toggleAudioAmbiance: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("hi"); // Hindi by default for authentic devotional feel
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("devotional_lang") as Language;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("devotional_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
  };

  // Devotional temple bell chime sound synthesizer using Web Audio API
  const playTempleBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContext || new AudioCtx();
      if (!audioContext) setAudioContext(ctx);

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Bell chime: multiple harmonics (sine waves) with exponential decay
      const fundamental = 432; // sacred 432Hz tuning
      const harmonics = [1, 2.76, 5.4, 8.93];
      const gains = [0.3, 0.15, 0.08, 0.03];

      harmonics.forEach((harmonic, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(fundamental * harmonic, ctx.currentTime);

        gainNode.gain.setValueAtTime(gains[idx] || 0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 3.6);
      });
    } catch {
      // Audio not supported or blocked
    }
  };

  const toggleAudioAmbiance = () => {
    playTempleBell();
    setIsAudioPlaying(!isAudioPlaying);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isAudioPlaying,
        toggleAudioAmbiance,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
