-- Update slideshow table schema to make title, description, and link optional
-- Run this in Supabase SQL Editor

-- Make title, description, and link nullable (optional)
ALTER TABLE slideshow 
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN description DROP NOT NULL,
ALTER COLUMN link DROP NOT NULL;

-- Set default values for existing rows if needed
UPDATE slideshow 
SET 
  title = COALESCE(title, ''),
  description = COALESCE(description, ''),
  link = COALESCE(link, '')
WHERE title IS NULL OR description IS NULL OR link IS NULL;
