/*
# Create trips table for partner coordination workflow

1. New Tables
- `trips` — stores confirmed trip records that link a reservation to assigned partners (host, driver, guide).
  - `id` (uuid, primary key)
  - `reservation_id` (text, the reservation reference like RES-2401)
  - `client_name` (text)
  - `service_title` (text)
  - `service_id` (text)
  - `trip_date` (date)
  - `people` (int)
  - `total_price` (numeric)
  - `host_partner_id` (text, nullable — the assigned host partner)
  - `driver_partner_id` (text, nullable — the assigned driver partner)
  - `guide_partner_id` (text, nullable — the assigned guide partner)
  - `status` (text: pending, confirmed, in_progress, completed)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `trips`.
- Allow anon + authenticated full CRUD since this is a staff operations tool (single-tenant, no per-user isolation required for this phase).
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id text NOT NULL,
  client_name text NOT NULL,
  service_title text NOT NULL,
  service_id text,
  trip_date date,
  people int DEFAULT 1,
  total_price numeric DEFAULT 0,
  host_partner_id text,
  driver_partner_id text,
  guide_partner_id text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trips" ON trips;
CREATE POLICY "anon_select_trips" ON trips FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_trips" ON trips;
CREATE POLICY "anon_insert_trips" ON trips FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_trips" ON trips;
CREATE POLICY "anon_update_trips" ON trips FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_trips" ON trips;
CREATE POLICY "anon_delete_trips" ON trips FOR DELETE
TO anon, authenticated USING (true);
