import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getPool } from "../db";

async function main() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      booking_ref VARCHAR(20) NOT NULL UNIQUE,
      client_name VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      email VARCHAR(255),
      event_type VARCHAR(100) NOT NULL,
      event_date VARCHAR(20) NOT NULL,
      time_slot VARCHAR(100) NOT NULL,
      venue_address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      pincode VARCHAR(20),
      estimated_guests VARCHAR(50),
      special_requests TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      admin_notes TEXT,
      whatsapp_notified BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS gallery_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      title_hi VARCHAR(255) NOT NULL,
      description TEXT,
      description_hi TEXT,
      category VARCHAR(50) NOT NULL,
      media_type VARCHAR(20) NOT NULL DEFAULT 'image',
      media_url TEXT NOT NULL,
      thumbnail_url TEXT,
      event_date VARCHAR(30),
      location VARCHAR(255),
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS youtube_videos (
      id SERIAL PRIMARY KEY,
      youtube_id VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      title_hi VARCHAR(255),
      description TEXT,
      category VARCHAR(50) NOT NULL DEFAULT 'keertan',
      thumbnail_url TEXT NOT NULL,
      duration VARCHAR(30) DEFAULT '15:00',
      views_count VARCHAR(50) DEFAULT '10K+',
      published_at VARCHAR(50),
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS bookings_event_date_idx ON bookings(event_date);
    CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
    CREATE INDEX IF NOT EXISTS gallery_category_idx ON gallery_items(category);
    CREATE INDEX IF NOT EXISTS youtube_category_idx ON youtube_videos(category);
  `);

  await pool.end();
  console.log("Database migration completed.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
