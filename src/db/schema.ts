import { pgTable, serial, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingRef: varchar("booking_ref", { length: 20 }).notNull().unique(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),
  eventType: varchar("event_type", { length: 100 }).notNull(), // 'jagran', 'sundarkand', 'keertan', 'chowki', 'shiv_charcha', 'bhagwat'
  eventDate: varchar("event_date", { length: 20 }).notNull(), // YYYY-MM-DD
  timeSlot: varchar("time_slot", { length: 100 }).notNull(), // e.g. "Evening (7:00 PM - 11:00 PM)", "Full Night (9:00 PM - 5:00 AM)"
  venueAddress: text("venue_address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 20 }),
  estimatedGuests: varchar("estimated_guests", { length: 50 }),
  specialRequests: text("special_requests"),
  status: varchar("status", { length: 30 }).default("pending").notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
  adminNotes: text("admin_notes"),
  whatsappNotified: boolean("whatsapp_notified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleHi: varchar("title_hi", { length: 255 }).notNull(),
  description: text("description"),
  descriptionHi: text("description_hi"),
  category: varchar("category", { length: 50 }).notNull(), // 'jagran', 'sundarkand', 'keertan', 'chowki', 'aarti'
  mediaType: varchar("media_type", { length: 20 }).default("image").notNull(), // 'image' or 'video'
  mediaUrl: text("media_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  eventDate: varchar("event_date", { length: 30 }),
  location: varchar("location", { length: 255 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const youtubeVideos = pgTable("youtube_videos", {
  id: serial("id").primaryKey(),
  youtubeId: varchar("youtube_id", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  titleHi: varchar("title_hi", { length: 255 }),
  description: text("description"),
  category: varchar("category", { length: 50 }).default("keertan").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: varchar("duration", { length: 30 }).default("15:00"),
  viewsCount: varchar("views_count", { length: 50 }).default("10K+"),
  publishedAt: varchar("published_at", { length: 50 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
