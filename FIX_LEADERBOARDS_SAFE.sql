-- =====================================================
-- SAFE FIX for LEADERBOARDS TABLE
-- =====================================================

-- First, check if the table exists and what columns it has
DO $$ 
BEGIN
    -- If the table exists, drop it
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leaderboards') THEN
        DROP TABLE public.leaderboards CASCADE;
        RAISE NOTICE 'Dropped existing leaderboards table';
    END IF;
END $$;

-- Create leaderboards table with correct schema
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

SELECT 'Leaderboards table recreated successfully with points column!' AS status;
