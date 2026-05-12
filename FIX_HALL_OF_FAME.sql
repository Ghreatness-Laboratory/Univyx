-- =====================================================
-- FIX HALL OF FAME PLAYERS TABLE
-- =====================================================

-- Drop and recreate the table with correct schema
DROP TABLE IF EXISTS public.hall_of_fame_players CASCADE;

-- Create hall_of_fame_players table with ALL correct columns
CREATE TABLE public.hall_of_fame_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gamertag TEXT,
  university TEXT,
  bio TEXT,
  avatar TEXT,
  favorite_game TEXT,
  rank INTEGER DEFAULT 100 CHECK (rank >= 1 AND rank <= 100),
  total_mvps INTEGER DEFAULT 0,
  total_championships INTEGER DEFAULT 0,
  total_tournaments INTEGER DEFAULT 0,
  experience TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  achievements TEXT[],
  social_links JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_hall_of_fame_display_order ON public.hall_of_fame_players(display_order);
CREATE INDEX idx_hall_of_fame_rank ON public.hall_of_fame_players(rank);

-- Enable RLS
ALTER TABLE public.hall_of_fame_players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read hall_of_fame" ON public.hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Authenticated insert hall_of_fame" ON public.hall_of_fame_players FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update hall_of_fame" ON public.hall_of_fame_players FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete hall_of_fame" ON public.hall_of_fame_players FOR DELETE TO authenticated USING (true);

SELECT 'Hall of Fame table fixed successfully with experience column!' AS status;
