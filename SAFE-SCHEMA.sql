-- =====================================================
-- UNIVYX - SAFE SCHEMA (Only Add Missing Tables)
-- This will NOT modify your existing tables
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ONLY CREATE MISSING TABLES
-- =====================================================

-- Gaming Events (if doesn't exist)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Registrations
CREATE TABLE IF NOT EXISTS public.gaming_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gaming_event_id UUID REFERENCES public.gaming_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  team_name VARCHAR(255),
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
  university_id INTEGER,
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

-- Programs (if doesn't exist)
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id INTEGER,
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
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_gaming_events_date ON public.gaming_events(date DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_wiki_slug ON public.gaming_wiki(slug);
CREATE INDEX IF NOT EXISTS idx_programs_university ON public.programs(university_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE public.gaming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_of_fame_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_wiki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read gaming_events" ON public.gaming_events;
DROP POLICY IF EXISTS "Public read hall_of_fame" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Public read gaming_wiki" ON public.gaming_wiki;
DROP POLICY IF EXISTS "Public read programs" ON public.programs;

-- Create public read policies
CREATE POLICY "Public read gaming_events" ON public.gaming_events FOR SELECT USING (true);
CREATE POLICY "Public read hall_of_fame" ON public.hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Public read gaming_wiki" ON public.gaming_wiki FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample gaming events
INSERT INTO public.gaming_events (title, description, game_name, event_type, date, location, prize_pool, max_participants)
VALUES 
  ('FIFA 24 Championship', 'Annual FIFA tournament with amazing prizes', 'FIFA 24', 'tournament', NOW() + INTERVAL '7 days', 'Gaming Arena', '$500', 32),
  ('Valorant Showdown', 'Competitive Valorant 5v5 tournament', 'Valorant', 'tournament', NOW() + INTERVAL '14 days', 'Esports Center', '$1000', 40),
  ('League of Legends Clash', 'Team-based LoL competition', 'League of Legends', 'competition', NOW() + INTERVAL '21 days', 'Online', '$750', 50),
  ('CS:GO Tournament', 'Counter-Strike competitive event', 'CS:GO', 'tournament', NOW() + INTERVAL '28 days', 'Gaming Arena', '$2000', 64),
  ('Fortnite Battle Royale', 'Solo Fortnite competition', 'Fortnite', 'competition', NOW() + INTERVAL '35 days', 'Online', '$1500', 100)
ON CONFLICT DO NOTHING;

-- Insert sample Hall of Fame players
INSERT INTO public.hall_of_fame_players (name, gamertag, university, bio, favorite_game, rank, total_wins, total_tournaments, is_featured, display_order)
VALUES 
  ('John Smith', 'ProGamer123', 'Tech University', 'Champion of multiple tournaments', 'League of Legends', 'Diamond', 45, 60, true, 1),
  ('Sarah Johnson', 'ElitePlayer', 'State College', 'Top Valorant player in the region', 'Valorant', 'Radiant', 38, 50, true, 2),
  ('Mike Chen', 'ChampionX', 'City University', 'FIFA master and tournament winner', 'FIFA 24', 'Elite', 52, 70, true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample gaming wiki entries
INSERT INTO public.gaming_wiki (title, slug, category, content, summary, is_published)
VALUES 
  ('Getting Started with Esports', 'getting-started-esports', 'Guide', 'Complete guide to starting your esports journey...', 'Learn the basics of competitive gaming', true),
  ('Tournament Rules and Regulations', 'tournament-rules', 'Rules', 'Official rules for all gaming tournaments...', 'Understand tournament guidelines', true),
  ('Top Gaming Strategies', 'top-gaming-strategies', 'Strategy', 'Pro tips and strategies for competitive gaming...', 'Improve your gameplay', true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================

SELECT 'Safe schema applied successfully! Only missing tables were added.' AS status;
