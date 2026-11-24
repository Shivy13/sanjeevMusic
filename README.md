## Devotional Event Booking Backend

This is a Next.js/PostgreSQL backend for bookings, gallery content, YouTube content, WhatsApp notifications, admin authentication, and site settings.

### Setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to a PostgreSQL database.
3. Set a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
4. Run `npm run db:setup` to create tables and seed initial data.
5. Run `npm run dev`.

### Database commands

- `npm run db:migrate` creates/updates the database tables.
- `npm run db:seed` inserts default settings and sample portfolio content.
- `npm run db:setup` runs migration and seed in sequence.

### API routes

- `GET /api/bookings?view=public` - public calendar data
- `POST /api/bookings` - create a public booking
- `GET/PUT/DELETE /api/bookings/:id` - authenticated admin booking operations
- `GET /api/gallery` - public gallery list
- `POST/PUT/DELETE /api/gallery/:id` - authenticated gallery operations
- `GET /api/youtube` - public YouTube portfolio
- `POST/PUT/DELETE /api/youtube/:id` - authenticated YouTube operations
- `GET/POST /api/settings` - public ticker/admin settings
- `POST /api/whatsapp/notify` - authenticated WhatsApp notification URL
- `POST /api/youtube/sync` - authenticated YouTube sync
- `GET /api/health` - database health check