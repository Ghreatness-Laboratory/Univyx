-- Update Hall of Fame Players table structure
-- Change rank to numeric (1-100), replace total_wins with total_mvps, add total_championships and experience

-- Add new columns
ALTER TABLE public.hall_of_fame_players 
ADD COLUMN IF NOT EXISTS rank_number INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS total_mvps INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_championships INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS experience TEXT;

-- Drop old rank column (text) and rename rank_number to rank
ALTER TABLE public.hall_of_fame_players DROP COLUMN IF EXISTS rank;
ALTER TABLE public.hall_of_fame_players RENAME COLUMN rank_number TO rank;

-- Drop total_wins column
ALTER TABLE public.hall_of_fame_players DROP COLUMN IF EXISTS total_wins;

-- Add constraint to ensure rank is between 1-100
ALTER TABLE public.hall_of_fame_players 
ADD CONSTRAINT rank_range CHECK (rank >= 1 AND rank <= 100);

-- Update existing sample data
UPDATE public.hall_of_fame_players SET 
  rank = 1,
  total_mvps = 15,
  total_championships = 8,
  experience = '5 years'
WHERE gamertag = 'ProGamer123';

UPDATE public.hall_of_fame_players SET 
  rank = 2,
  total_mvps = 12,
  total_championships = 6,
  experience = '4 years'
WHERE gamertag = 'ElitePlayer';

UPDATE public.hall_of_fame_players SET 
  rank = 3,
  total_mvps = 18,
  total_championships = 10,
  experience = '6 years'
WHERE gamertag = 'ChampionX';

UPDATE public.hall_of_fame_players SET 
  rank = 4,
  total_mvps = 10,
  total_championships = 5,
  experience = '3 years'
WHERE gamertag = 'QueenGamer';

UPDATE public.hall_of_fame_players SET 
  rank = 5,
  total_mvps = 8,
  total_championships = 4,
  experience = '2 years'
WHERE gamertag = 'SpeedRunner';

SELECT 'Hall of Fame table updated successfully!' AS status;
