-- Fix RLS Policies for VetOne.AI Landing Page
-- This allows the anon key (used by backend) to insert data

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can insert to waitlist" ON waitlist;

-- Recreate with correct permissions
-- Allow anon role (backend API) to INSERT
CREATE POLICY "Allow anon to insert contacts"
ON contacts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow anon to insert waitlist"
ON waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also allow backend to read for stats
CREATE POLICY "Allow anon to read contacts"
ON contacts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow anon to read waitlist"
ON waitlist FOR SELECT
TO anon, authenticated
USING (true);
