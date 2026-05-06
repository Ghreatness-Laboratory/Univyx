-- =============================================
-- UNIVYX EXPANSION SCHEMA
-- Jobs Platform, Skills Marketplace, Store Enhancements
-- =============================================

-- Jobs Table (CivilProviding integration)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  type TEXT NOT NULL CHECK (type IN ('job', 'siwes', 'nysc', 'internship')),
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_verified BOOLEAN DEFAULT false,
  pay_record TEXT,
  application_url TEXT,
  application_email TEXT,
  university_id INTEGER REFERENCES universities(id),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  deadline TIMESTAMPTZ,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Skills Table (Student skill listings)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC,
  is_free BOOLEAN DEFAULT false,
  image TEXT,
  portfolio_url TEXT,
  university TEXT,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Reviews Table
CREATE TABLE IF NOT EXISTS skill_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_id, reviewer_id)
);

-- Add new columns to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Store Reviews Table
CREATE TABLE IF NOT EXISTS store_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, reviewer_id)
);

-- Homepage Slideshow Table (admin-managed)
CREATE TABLE IF NOT EXISTS slideshow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings Table (admin-managed global content)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'image', 'json', 'boolean', 'number')),
  label TEXT,
  section TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Popups Table (admin-managed)
CREATE TABLE IF NOT EXISTS popups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  trigger TEXT DEFAULT 'onload' CHECK (trigger IN ('onload', 'exit', 'scroll', 'timed')),
  delay_seconds INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE slideshow ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Public can read active jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage jobs" ON jobs FOR ALL USING (auth.role() = 'authenticated');

-- Job applications policies
CREATE POLICY "Users can manage own applications" ON job_applications FOR ALL USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Public can read active skills" ON skills FOR SELECT USING (is_active = true);
CREATE POLICY "Users can manage own skills" ON skills FOR ALL USING (auth.uid() = user_id);

-- Skill reviews policies
CREATE POLICY "Public can read skill reviews" ON skill_reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage own skill reviews" ON skill_reviews FOR ALL USING (auth.uid() = reviewer_id);

-- Store reviews policies
CREATE POLICY "Public can read store reviews" ON store_reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage own store reviews" ON store_reviews FOR ALL USING (auth.uid() = reviewer_id);

-- Slideshow policies
CREATE POLICY "Public can read active slideshow" ON slideshow FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage slideshow" ON slideshow FOR ALL USING (auth.role() = 'authenticated');

-- Site settings policies
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Popups policies
CREATE POLICY "Public can read active popups" ON popups FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated can manage popups" ON popups FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_university ON jobs(university_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_user ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_university ON stores(university);

-- Initial site settings
INSERT INTO site_settings (key, value, type, label, section) VALUES
  ('hero_title', 'Revolutionizing Student Life', 'text', 'Hero Title', 'hero'),
  ('hero_subtitle', 'Connect, learn, and thrive in a vibrant community designed for private university students worldwide.', 'text', 'Hero Subtitle', 'hero'),
  ('hero_cta_text', 'Get Started Free', 'text', 'Hero CTA Button Text', 'hero'),
  ('jobs_hero_title', 'Your Career Starts Here', 'text', 'Jobs Hero Title', 'jobs'),
  ('jobs_hero_subtitle', 'Verified jobs, SIWES placements, NYSC postings and internships — only from employers with proven pay records.', 'text', 'Jobs Hero Subtitle', 'jobs'),
  ('store_hero_title', 'Discover Great Deals for Students', 'text', 'Store Hero Title', 'store'),
  ('entertainment_hero_title', 'Entertainment Redefined', 'text', 'Entertainment Hero Title', 'entertainment'),
  ('gaming_hero_title', 'Unleash Your Gaming Potential', 'text', 'Gaming Hero Title', 'gaming')
ON CONFLICT (key) DO NOTHING;
