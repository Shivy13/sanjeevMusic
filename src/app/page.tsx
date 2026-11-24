"use client";

import React from "react";
import Header from "@/components/Header";
import MarqueeTicker from "@/components/MarqueeTicker";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import BookingSection from "@/components/BookingSection";
import GallerySection from "@/components/GallerySection";
import YouTubeSection from "@/components/YouTubeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0704]">
      {/* Devotional Header */}
      <Header />

      {/* Auspicious Announcement Marquee */}
      <MarqueeTicker />

      {/* Main Content */}
      <main className="flex-1">
        {/* Sacred Hero Section */}
        <Hero />

        {/* Devotional Offerings & Services */}
        <ServicesSection />

        {/* Dynamic Booking & Booked Dates Calendar */}
        <BookingSection />

        {/* Sacred Gallery & Event Portfolio */}
        <GallerySection />

        {/* Dynamic YouTube Bhajans & Video Stream */}
        <YouTubeSection />

        {/* Sangat Speaks & Devotee Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Devotional Footer with discreet /admin access */}
      <Footer />
    </div>
  );
}
