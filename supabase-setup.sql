-- VetOne.AI Supabase Database Setup
-- Execute this SQL in your Supabase SQL Editor

-- =====================================================
-- LANDING PAGE TABLES
-- =====================================================

-- Table: contacts
-- Stores contact form submissions from landing page
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: waitlist
-- Stores "Testar Grátis" form submissions
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_submitted_at ON contacts(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_submitted_at ON waitlist(submitted_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to INSERT into contacts
CREATE POLICY "Anyone can insert contacts"
ON contacts FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to SELECT their own contacts
CREATE POLICY "Service role can view all contacts"
ON contacts FOR SELECT
TO service_role
USING (true);

-- Policy: Allow anonymous users to INSERT into waitlist
CREATE POLICY "Anyone can insert to waitlist"
ON waitlist FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow authenticated users to SELECT waitlist
CREATE POLICY "Service role can view all waitlist"
ON waitlist FOR SELECT
TO service_role
USING (true);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE contacts IS 'Landing page contact form submissions';
COMMENT ON TABLE waitlist IS 'Landing page "Testar Grátis" waitlist signups';

COMMENT ON COLUMN contacts.status IS 'Status: new, contacted, resolved';
COMMENT ON COLUMN waitlist.status IS 'Status: pending, approved, invited, activated';

-- =====================================================
-- SAMPLE QUERIES (For reference, don't execute)
-- =====================================================

-- View all contacts:
-- SELECT * FROM contacts ORDER BY submitted_at DESC;

-- View all waitlist entries:
-- SELECT * FROM waitlist ORDER BY submitted_at DESC;

-- Count pending waitlist entries:
-- SELECT COUNT(*) FROM waitlist WHERE status = 'pending';

-- Find contact by email:
-- SELECT * FROM contacts WHERE email = 'user@example.com';
