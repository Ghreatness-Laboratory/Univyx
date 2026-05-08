-- Fix Row Level Security policies for hall_of_fame_players table
-- This will allow authenticated users to perform all operations

-- Drop existing policies
DROP POLICY IF EXISTS "Public read hall_of_fame" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.hall_of_fame_players;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.hall_of_fame_players;

-- Create comprehensive policies
-- Allow everyone to read
CREATE POLICY "Public read hall_of_fame" 
ON public.hall_of_fame_players 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Enable insert for authenticated users" 
ON public.hall_of_fame_players 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Enable update for authenticated users" 
ON public.hall_of_fame_players 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Enable delete for authenticated users" 
ON public.hall_of_fame_players 
FOR DELETE 
TO authenticated
USING (true);

-- Verify RLS is enabled
ALTER TABLE public.hall_of_fame_players ENABLE ROW LEVEL SECURITY;

SELECT 'Hall of Fame RLS policies updated successfully!' AS status;
