-- =====================================================
-- STEP-BY-STEP DATABASE FIXES
-- Run each section separately in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: Fix Events Table
-- =====================================================

-- Add event_date column if it doesn't exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE;

-- Add image_url column if it doesn't exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Copy data from old columns if they exist (run only if you have 'date' or 'image' columns)
-- UPDATE public.events SET event_date = date WHERE event_date IS NULL AND date IS NOT NULL;
-- UPDATE public.events SET image_url = image WHERE image_url IS NULL AND image IS NOT NULL;

SELECT 'Step 1 Complete: Events table fixed' AS status;

-- =====================================================
-- STEP 2: Fix Leaderboards Table
-- =====================================================

-- Add required columns
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS game VARCHAR(255);
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS season VARCHAR(100);
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS player_name VARCHAR(255);
ALTER TABLE public.leaderboards ADD COLUMN IF NOT EXISTS wins INTEGER DEFAULT 0;

-- Copy points to score if points column exists
-- UPDATE public.leaderboards SET score = points WHERE score = 0 AND points IS NOT NULL;

SELECT 'Step 2 Complete: Leaderboards table fixed' AS status;

-- =====================================================
-- STEP 3: Fix Hall of Fame Table
-- =====================================================

ALTER TABLE public.hall_of_fame_players ADD COLUMN IF NOT EXISTS total_mvps INTEGER DEFAULT 0;
ALTER TABLE public.hall_of_fame_players ADD COLUMN IF NOT EXISTS total_championships INTEGER DEFAULT 0;
ALTER TABLE public.hall_of_fame_players ADD COLUMN IF NOT EXISTS total_tournaments INTEGER DEFAULT 0;
ALTER TABLE public.hall_of_fame_players ADD COLUMN IF NOT EXISTS experience VARCHAR(100);

SELECT 'Step 3 Complete: Hall of Fame table fixed' AS status;

-- =====================================================
-- STEP 4: Fix Skills Table
-- =====================================================

ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Beginner';
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS instructor VARCHAR(255);
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS image TEXT;

SELECT 'Step 4 Complete: Skills table fixed' AS status;

-- =====================================================
-- STEP 5: Fix Jobs Table
-- =====================================================

ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS image TEXT;

SELECT 'Step 5 Complete: Jobs table fixed' AS status;

-- =====================================================
-- STEP 6: Fix Popups Table
-- =====================================================

ALTER TABLE public.popups ADD COLUMN IF NOT EXISTS trigger VARCHAR(50) DEFAULT 'onload';
ALTER TABLE public.popups ADD COLUMN IF NOT EXISTS delay_seconds INTEGER DEFAULT 3;

SELECT 'Step 6 Complete: Popups table fixed' AS status;

-- =====================================================
-- STEP 7: Create/Update Profiles Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  university_id INTEGER,
  user_role VARCHAR(50) DEFAULT 'private_student',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

SELECT 'Step 7 Complete: Profiles table created' AS status;

-- =====================================================
-- STEP 8: Fix RLS Policies - Events
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can manage" ON public.events;

CREATE POLICY "Public read access" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage" ON public.events 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Step 8 Complete: Events policies fixed' AS status;

-- =====================================================
-- STEP 9: Fix RLS Policies - Leaderboards
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.leaderboards;
DROP POLICY IF EXISTS "Authenticated users can manage" ON public.leaderboards;

CREATE POLICY "Public read access" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage" ON public.leaderboards 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Step 9 Complete: Leaderboards policies fixed' AS status;

-- =====================================================
-- STEP 10: Fix RLS Policies - Hall of Fame
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Authenticated users can manage" ON public.hall_of_fame_players;

CREATE POLICY "Public read access" ON public.hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage" ON public.hall_of_fame_players 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Step 10 Complete: Hall of Fame policies fixed' AS status;

-- =====================================================
-- STEP 11: Fix RLS Policies - Skills
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can manage" ON public.skills;

CREATE POLICY "Public read access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage" ON public.skills 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Step 11 Complete: Skills policies fixed' AS status;

-- =====================================================
-- STEP 12: Fix RLS Policies - Jobs
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can manage" ON public.jobs;

CREATE POLICY "Public read access" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage" ON public.jobs 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Step 12 Complete: Jobs policies fixed' AS status;

-- =====================================================
-- STEP 13: Fix RLS Policies - Popups
-- =====================================================

DROP POLICY IF EXISTS "Public read access" ON public.popups;
DROP POLICY IF EXISTS "Authenticated users can manage" ON public.popups;

CREATE POLICY "Public read access" ON public.popups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage" ON public.popups 
  FOR ALL USING (auth.role() = 'authenticated');

SELECT 'Step 13 Complete: Popups policies fixed' AS status;

-- =====================================================
-- STEP 14: Fix RLS Policies - Profiles
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

SELECT 'Step 14 Complete: Profiles policies fixed' AS status;

-- =====================================================
-- STEP 15: Create Trigger Function
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Step 15 Complete: Trigger function created' AS status;

-- =====================================================
-- STEP 16: Create Trigger
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Step 16 Complete: Trigger created' AS status;

-- =====================================================
-- ALL DONE!
-- =====================================================

SELECT 'ALL STEPS COMPLETE! Database is ready.' AS final_status;
