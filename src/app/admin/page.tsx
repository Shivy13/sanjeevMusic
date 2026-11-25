"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Calendar,
  Image as ImageIcon,
  Play,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Send,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  Flame,
  Phone,
  Clock,
  MapPin,
  X,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: number;
  bookingRef: string;
  clientName: string;
  phone: string;
  email: string | null;
  eventType: string;
  eventDate: string;
  timeSlot: string;
  venueAddress: string;
  city: string;
  pincode: string | null;
  estimatedGuests: string | null;
  specialRequests: string | null;
  status: string;
  adminNotes: string | null;
  whatsappNotified: boolean;
  createdAt: string;
}

interface GalleryItem {
  id: number;
  title: string;
  titleHi: string;
  description: string | null;
  descriptionHi: string | null;
  category: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  eventDate: string | null;
  location: string | null;
  featured: boolean;
  sortOrder: number;
}

interface YouTubeVideo {
  id: number;
  youtubeId: string;
  title: string;
  titleHi: string | null;
  description: string | null;
  category: string;
  thumbnailUrl: string;
  duration: string | null;
  viewsCount: string | null;
  publishedAt: string | null;
  featured: boolean;
}

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<"bookings" | "gallery" | "youtube" | "settings">("bookings");

  // Data states
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [youtubeList, setYoutubeList] = useState<YouTubeVideo[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // Search & Filter for bookings
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");

  // Modals
  const [editingBookingDate, setEditingBookingDate] = useState<Booking | null>(null);
  const [whatsAppModalBooking, setWhatsAppModalBooking] = useState<Booking | null>(null);
  const [manualBookingModal, setManualBookingModal] = useState<boolean>(false);

  // Gallery item modal (Add / Edit)
  const [galleryModal, setGalleryModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    item?: GalleryItem;
  }>({ open: false, mode: "add" });

  // -------------------------------------------------------------
  // DYNAMIC MEDIA URL GENERATOR
  // -------------------------------------------------------------
  // Creates a placeholder image URL dynamically from form data so the
  // admin never has to type a media URL manually.
  const generateMediaUrl = (
    title: string,
    category: string,
    mediaType: string,
    eventDate?: string | null
  ) => {
    const safeTitle = encodeURIComponent(title || "Devotional Event");
    const safeCategory = encodeURIComponent(category || "event");
    const dateSuffix = eventDate ? `-${eventDate}` : "";
    const seed = `${safeTitle}-${safeCategory}${dateSuffix}`.slice(0, 60);

    // Dark devotional theme colors matching the site
    const bgColor = "7c2d12"; // amber-900
    const textColor = "f7eedf"; // cream

    const mediaUrl = `https://placehold.co/800x600/png?text=${safeTitle}&font=cinzel&bg=${bgColor}&fc=${textColor}`;
    const thumbnailUrl = `https://placehold.co/400x300/png?text=${safeTitle}&font=cinzel&bg=${bgColor}&fc=${textColor}`;

    // For video mediaType, still use image placeholders (thumbnail + poster)
    return { mediaUrl, thumbnailUrl };
  };

  // YouTube modal (Add / Edit)
  const [youtubeModal, setYoutubeModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    video?: YouTubeVideo;
  }>({ open: false, mode: "add" });

  // Check auth on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    setIsCheckingAuth(true);
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadAllData();
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("devotional_admin_token", "ADMIN_AUTHENTICATED");
        loadAllData();
      } else {
        setAuthError(data.error || "Invalid password");
      }
    } catch {
      setAuthError("Authentication request failed");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    localStorage.removeItem("devotional_admin_token");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [bRes, gRes, yRes, sRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/gallery"),
        fetch("/api/youtube"),
        fetch("/api/settings"),
      ]);

      const [bData, gData, yData, sData] = await Promise.all([
        bRes.json(),
        gRes.json(),
        yRes.json(),
        sRes.json(),
      ]);

      if (bData.success) setBookingsList(bData.bookings || []);
      if (gData.success) setGalleryList(gData.items || []);
      if (yData.success) setYoutubeList(yData.videos || []);
      if (sData.success) setSettingsMap(sData.settings || {});
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(""), 4500);
  };

  // -------------------------------------------------------------
  // BOOKINGS HANDLERS (Dynamic date updates & WhatsApp dispatch)
  // -------------------------------------------------------------
  const handleUpdateBookingDateAndTime = async (bookingId: number, newDate: string, newTime: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDate: newDate, timeSlot: newTime }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingsList((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, eventDate: newDate, timeSlot: newTime } : b))
        );
        setEditingBookingDate(null);
        showNotification("Booking date & time updated dynamically! Devotee calendar updated.");
      }
    } catch {
      alert("Failed to update booking date");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingsList((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        showNotification(`Booking #${bookingId} status changed to ${newStatus}`);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel and delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBookingsList((prev) => prev.filter((b) => b.id !== bookingId));
        showNotification("Booking removed successfully.");
      }
    } catch {
      alert("Failed to delete booking");
    }
  };

  const handleSendWhatsAppNotification = async (bookingId: number, target: "client" | "organizer") => {
    try {
      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, target }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingsList((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, whatsappNotified: true } : b))
        );
        // Open WhatsApp link in new tab
        window.open(data.whatsappUrl, "_blank");
        showNotification(`WhatsApp notification link prepared and dispatched to ${target}!`);
        setWhatsAppModalBooking(null);
      }
    } catch {
      alert("Failed to generate WhatsApp notification");
    }
  };

  // -------------------------------------------------------------
  // GALLERY HANDLERS (CRUD)
  // -------------------------------------------------------------
  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setGalleryList((prev) => prev.filter((g) => g.id !== id));
        showNotification("Gallery item deleted successfully");
      }
    } catch {
      alert("Failed to delete gallery item");
    }
  };

  // -------------------------------------------------------------
  // YOUTUBE HANDLERS (CRUD & Dynamic Sync)
  // -------------------------------------------------------------
  const handleSyncYouTube = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/youtube/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      showNotification(data.message || "YouTube sync finished!");
      // Reload youtube list
      const yRes = await fetch("/api/youtube");
      const yData = await yRes.json();
      if (yData.success) setYoutubeList(yData.videos || []);
    } catch {
      alert("Failed to sync YouTube feed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteYouTube = async (id: number) => {
    if (!confirm("Are you sure you want to delete this YouTube video?")) return;
    try {
      const res = await fetch(`/api/youtube/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setYoutubeList((prev) => prev.filter((v) => v.id !== id));
        showNotification("YouTube video deleted from website");
      }
    } catch {
      alert("Failed to delete video");
    }
  };

  // -------------------------------------------------------------
  // SETTINGS HANDLER
  // -------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsMap }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("Organizer settings saved successfully!");
      }
    } catch {
      alert("Failed to save settings");
    }
  };

  // Filter bookings
  const filteredBookings = bookingsList.filter((b) => {
    if (bookingFilterStatus !== "all" && b.status !== bookingFilterStatus) return false;
    if (bookingSearch) {
      const q = bookingSearch.toLowerCase();
      return (
        b.clientName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.bookingRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // -------------------------------------------------------------
  // RENDER: LOGIN GATE IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0603] flex items-center justify-center p-4">
        <div className="text-center text-amber-400 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0603] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#160d07] rounded-3xl border border-amber-800/50 p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-red-700 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/80">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-white">
              Mandali Admin Access
            </h2>
            <p className="text-xs text-amber-300/70">
              पं. संजीव गोस्वामी एवं श्री बांके बिहारी मानस जागरण मंडल
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-700 text-red-200 text-xs flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left space-y-1.5">
              <label className="text-xs font-semibold text-amber-300">
                Admin Security Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (ADMIN)"
                className="w-full px-4 py-3 rounded-xl bg-[#201209] border border-amber-700/60 focus:border-amber-400 text-white text-sm outline-none transition-all text-center tracking-widest font-mono placeholder:tracking-normal placeholder:font-sans"
              />
              <p className="text-[11px] text-amber-400/60 text-center">
                System default password: <strong className="text-amber-300 font-mono">ADMIN</strong>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-amber-900/40">
            <Link
              href="/"
              className="text-xs text-amber-400/70 hover:text-amber-200 transition-colors"
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: FULL ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0a0603] text-amber-100 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#160d07] border-b border-amber-900/60 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-700 flex items-center justify-center shadow-md">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Mandali Admin Control</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                ACTIVE
              </span>
            </div>
            <div className="text-[11px] text-amber-400/80">
              Pt. Sanjiv Goswami — Jagran, Sundarkand & Bhajan Mandali
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 text-xs font-semibold hover:bg-amber-900"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs font-semibold hover:bg-red-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div className="bg-[#120a05] border-b border-amber-900/40 px-4 sm:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950"
                : "text-amber-200/70 hover:text-white hover:bg-amber-950/40"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Dates ({bookingsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "gallery"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950"
                : "text-amber-200/70 hover:text-white hover:bg-amber-950/40"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Portfolio ({galleryList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "youtube"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950"
                : "text-amber-200/70 hover:text-white hover:bg-amber-950/40"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>YouTube Stream ({youtubeList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-950"
                : "text-amber-200/70 hover:text-white hover:bg-amber-950/40"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Organizer Settings</span>
          </button>
        </div>
      </div>

      {/* Global feedback banner */}
      {feedbackMessage && (
        <div className="bg-emerald-950 border-b border-emerald-700/60 px-4 py-2 text-center text-xs text-emerald-200 font-semibold flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* ========================================================= */}
        {/* TAB 1: BOOKINGS MANAGEMENT (DYNAMIC DATES + WHATSAPP)   */}
        {/* ========================================================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#160d07] p-4 rounded-2xl border border-amber-900/40">
                <div className="text-xs text-amber-400 font-semibold uppercase">Total Bookings</div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
                  {bookingsList.length}
                </div>
              </div>
              <div className="bg-[#160d07] p-4 rounded-2xl border border-amber-900/40">
                <div className="text-xs text-amber-400 font-semibold uppercase">Confirmed</div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-400 mt-1">
                  {bookingsList.filter((b) => b.status === "confirmed").length}
                </div>
              </div>
              <div className="bg-[#160d07] p-4 rounded-2xl border border-amber-900/40">
                <div className="text-xs text-amber-400 font-semibold uppercase">Pending Review</div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-400 mt-1">
                  {bookingsList.filter((b) => b.status === "pending").length}
                </div>
              </div>
              <div className="bg-[#160d07] p-4 rounded-2xl border border-amber-900/40">
                <div className="text-xs text-amber-400 font-semibold uppercase">Completed</div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-purple-400 mt-1">
                  {bookingsList.filter((b) => b.status === "completed").length}
                </div>
              </div>
            </div>

            {/* Filter and Action Bar */}
            <div className="bg-[#160d07] p-4 rounded-2xl border border-amber-900/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by devotee, phone, city, or Ref ID..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#201209] border border-amber-800/60 focus:border-amber-400 text-white text-xs outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#201209] border border-amber-800/60 text-white text-xs outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setManualBookingModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Manual Booking</span>
              </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-[#160d07] rounded-2xl border border-amber-900/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#201209] text-amber-300 font-semibold border-b border-amber-900/50">
                    <tr>
                      <th className="p-3.5">Ref ID</th>
                      <th className="p-3.5">Devotee / Client</th>
                      <th className="p-3.5">Event Type</th>
                      <th className="p-3.5">Event Date & Time (Dynamic)</th>
                      <th className="p-3.5">Venue & City</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">WhatsApp</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/30">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-amber-400/60">
                          No bookings matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-amber-950/20 transition-colors">
                          {/* Ref ID */}
                          <td className="p-3.5 font-mono text-amber-400 font-bold whitespace-nowrap">
                            #{b.bookingRef}
                          </td>

                          {/* Client */}
                          <td className="p-3.5">
                            <div className="font-semibold text-white">{b.clientName}</div>
                            <div className="text-[11px] text-amber-300/80 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span>{b.phone}</span>
                            </div>
                          </td>

                          {/* Event Type */}
                          <td className="p-3.5">
                            <span className="capitalize px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-semibold">
                              {b.eventType}
                            </span>
                          </td>

                          {/* Event Date & Time (Dynamic Edit Button) */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-white font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{b.eventDate}</span>
                            </div>
                            <div className="text-[11px] text-amber-300/70 truncate max-w-[160px] mt-0.5">
                              {b.timeSlot}
                            </div>
                            <button
                              onClick={() => setEditingBookingDate(b)}
                              className="mt-1 text-[10px] text-orange-400 hover:text-orange-300 font-semibold underline flex items-center gap-1"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Update Date/Time</span>
                            </button>
                          </td>

                          {/* Venue */}
                          <td className="p-3.5 max-w-[160px]">
                            <div className="truncate text-amber-100">{b.venueAddress}</div>
                            <div className="text-[11px] text-amber-400/70 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-500" />
                              <span>{b.city}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3.5">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                              className={`text-[11px] font-semibold px-2 py-1 rounded-lg border outline-none ${
                                b.status === "confirmed"
                                  ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                                  : b.status === "completed"
                                  ? "bg-purple-950 text-purple-300 border-purple-700"
                                  : b.status === "cancelled"
                                  ? "bg-red-950 text-red-300 border-red-700"
                                  : "bg-amber-950 text-amber-300 border-amber-700"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* WhatsApp Notification Trigger */}
                          <td className="p-3.5 whitespace-nowrap">
                            <button
                              onClick={() => setWhatsAppModalBooking(b)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                                b.whatsappNotified
                                  ? "bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900"
                                  : "bg-[#25150a] text-amber-300 border-amber-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700"
                              }`}
                              title="Send WhatsApp Notification"
                            >
                              <Send className="w-3 h-3" />
                              <span>{b.whatsappNotified ? "Notified" : "Notify WhatsApp"}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: GALLERY CRUD                                       */}
        {/* ========================================================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#160d07] p-4 rounded-2xl border border-amber-900/40">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Gallery & Portfolio Management
                </h3>
                <p className="text-xs text-amber-300/70">
                  Add, update or delete Jagran, Sundarkand, and Keertan event photos & videos.
                </p>
              </div>

              <button
                onClick={() => setGalleryModal({ open: true, mode: "add" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Photo / Video</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#160d07] rounded-2xl border border-amber-900/40 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-black">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 uppercase">
                      {item.category}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 uppercase">
                      {item.mediaType}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-amber-400/80 font-serif line-clamp-1 mt-0.5">
                        {item.titleHi}
                      </p>
                      <div className="mt-2 text-[11px] text-amber-300/70 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className="truncate">{item.location || "Delhi NCR"}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between">
                      <button
                        onClick={() => setGalleryModal({ open: true, mode: "edit", item })}
                        className="flex items-center gap-1 text-xs text-amber-300 hover:text-white"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: YOUTUBE SECTION (CRUD + DYNAMIC SYNC)             */}
        {/* ========================================================= */}
        {activeTab === "youtube" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#160d07] p-4 rounded-2xl border border-amber-900/40">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  YouTube Videos & Dynamic Stream
                </h3>
                <p className="text-xs text-amber-300/70">
                  Pull latest videos dynamically from YouTube or manually add devotional videos.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSyncYouTube}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-bold text-xs shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-red-400" />
                  <span>Sync from YouTube Now</span>
                </button>

                <button
                  onClick={() => setYoutubeModal({ open: true, mode: "add" })}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add YouTube Video</span>
                </button>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeList.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-[#160d07] rounded-2xl border border-amber-900/40 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-black">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    {vid.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/85 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">
                        {vid.duration}
                      </span>
                    )}
                    <span className="absolute top-2 left-2 bg-red-950 px-2 py-0.5 rounded text-[10px] font-bold text-red-200 border border-red-700 uppercase">
                      {vid.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-white line-clamp-2">
                        {vid.title}
                      </h4>
                      {vid.titleHi && (
                        <p className="text-xs text-amber-400/80 font-serif line-clamp-1 mt-1">
                          {vid.titleHi}
                        </p>
                      )}
                      <div className="mt-2 text-[11px] text-amber-300/60 font-mono">
                        ID: {vid.youtubeId} • {vid.viewsCount || "10K+"} views
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between">
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Watch</span>
                      </a>

                      <button
                        onClick={() => handleDeleteYouTube(vid.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SETTINGS & ORGANIZER PROFILE                      */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto bg-[#160d07] rounded-2xl border border-amber-900/40 p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Organizer Profile & Notification Settings
            </h3>
            <p className="text-xs text-amber-300/70 mb-6">
              Configure the WhatsApp phone number receiving devotee booking alerts and ticker messages.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-amber-300">
                  Organizer WhatsApp Phone Number (Receives booking alerts)
                </label>
                <input
                  type="text"
                  value={settingsMap["organizer_whatsapp"] || ""}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, organizer_whatsapp: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201209] border border-amber-800 focus:border-amber-400 text-white"
                  placeholder="+919876543210"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-amber-300">
                  Organizer Name (English)
                </label>
                <input
                  type="text"
                  value={settingsMap["organizer_name_en"] || ""}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, organizer_name_en: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201209] border border-amber-800 focus:border-amber-400 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-amber-300">
                  Organizer Name (Hindi)
                </label>
                <input
                  type="text"
                  value={settingsMap["organizer_name_hi"] || ""}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, organizer_name_hi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201209] border border-amber-800 focus:border-amber-400 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-amber-300">
                  YouTube Channel ID (for Dynamic RSS Sync, e.g. UC...)
                </label>
                <input
                  type="text"
                  value={settingsMap["youtube_channel_id"] || ""}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, youtube_channel_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201209] border border-amber-800 focus:border-amber-400 text-white font-mono"
                  placeholder="UCxxxxxxxxxxxxxxxxx"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-amber-300">
                  Announcement Ticker Marquee (Hindi)
                </label>
                <textarea
                  rows={2}
                  value={settingsMap["welcome_marquee_hi"] || ""}
                  onChange={(e) =>
                    setSettingsMap({ ...settingsMap, welcome_marquee_hi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201209] border border-amber-800 focus:border-amber-400 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-md transition-all pt-2"
              >
                Save Organizer Settings
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: DYNAMIC BOOKING DATE & TIME UPDATER               */}
      {/* ========================================================= */}
      {editingBookingDate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#180e08] rounded-2xl border border-amber-700/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
              <h3 className="font-serif font-bold text-base text-white">
                Update Booking Date & Time Dynamically
              </h3>
              <button
                onClick={() => setEditingBookingDate(null)}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-amber-300/70">
              Devotee: <strong>{editingBookingDate.clientName}</strong> (#{editingBookingDate.bookingRef})
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const newDate = (form.elements.namedItem("eventDate") as HTMLInputElement).value;
                const newTime = (form.elements.namedItem("timeSlot") as HTMLInputElement).value;
                handleUpdateBookingDateAndTime(editingBookingDate.id, newDate, newTime);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-amber-300">New Auspicious Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  defaultValue={editingBookingDate.eventDate}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-amber-300">New Time Slot</label>
                <input
                  type="text"
                  name="timeSlot"
                  defaultValue={editingBookingDate.timeSlot}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBookingDate(null)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-950/70 border border-amber-800 text-amber-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold"
                >
                  Save Date & Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: WHATSAPP NOTIFICATION DISPATCH                    */}
      {/* ========================================================= */}
      {whatsAppModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#180e08] rounded-2xl border border-emerald-700/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
              <div className="flex items-center gap-2 text-emerald-400">
                <Phone className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base text-white">
                  Send WhatsApp Notification
                </h3>
              </div>
              <button
                onClick={() => setWhatsAppModalBooking(null)}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-amber-200/80">
              Recipient: <strong>{whatsAppModalBooking.clientName}</strong> ({whatsAppModalBooking.phone})
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleSendWhatsAppNotification(whatsAppModalBooking.id, "client")}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
              >
                <Send className="w-4 h-4" />
                <span>Notify Devotee / Client (Confirm Status)</span>
              </button>

              <button
                onClick={() => handleSendWhatsAppNotification(whatsAppModalBooking.id, "organizer")}
                className="w-full py-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Send Alert to Organizer WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANUAL BOOKING CREATION                           */}
      {/* ========================================================= */}
      {manualBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#180e08] rounded-2xl border border-amber-700/60 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
              <h3 className="font-serif font-bold text-base text-white">
                Add Manual Devotional Booking
              </h3>
              <button
                onClick={() => setManualBookingModal(false)}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const payload = {
                  clientName: (form.elements.namedItem("clientName") as HTMLInputElement).value,
                  phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
                  eventType: (form.elements.namedItem("eventType") as HTMLSelectElement).value,
                  eventDate: (form.elements.namedItem("eventDate") as HTMLInputElement).value,
                  timeSlot: (form.elements.namedItem("timeSlot") as HTMLInputElement).value,
                  city: (form.elements.namedItem("city") as HTMLInputElement).value,
                  venueAddress: (form.elements.namedItem("venueAddress") as HTMLInputElement).value,
                };
                try {
                  const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setBookingsList((prev) => [data.booking, ...prev]);
                    setManualBookingModal(false);
                    showNotification(`Booking #${data.booking.bookingRef} created manually!`);
                  }
                } catch {
                  alert("Failed to create manual booking");
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-amber-300">Devotee / Host Name *</label>
                <input
                  required
                  name="clientName"
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-amber-300">WhatsApp Phone *</label>
                <input
                  required
                  name="phone"
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-amber-300">Event Type *</label>
                  <select
                    name="eventType"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  >
                    <option value="jagran">Mata Ka Jagran</option>
                    <option value="sundarkand">Sundarkand Paath</option>
                    <option value="keertan">Khatu Shyam Keertan</option>
                    <option value="chowki">Mata Ki Chowki</option>
                    <option value="shiv">Shiv Charcha</option>
                    <option value="bhagwat">Bhagwat Katha</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-amber-300">Event Date *</label>
                  <input
                    type="date"
                    required
                    name="eventDate"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-amber-300">Time Slot *</label>
                <input
                  required
                  name="timeSlot"
                  defaultValue="Full Night (9:00 PM – 5:00 AM)"
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-amber-300">City *</label>
                  <input
                    required
                    name="city"
                    defaultValue="Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-amber-300">Venue Address *</label>
                  <input
                    required
                    name="venueAddress"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GALLERY ADD / EDIT                                */}
      {/* ========================================================= */}
      {galleryModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#180e08] rounded-2xl border border-amber-700/60 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
              <h3 className="font-serif font-bold text-base text-white">
                {galleryModal.mode === "add" ? "Add Photo / Video to Portfolio" : "Edit Portfolio Item"}
              </h3>
              <button
                onClick={() => setGalleryModal({ open: false, mode: "add" })}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                
                // Collect all form data including file upload
                const formData = new FormData(form);
                
                try {
                  const url = galleryModal.mode === "add" ? "/api/gallery" : `/api/gallery/${galleryModal.item?.id}`;
                  
                  // Use FormData directly - no need for Content-Type header, 
                  // browser will set multipart/form-data automatically
                  const res = await fetch(url, {
                    method: galleryModal.mode === "add" ? "POST" : "PUT",
                    body: formData,
                  });
                  const data = await res.json();
                  if (data.success) {
                    if (galleryModal.mode === "add") {
                      setGalleryList((prev) => [data.item, ...prev]);
                    } else {
                      setGalleryList((prev) =>
                        prev.map((g) => (g.id === galleryModal.item?.id ? data.item : g))
                      );
                    }
                    setGalleryModal({ open: false, mode: "add" });
                    showNotification("Gallery item saved successfully!");
                  }
                } catch {
                  alert("Failed to save gallery item");
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-amber-300">Title (English) *</label>
                <input
                  required
                  name="title"
                  defaultValue={galleryModal.item?.title || ""}
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-amber-300">Title (Hindi)</label>
                <input
                  name="titleHi"
                  defaultValue={galleryModal.item?.titleHi || ""}
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-amber-300">Category *</label>
                  <select
                    name="category"
                    defaultValue={galleryModal.item?.category || "jagran"}
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  >
                    <option value="jagran">Mata Ka Jagran</option>
                    <option value="sundarkand">Sundarkand Paath</option>
                    <option value="keertan">Khatu Shyam Keertan</option>
                    <option value="chowki">Mata Ki Chowki</option>
                    <option value="aarti">Maha Aarti</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-amber-300">Media Type *</label>
                  <select
                    name="category"
                    defaultValue={galleryModal.item?.category || "jagran"}
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  >
                    <option value="jagran">Mata Ka Jagran</option>
                    <option value="sundarkand">Sundarkand Paath</option>
                    <option value="keertan">Khatu Shyam Keertan</option>
                    <option value="chowki">Mata Ki Chowki</option>
                    <option value="aarti">Maha Aarti</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-amber-300">Media Type *</label>
                    <select
                      name="mediaType"
                      defaultValue={galleryModal.item?.mediaType || "image"}
                      className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                    >
                      <option value="image">Photo (Image)</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-amber-300">Upload File</label>
                    <input
                      type="file"
                      accept="image/*,video/*,video/mp4,video/quicktime"
                      name="mediaFile"
                      className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event: any) => {
                            const previewUrl = event.target.result;
                            const previewImg = document.getElementById('gallery-preview-img') as HTMLImageElement;
                            if (previewImg) {
                              previewImg.src = previewUrl;
                              document.getElementById('gallery-file-name')!.textContent = file.name;
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <p className="text-xs text-amber-400/60">
                      <span id="gallery-file-name">No file selected</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-amber-300 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Auto-Generated Media URL (Image / Video)
                </label>
                <div className="relative">
                  <input
                    readOnly
                    name="mediaUrl"
                    defaultValue={galleryModal.item?.mediaUrl || ""}
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-amber-300 text-xs font-mono"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-amber-500/60">
                    Auto-generated
                  </span>
                </div>
                <p className="text-[10px] text-amber-400/60">
                  URL is created dynamically from Title + Category + Date on submit.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-amber-300 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  Auto-Generated Thumbnail URL
                </label>
                <div className="relative">
                  <input
                    readOnly
                    name="thumbnailUrl"
                    defaultValue={galleryModal.item?.thumbnailUrl || ""}
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-amber-300 text-xs font-mono"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-amber-500/60">
                    Auto-generated
                  </span>
                </div>
                <p className="text-[10px] text-amber-400/60">
                  Thumbnail is derived from the same media URL.
                </p>
              </div>

              {/* Live Preview of Generated Image */}
              <div className="bg-[#221309] rounded-xl border border-amber-800/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                    Live Preview
                  </span>
                  <span className="text-[10px] text-amber-500/70">
                    {(galleryModal.item?.mediaType || "image") === "video" ? "Video Poster" : "Image"}
                  </span>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={galleryModal.item?.mediaUrl || `https://placehold.co/800x450/png?text=${encodeURIComponent(galleryModal.item?.title || "Preview")}&font=cinzel&bg=7c2d12&fc=f7eedf`}
                    alt={galleryModal.item?.title || "Preview"}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {(galleryModal.item?.mediaType || "image") === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-amber-300">Location</label>
                  <input
                    name="location"
                    defaultValue={galleryModal.item?.location || "Delhi"}
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-amber-300">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    defaultValue={galleryModal.item?.eventDate || ""}
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-amber-300">Description</label>
                <textarea
                  rows={2}
                  name="description"
                  defaultValue={galleryModal.item?.description || ""}
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold"
                >
                  Save Gallery Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: YOUTUBE ADD / EDIT                                */}
      {/* ========================================================= */}
      {youtubeModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#180e08] rounded-2xl border border-red-700/60 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
              <h3 className="font-serif font-bold text-base text-white">
                {youtubeModal.mode === "add" ? "Add YouTube Video" : "Edit YouTube Video"}
              </h3>
              <button
                onClick={() => setYoutubeModal({ open: false, mode: "add" })}
                className="text-amber-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const payload = {
                  url: (form.elements.namedItem("url") as HTMLInputElement).value,
                  title: (form.elements.namedItem("title") as HTMLInputElement).value,
                  titleHi: (form.elements.namedItem("titleHi") as HTMLInputElement).value,
                  category: (form.elements.namedItem("category") as HTMLSelectElement).value,
                  duration: (form.elements.namedItem("duration") as HTMLInputElement).value,
                  viewsCount: (form.elements.namedItem("viewsCount") as HTMLInputElement).value,
                };

                try {
                  const res = await fetch("/api/youtube", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (data.success) {
                    setYoutubeList((prev) => [data.video, ...prev]);
                    setYoutubeModal({ open: false, mode: "add" });
                    showNotification("YouTube video added successfully to stream!");
                  } else {
                    alert(data.error || "Failed to add video");
                  }
                } catch {
                  alert("Failed to add YouTube video");
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold text-amber-300">
                  YouTube Video URL or Video ID *
                </label>
                <input
                  required
                  name="url"
                  placeholder="https://www.youtube.com/watch?v=... or 11-char ID"
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-amber-300">Title (English)</label>
                <input
                  name="title"
                  placeholder="Leave empty to auto-fetch from YouTube"
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-amber-300">Title (Hindi)</label>
                <input
                  name="titleHi"
                  placeholder="उदा. सम्पूर्ण सुंदरकांड पाठ"
                  className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-amber-300">Category</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  >
                    <option value="sundarkand">Sundarkand</option>
                    <option value="jagran">Mata Jagran</option>
                    <option value="keertan">Shyam Keertan</option>
                    <option value="chowki">Mata Ki Chowki</option>
                    <option value="aarti">Maha Aarti</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-amber-300">Duration</label>
                  <input
                    name="duration"
                    defaultValue="25:00"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-amber-300">Views</label>
                  <input
                    name="viewsCount"
                    defaultValue="50K+"
                    className="w-full px-3 py-2 rounded-xl bg-[#221309] border border-amber-800 text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold"
                >
                  Add Video to Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
