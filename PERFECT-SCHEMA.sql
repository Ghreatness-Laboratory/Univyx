-- =====================================================
-- UNIVYX - PERFECT SCHEMA (Based on Your Actual Database)
-- Only adds the 3 missing tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE MISSING TABLES
-- =====================================================

-- 1. Hall of Fame Players
CREATE TABLE IF NOT EXISTS public.hall_of_fame_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gamertag TEXT,
  university TEXT,
  bio TEXT,
  avatar TEXT,
  favorite_game TEXT,
  rank TEXT,
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

-- 2. Gaming Wiki
CREATE TABLE IF NOT EXISTS public.gaming_wiki (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  content TEXT NOT NULL,
  summary TEXT,
  image TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Programs
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id INTEGER REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_type TEXT,
  department TEXT,
  duration_years INTEGER,
  description TEXT,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_hall_of_fame_display_order ON public.hall_of_fame_players(display_order);
CREATE INDEX IF NOT EXISTS idx_gaming_wiki_slug ON public.gaming_wiki(slug);
CREATE INDEX IF NOT EXISTS idx_gaming_wiki_published ON public.gaming_wiki(is_published);
CREATE INDEX IF NOT EXISTS idx_programs_university ON public.programs(university_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.hall_of_fame_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_wiki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Public read hall_of_fame" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Public read gaming_wiki" ON public.gaming_wiki;
DROP POLICY IF EXISTS "Public read programs" ON public.programs;

-- Create public read policies
CREATE POLICY "Public read hall_of_fame" ON public.hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Public read gaming_wiki" ON public.gaming_wiki FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);

-- =====================================================
-- SAMPLE DATA (Using correct column names)
-- =====================================================

-- Sample Hall of Fame Players
INSERT INTO public.hall_of_fame_players (name, gamertag, university, bio, favorite_game, rank, total_wins, total_tournaments, is_featured, display_order)
VALUES 
  ('John Smith', 'ProGamer123', 'Tech University', 'Champion of multiple tournaments', 'League of Legends', 'Diamond', 45, 60, true, 1),
  ('Sarah Johnson', 'ElitePlayer', 'State College', 'Top Valorant player in the region', 'Valorant', 'Radiant', 38, 50, true, 2),
  ('Mike Chen', 'ChampionX', 'City University', 'FIFA master and tournament winner', 'FIFA 24', 'Elite', 52, 70, true, 3),
  ('Emma Davis', 'QueenGamer', 'Metro University', 'CS:GO expert and team captain', 'CS:GO', 'Global Elite', 41, 55, false, 4),
  ('Alex Rodriguez', 'SpeedRunner', 'Central College', 'Fortnite champion with multiple wins', 'Fortnite', 'Champion', 35, 45, false, 5)
ON CONFLICT DO NOTHING;

-- Sample Gaming Wiki Entries
INSERT INTO public.gaming_wiki (title, slug, category, content, summary, is_published)
VALUES 
  ('Getting Started with Esports', 'getting-started-esports', 'Guide', 
   'Complete guide to starting your esports journey. Learn about different games, finding your niche, and joining tournaments...', 
   'Learn the basics of competitive gaming', true),
  
  ('Tournament Rules and Regulations', 'tournament-rules', 'Rules', 
   'Official rules for all gaming tournaments. Understand fair play, conduct guidelines, and competition standards...', 
   'Understand tournament guidelines', true),
  
  ('Top Gaming Strategies', 'top-gaming-strategies', 'Strategy', 
   'Pro tips and strategies for competitive gaming. Master game mechanics, team coordination, and winning tactics...', 
   'Improve your gameplay', true),
  
  ('Building Your Gaming Setup', 'gaming-setup-guide', 'Hardware', 
   'Essential guide to building the perfect gaming setup. From monitors to peripherals, get the competitive edge...', 
   'Hardware recommendations for gamers', true),
  
  ('Mental Health in Esports', 'mental-health-esports', 'Wellness', 
   'Maintaining mental health while competing. Learn about stress management, work-life balance, and staying healthy...', 
   'Stay healthy while gaming competitively', true)
ON CONFLICT (slug) DO NOTHING;

-- Sample Programs (for universities)
INSERT INTO public.programs (name, degree_type, department, duration_years, description, requirements)
VALUES 
  ('Computer Science', 'Bachelor', 'Engineering', 4, 'Comprehensive computer science program covering software development, algorithms, and systems.', 'High school diploma, Math proficiency'),
  ('Business Administration', 'Bachelor', 'Business', 4, 'Learn business fundamentals, management, and entrepreneurship.', 'High school diploma'),
  ('Electrical Engineering', 'Bachelor', 'Engineering', 4, 'Study electrical systems, circuits, and modern technology.', 'High school diploma, Physics and Math'),
  ('Data Science', 'Master', 'Computer Science', 2, 'Advanced data analysis, machine learning, and AI.', 'Bachelor degree in related field'),
  ('MBA', 'Master', 'Business', 2, 'Master of Business Administration for leadership roles.', 'Bachelor degree, Work experience preferred'),
  ('Graphic Design', 'Bachelor', 'Arts', 4, 'Creative design, digital media, and visual communication.', 'High school diploma, Portfolio'),
  ('Mechanical Engineering', 'Bachelor', 'Engineering', 4, 'Design and analysis of mechanical systems.', 'High school diploma, Math and Physics'),
  ('Psychology', 'Bachelor', 'Social Sciences', 4, 'Study of human behavior and mental processes.', 'High school diploma'),
  ('Nursing', 'Bachelor', 'Health Sciences', 4, 'Healthcare and patient care training.', 'High school diploma, Biology'),
  ('Marketing', 'Bachelor', 'Business', 4, 'Digital marketing, branding, and consumer behavior.', 'High school diploma')
ON CONFLICT DO NOTHING;

-- Sample Gaming Events (using correct column names: game, not game_name)
INSERT INTO public.gaming_events (title, description, game, event_type, date, location, max_participants)
VALUES 
  ('FIFA 24 Championship', 'Annual FIFA tournament with amazing prizes', 'FIFA 24', 'tournament', NOW() + INTERVAL '7 days', 'Gaming Arena', 32),
  ('Valorant Showdown', 'Competitive Valorant 5v5 tournament', 'Valorant', 'tournament', NOW() + INTERVAL '14 days', 'Esports Center', 40),
  ('League of Legends Clash', 'Team-based LoL competition', 'League of Legends', 'competition', NOW() + INTERVAL '21 days', 'Online', 50),
  ('CS:GO Tournament', 'Counter-Strike competitive event', 'CS:GO', 'tournament', NOW() + INTERVAL '28 days', 'Gaming Arena', 64),
  ('Fortnite Battle Royale', 'Solo Fortnite competition', 'Fortnite', 'competition', NOW() + INTERVAL '35 days', 'Online', 100)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================

SELECT 'Perfect schema applied successfully! All missing tables created with sample data.' AS status;
