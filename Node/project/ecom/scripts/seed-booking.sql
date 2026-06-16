-- Seed data for booking_db so you can test the booking flow.
-- Run against the booking database, e.g. via pgAdmin (booking_db) or:
--   docker exec -i ecom-postgres psql -U ecom -d booking_db < scripts/seed-booking.sql

INSERT INTO event_inventory (id, name, "startsAt", "createdAt")
VALUES ('11111111-1111-1111-1111-111111111111', 'Coldplay Live 2026', NOW() + INTERVAL '30 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 10 seats A1..A10, all AVAILABLE
INSERT INTO seats (id, label, status, version, "inventoryId")
SELECT
  gen_random_uuid(),
  'A' || g,
  'AVAILABLE',
  0,
  '11111111-1111-1111-1111-111111111111'
FROM generate_series(1, 10) AS g
ON CONFLICT ("inventoryId", label) DO NOTHING;

-- View seat ids to use in createBooking:
--   SELECT id, label, status FROM seats ORDER BY label;
