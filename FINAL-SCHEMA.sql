-- =====================================================
-- UNIVYX COMPLETE DATABASE SCHEMA - CLEAN VERSION
-- This schema matches your existing structure and adds missing tables
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLES (if you want a fresh start)
-- Comment out this section if you want to keep existing data
-- =====================================================

-- DROP TABLE IF EXISTS public.gaming_registrations CASCADE;
-- DROP TABLE IF EXISTS public.gaming_events CASCADE;
-- DROP TABLE IF EXISTS public.tournaments CASCADE;
-- DROP TABLE IF EXISTS public.programs CASCADE;
-- DROP TABLE IF EXISTS public.comments CASCADE;
-- DROP TABLE IF EXISTS public.bookmarks CASCADE;
-- DROP TABLE IF EXISTS public.likes CASCADE;
-- DROP TABLE IF EXISTS public.job_applications CASCADE;
-- DROP TABLE IF EXISTS public.jobs CASCADE;
-- DROP TABLE IF EXISTS public.store_reviews CASCADE;
-- DROP TABLE IF EXISTS public.store_items CASCADE;
-- DROP TABLE IF EXISTS public.stores CASCADE;
-- DROP TABLE IF EXISTS public.skills CASCADE;
-- DROP TABLE IF EXISTS public.news CASCADE;
-- DROP TABLE IF EXISTS public.events CASCADE;
-- DROP TABLE IF EXISTS public.articles CASCADE;
-- DROP TABLE IF EXISTS public.universities CASCADE;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Universities (INTEGER ID - matches your existing structure)
CREATE TABLE IF NOT EXISTS public.universities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  abbreviation VARCHAR(50),
  location VARCHAR(255),
  description TEXT,
  logo TEXT,
  website VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID,
  image TEXT,
  category VARCHAR(100),
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events (Entertainment ONLY - not gaming)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image TEXT,
  category VARCHAR(100),
  organizer_id UUID,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID,
  image TEXT,
  category VARCHAR(100),
  source VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GAMING SECTION (Separate from Entertainment)
-- =====================================================

-- Gaming Events (Tournaments, Competitions - SEPARATE from entertainment events)
CREATE TABLE IF NOT EXISTS public.gaming_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  game_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image TEXT,
  prize_pool VARCHAR(100),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  rules TEXT,
  organizer_id UUID,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournaments
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  gaming_event_id UUID REFERENCES public.gaming_events(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  prize_pool DECIMAL(10, 2),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  bracket_type VARCHAR(50),
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER,
  winner_id UUID,
  status VARCHAR(50) DEFAULT 'upcoming',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboards
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  entries JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Registrations
CREATE TABLE IF NOT EXISTS public.gaming_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gaming_event_id UUID REFERENCES public.gaming_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  team_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gaming_event_id, user_id)
);

-- Hall of Fame Players
CREATE TABLE IF NOT EXISTS public.hall_of_fame_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  gamertag VARCHAR(100),
  university VARCHAR(255),
  bio TEXT,
  avatar TEXT,
  favorite_game VARCHAR(255),
  rank VARCHAR(50),
  total_wins INTEGER DEFAULT 0,
  total_tournaments INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  achievements TEXT[],
  social_links JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Wiki
CREATE TABLE IF NOT EXISTS public.gaming_wiki (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  content TEXT NOT NULL,
  summary TEXT,
  image TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Teams
CREATE TABLE IF NOT EXISTS public.gaming_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  tag VARCHAR(50),
  logo TEXT,
  description TEXT,
  captain_id UUID,
  university_id INTEGER REFERENCES public.universities(id) ON DELETE SET NULL,
  rank INTEGER,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Records
CREATE TABLE IF NOT EXISTS public.gaming_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  player_name VARCHAR(255),
  game VARCHAR(255),
  record_value VARCHAR(100),
  date_achieved DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Highlights
CREATE TABLE IF NOT EXISTS public.gaming_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail TEXT,
  game VARCHAR(255),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACADEMICS SECTION
-- =====================================================

-- Programs (Fixed foreign key to match INTEGER id)
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id INTEGER REFERENCES public.universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  degree_type VARCHAR(100),
  department VARCHAR(255),
  duration_years INTEGER,
  description TEXT,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STORE SECTION
-- =====================================================

-- Stores
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo TEXT,
  whatsapp VARCHAR(50),
  instagram VARCHAR(100),
  twitter VARCHAR(100),
  facebook VARCHAR(100),
  university INTEGER REFERENCES public.universities(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  achievements TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Items
CREATE TABLE IF NOT EXISTS public.store_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image TEXT,
  store UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Reviews
CREATE TABLE IF NOT EXISTS public.store_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id, reviewer_id)
);

-- =====================================================
-- JOBS & SKILLS SECTION
-- =====================================================

-- Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  type VARCHAR(50),
  location VARCHAR(255),
  is_remote BOOLEAN DEFAULT FALSE,
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  salary_verified BOOLEAN DEFAULT FALSE,
  pay_record TEXT,
  application_url TEXT,
  application_email VARCHAR(255),
  deadline DATE,
  university_id INTEGER REFERENCES public.universities(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2),
  is_free BOOLEAN DEFAULT FALSE,
  portfolio_url TEXT,
  university VARCHAR(255),
  image TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INTERACTION TABLES
-- =====================================================

-- Likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  model_name VARCHAR(50) NOT NULL,
  object_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, model_name, object_id)
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  model_name VARCHAR(50) NOT NULL,
  object_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, model_name, object_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  model_name VARCHAR(50) NOT NULL,
  object_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HOMEPAGE & MISC TABLES
-- =====================================================

-- Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  image TEXT,
  "order" INTEGER DEFAULT 0,
  social JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  website VARCHAR(255),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  description TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage Stats
CREATE TABLE IF NOT EXISTS public.homepage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  students INTEGER DEFAULT 0,
  universities INTEGER DEFAULT 0,
  events INTEGER DEFAULT 0,
  tournaments INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slideshow
CREATE TABLE IF NOT EXISTS public.slideshow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  section VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Popups
CREATE TABLE IF NOT EXISTS public.popups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  cta_text VARCHAR(100),
  cta_link VARCHAR(255),
  trigger VARCHAR(50) DEFAULT 'onload',
  delay_seconds INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_articles_created ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_events_date ON public.gaming_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_events_status ON public.gaming_events(status);
CREATE INDEX IF NOT EXISTS idx_news_created ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tournaments_start ON public.tournaments(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_university ON public.jobs(university_id);
CREATE INDEX IF NOT EXISTS idx_likes_content ON public.likes(model_name, object_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_content ON public.bookmarks(model_name, object_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON public.comments(model_name, object_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read articles" ON public.articles;
DROP POLICY IF EXISTS "Public read events" ON public.events;
DROP POLICY IF EXISTS "Public read gaming_events" ON public.gaming_events;
DROP POLICY IF EXISTS "Public read news" ON public.news;
DROP POLICY IF EXISTS "Public read stores" ON public.stores;
DROP POLICY IF EXISTS "Public read store_items" ON public.store_items;
DROP POLICY IF EXISTS "Public read jobs" ON public.jobs;
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
DROP POLICY IF EXISTS "Public read universities" ON public.universities;
DROP POLICY IF EXISTS "Public read programs" ON public.programs;
DROP POLICY IF EXISTS "Public read tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Public read leaderboards" ON public.leaderboards;
DROP POLICY IF EXISTS "Public read hall_of_fame" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Public read gaming_wiki" ON public.gaming_wiki;
DROP POLICY IF EXISTS "Users manage own likes" ON public.likes;
DROP POLICY IF EXISTS "Users manage own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users create comments" ON public.comments;
DROP POLICY IF EXISTS "Users update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users delete own comments" ON public.comments;
DROP POLICY IF EXISTS "Public read comments" ON public.comments;

-- Public read access for content
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read gaming_events" ON public.gaming_events FOR SELECT USING (true);
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public read store_items" ON public.store_items FOR SELECT USING (true);
CREATE POLICY "Public read jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public read leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Public read hall_of_fame" ON public.hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Public read gaming_wiki" ON public.gaming_wiki FOR SELECT USING (true);

-- User-specific access for interactions
CREATE POLICY "Users manage own likes" ON public.likes FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users update own comments" ON public.comments FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users delete own comments" ON public.comments FOR DELETE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample gaming events
INSERT INTO public.gaming_events (title, description, game_name, event_type, date, location, prize_pool, max_participants, status)
VALUES 
  ('FIFA 24 Championship', 'Annual FIFA tournament with amazing prizes', 'FIFA 24', 'tournament', NOW() + INTERVAL '7 days', 'Gaming Arena', '$500', 32, 'upcoming'),
  ('Valorant Showdown', 'Competitive Valorant 5v5 tournament', 'Valorant', 'tournament', NOW() + INTERVAL '14 days', 'Esports Center', '$1000', 40, 'upcoming'),
  ('League of Legends Clash', 'Team-based LoL competition', 'League of Legends', 'competition', NOW() + INTERVAL '21 days', 'Online', '$750', 50, 'upcoming')
ON CONFLICT DO NOTHING;

-- Insert sample entertainment events (different from gaming)
INSERT INTO public.events (title, description, date, location, category)
VALUES 
  ('Spring Music Festival', 'Annual music festival featuring local bands', NOW() + INTERVAL '10 days', 'Main Campus Quad', 'Music'),
  ('Tech Talk Series', 'Industry leaders discuss latest tech trends', NOW() + INTERVAL '15 days', 'Auditorium Hall', 'Technology'),
  ('Art Exhibition', 'Student art showcase and gallery opening', NOW() + INTERVAL '20 days', 'Art Building', 'Arts')
ON CONFLICT DO NOTHING;

-- Insert homepage stats
INSERT INTO public.homepage_stats (students, universities, events, tournaments)
VALUES (5000, 10, 50, 25)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gaming_events_updated_at ON public.gaming_events;
CREATE TRIGGER update_gaming_events_updated_at BEFORE UPDATE ON public.gaming_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_universities_updated_at ON public.universities;
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON public.universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Database is ready
-- =====================================================

SELECT 'Database schema created successfully!' AS status;
