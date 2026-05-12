-- =====================================================
-- FIX LEADERBOARDS TABLE - Add missing 'points' column
-- =====================================================

-- Drop the existing leaderboards table and recreate it
DROP TABLE IF EXISTS public.leaderboards CASCADE;

-- Recreate leaderboards table with correct schema
CREATE TABLE public.leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game TEXT NOT NULL,
  season TEXT,
  player_name TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_leaderboards_points ON public.leaderboards(points DESC);

-- Enable RLS
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Authenticated insert leaderboards" ON public.leaderboards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update leaderboards" ON public.leaderboards FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete leaderboards" ON public.leaderboards FOR DELETE TO authenticated USING (true);

SELECT 'Leaderboards table fixed successfully!' AS status;
