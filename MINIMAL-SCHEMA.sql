-- =====================================================
-- UNIVYX - MINIMAL SAFE SCHEMA
-- Only creates tables that don't exist
-- NO sample data, NO modifications to existing tables
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE ONLY MISSING TABLES
-- =====================================================

-- Hall of Fame Players (if doesn't exist)
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

-- Gaming Wiki (if doesn't exist)
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
-- ENABLE RLS ON NEW TABLES
-- =====================================================

ALTER TABLE public.hall_of_fame_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_wiki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Public read hall_of_fame" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Public read gaming_wiki" ON public.gaming_wiki;
DROP POLICY IF EXISTS "Public read programs" ON public.programs;

CREATE POLICY "Public read hall_of_fame" ON public.hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Public read gaming_wiki" ON public.gaming_wiki FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON public.programs FOR SELECT USING (true);

-- =====================================================
-- DONE!
-- =====================================================

SELECT 'Minimal schema applied successfully!' AS status;
