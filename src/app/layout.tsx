import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "पं. संजीव गोस्वामी — जागरण, सुंदरकांड व भजन संकीर्तन मंडल | Devotional Booking & Portfolio",
  description:
    "Organizers of Mata Ka Vishal Jagran, Akhand Sundarkand Paath, Khatu Shyam Bhajan Sandhya & Mata Ki Chowki. Book auspicious dates, explore devotional gallery & stream latest YouTube bhajans.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0704] text-[#f7eedf] antialiased selection:bg-amber-600 selection:text-white min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
