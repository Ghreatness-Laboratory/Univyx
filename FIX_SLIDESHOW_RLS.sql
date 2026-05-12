-- Fix Row Level Security for slideshow table
-- Run this in Supabase SQL Editor

-- Enable RLS on slideshow table (if not already enabled)
ALTER TABLE slideshow ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access to slideshow" ON slideshow;
DROP POLICY IF EXISTS "Allow authenticated users to manage slideshow" ON slideshow;

-- Allow anyone to read active slides (for public homepage)
CREATE POLICY "Allow public read access to slideshow"
ON slideshow
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert, update, delete slides (for admin)
CREATE POLICY "Allow authenticated users to manage slideshow"
ON slideshow
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
