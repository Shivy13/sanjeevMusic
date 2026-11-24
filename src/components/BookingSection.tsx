"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Phone,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  User,
  Users,
} from "lucide-react";

interface PublicBooking {
  id: number;
  bookingRef: string;
  eventType: string;
  eventDate: string;
  timeSlot: string;
  city: string;
  status: string;
}

export default function BookingSection() {
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"calendar" | "form">("calendar");
  const [bookedEvents, setBookedEvents] = useState<PublicBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Month navigation for the calendar view
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Form states
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    eventType: "jagran",
    eventDate: "",
    timeSlot: "Full Night (9:00 PM – 5:00 AM)",
    venueAddress: "",
    city: "New Delhi",
    pincode: "",
    estimatedGuests: "200 - 300",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<null | {
    bookingRef: string;
    whatsappUrl: string;
    messageText: string;
  }>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch booked dates dynamically
  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch("/api/bookings?view=public");
      const data = await res.json();
      if (data.success) {
        setBookedEvents(data.bookings || []);
      }
    } catch (e) {
      console.error("Error fetching bookings:", e);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthNamesHi = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
  ];

  const currentMonthName = language === "hi" ? monthNamesHi[month] : monthNamesEn[month];

  // Map dates to bookings
  const getBookingForDate = (dayNum: number) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return bookedEvents.filter((b) => b.eventDate === dateStr && b.status !== "cancelled");
  };

  const handleDateClick = (dayNum: number) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    setFormData((prev) => ({ ...prev, eventDate: dateStr }));
    setActiveTab("form");
  };

  const getEventBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "jagran":
        return { label: language === "hi" ? "माता जागरण" : "Jagran", color: "bg-red-950 text-red-300 border-red-700/60" };
      case "sundarkand":
        return { label: language === "hi" ? "सुंदरकांड" : "Sundarkand", color: "bg-amber-950 text-amber-300 border-amber-700/60" };
      case "keertan":
        return { label: language === "hi" ? "श्याम संकीर्तन" : "Keertan", color: "bg-blue-950 text-blue-300 border-blue-700/60" };
      case "chowki":
        return { label: language === "hi" ? "माता की चौकी" : "Chowki", color: "bg-orange-950 text-orange-300 border-orange-700/60" };
      default:
        return { label: language === "hi" ? "धार्मिक अनुष्ठान" : "Devotional", color: "bg-purple-950 text-purple-300 border-purple-700/60" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit booking");
      }

      setSubmitSuccess({
        bookingRef: data.booking.bookingRef,
        whatsappUrl: data.whatsappUrl,
        messageText: data.whatsappMessage,
      });

      // Refresh bookings calendar dynamically
      fetchBookings();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An error occurred while booking");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-[#0a0603] text-amber-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.bookingBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.bookingTitle}
          </h2>
          <p className="text-amber-200/70 text-base sm:text-lg">
            {t.bookingSubtitle}
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-[#170e08] border border-amber-800/40">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "calendar"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950"
                  : "text-amber-200/70 hover:text-white"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{t.tabCheckAvailability}</span>
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "form"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950"
                  : "text-amber-200/70 hover:text-white"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{t.tabBookForm}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CALENDAR & BOOKED SCHEDULE */}
        {activeTab === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Calendar (7 Cols) */}
            <div className="lg:col-span-7 bg-[#140c06] rounded-2xl border border-amber-900/40 p-6 sm:p-8 shadow-xl shadow-black/60">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/40">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                    {currentMonthName} {year}
                  </h3>
                  <p className="text-xs text-amber-300/70 mt-0.5">
                    {language === "hi"
                      ? "उपलब्ध तारीख पर क्लिक करके सीधे बुक करें"
                      : "Click on any available date to reserve your slot"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/60 text-amber-300 transition-colors"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/60 text-amber-300 transition-colors"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-amber-400/80">
                {language === "hi"
                  ? ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
                  : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                      <div key={idx} className="py-1">
                        {day}
                      </div>
                    ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty slots before first day of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-xl bg-amber-950/10 opacity-30" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayBookings = getBookingForDate(dayNum);
                  const isBooked = dayBookings.length > 0;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => handleDateClick(dayNum)}
                      className={`relative h-14 sm:h-20 rounded-xl p-1.5 flex flex-col justify-between text-left transition-all border ${
                        isBooked
                          ? "bg-red-950/40 border-red-800/50 hover:bg-red-950/60"
                          : "bg-[#1d120a]/80 border-amber-900/30 hover:border-amber-500 hover:bg-amber-950/50"
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isBooked ? "text-red-300" : "text-amber-100"
                        }`}
                      >
                        {dayNum}
                      </span>

                      {isBooked ? (
                        <div className="w-full">
                          {dayBookings.slice(0, 1).map((b) => {
                            const badge = getEventBadge(b.eventType);
                            return (
                              <div
                                key={b.id}
                                className={`text-[9px] sm:text-[10px] leading-tight px-1 py-0.5 rounded border truncate ${badge.color}`}
                                title={`${badge.label} (${b.timeSlot})`}
                              >
                                {badge.label}
                              </div>
                            );
                          })}
                          <span className="text-[9px] text-red-400 block font-semibold truncate hidden sm:block">
                            {dayBookings[0].timeSlot.split("(")[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] text-emerald-400/80 font-medium hidden sm:block">
                          {language === "hi" ? "उपलब्ध" : "Available"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-amber-900/40 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-red-900/80 border border-red-700" />
                  <span className="text-red-200">{t.legendBooked}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-600" />
                  <span className="text-emerald-300">{t.legendAvailable}</span>
                </div>
                <p className="text-amber-400/70 text-[11px] ml-auto">
                  {t.bookedDatesNote}
                </p>
              </div>
            </div>

            {/* Upcoming Confirmed Bookings List (5 Cols) */}
            <div id="schedule" className="lg:col-span-5 bg-[#140c06] rounded-2xl border border-amber-900/40 p-6 sm:p-8 shadow-xl shadow-black/60">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/40">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                    {language === "hi" ? "बुक की गई तिथियां एवं समय" : "Booked Dates & Timings"}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                  {bookedEvents.length} {language === "hi" ? "आयोजन" : "Events"}
                </span>
              </div>

              {isLoadingBookings ? (
                <div className="py-12 text-center text-sm text-amber-400 animate-pulse">
                  {language === "hi" ? "पंचांग व बुकिंग लोड हो रही है..." : "Loading bookings..."}
                </div>
              ) : bookedEvents.length === 0 ? (
                <div className="py-12 text-center text-sm text-amber-300/60">
                  {language === "hi" ? "फिलहाल कोई तिथि आरक्षित नहीं है।" : "No booked dates yet."}
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                  {bookedEvents.map((booking) => {
                    const badge = getEventBadge(booking.eventType);
                    return (
                      <div
                        key={booking.id}
                        className="bg-[#1b1008] rounded-xl p-4 border border-amber-900/40 hover:border-amber-700/60 transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] font-mono text-amber-400/80">
                            #{booking.bookingRef}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="flex items-center gap-1.5 text-amber-200">
                            <CalendarIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="font-semibold text-white">{booking.eventDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-300/80">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{booking.city}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-900/30">
                          <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="truncate">{booking.timeSlot}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Direct Booking CTA */}
              <div className="mt-6 pt-4 border-t border-amber-900/40 text-center">
                <button
                  onClick={() => setActiveTab("form")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>{t.tabBookForm}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKING FORM */}
        {activeTab === "form" && (
          <div className="max-w-3xl mx-auto bg-[#140c06] rounded-2xl border border-amber-900/40 p-6 sm:p-10 shadow-2xl shadow-black/80">
            {submitSuccess ? (
              /* Success State with WhatsApp Notification Trigger */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/60">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {t.bookingSuccessTitle}
                  </h3>
                  <p className="text-amber-200/80 text-sm max-w-lg mx-auto">
                    {t.bookingSuccessDesc.replace("{ref}", submitSuccess.bookingRef)}
                  </p>
                </div>

                {/* Preformatted WhatsApp Notification Card */}
                <div className="bg-[#1e130a] rounded-xl p-5 border border-amber-700/40 text-left max-w-md mx-auto space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp Notification Message:</span>
                  </div>
                  <pre className="text-xs text-amber-200/90 whitespace-pre-wrap font-sans bg-black/40 p-3 rounded-lg max-h-48 overflow-y-auto">
                    {submitSuccess.messageText}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a
                    href={submitSuccess.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.btnSendWhatsApp}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setFormData((prev) => ({
                        ...prev,
                        eventDate: "",
                        specialRequests: "",
                      }));
                    }}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-200 text-sm font-semibold transition-all"
                  >
                    {t.btnBookAnother}
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-700 text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Client Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.formName} *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder={t.formNamePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Phone (WhatsApp) */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.formPhone} *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t.formPhonePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                    />
                    <p className="text-[11px] text-amber-400/60">{t.formPhoneHint}</p>
                  </div>

                  {/* Event Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{t.formEventType} *</span>
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white text-sm outline-none transition-all"
                    >
                      <option value="jagran">{language === "hi" ? "माँ का विशाल जागरण (Full Night)" : "Mata Ka Vishal Jagran (All Night)"}</option>
                      <option value="sundarkand">{language === "hi" ? "संगीतमय अखंड सुंदरकांड पाठ" : "Akhand Sundarkand Paath"}</option>
                      <option value="keertan">{language === "hi" ? "खाटू श्याम संकीर्तन (Bhajan Sandhya)" : "Khatu Shyam Bhajan Keertan"}</option>
                      <option value="chowki">{language === "hi" ? "माता की पावन चौकी (Evening)" : "Mata Ki Chowki"}</option>
                      <option value="shiv">{language === "hi" ? "शिव चर्चा एवं संकीर्तन" : "Shiv Charcha & Keertan"}</option>
                      <option value="bhagwat">{language === "hi" ? "श्रीमद्भागवत कथा सप्ताह (7 Days)" : "Shrimad Bhagwat Katha Saptah"}</option>
                    </select>
                  </div>

                  {/* Event Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.formEventDate} *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Time Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.formTimeSlot} *</span>
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white text-sm outline-none transition-all"
                    >
                      <option value="Full Night (9:00 PM – 5:00 AM)">{t.slotFullNight}</option>
                      <option value="Evening (7:00 PM – 11:30 PM)">{t.slotEvening}</option>
                      <option value="Morning (8:00 AM – 1:00 PM)">{t.slotMorningSundarkand}</option>
                      <option value="Afternoon (2:30 PM – 6:30 PM)">{t.slotAfternoon}</option>
                      <option value="Custom Timings (Discuss on WhatsApp)">{t.slotCustom}</option>
                    </select>
                  </div>

                  {/* Estimated Guests */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.formGuests}</span>
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedGuests}
                      onChange={(e) => setFormData({ ...formData, estimatedGuests: e.target.value })}
                      placeholder="e.g. 200 - 300 devotees"
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.formCity} *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={t.formCityPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-amber-300">
                      {t.formEmail}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.formEmailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Venue Address */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.formAddress} *</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    placeholder={t.formAddressPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                  />
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-amber-300">
                    {t.formRequests}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder={t.formRequestsPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#1b1008] border border-amber-800/60 focus:border-amber-400 text-white placeholder-amber-400/40 text-sm outline-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-950/70 border border-amber-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{t.submittingBooking}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.btnSubmitBooking}</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-amber-400/60 mt-2">
                    {language === "hi"
                      ? "बुकिंग उपरांत व्हाट्सएप पर स्वतः विवरण तैयार हो जाएगा।"
                      : "WhatsApp notification with your booking details will be prepared immediately."}
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
