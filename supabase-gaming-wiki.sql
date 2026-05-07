-- =============================================
-- GAMING HALL OF FAME & WIKI SCHEMA
-- Backend-managed gaming encyclopedia
-- =============================================

-- Hall of Fame Players Table
CREATE TABLE IF NOT EXISTS hall_of_fame_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gamertag TEXT NOT NULL,
  university TEXT,
  bio TEXT,
  avatar TEXT,
  achievements TEXT[] DEFAULT '{}',
  total_wins INTEGER DEFAULT 0,
  total_tournaments INTEGER DEFAULT 0,
  favorite_game TEXT,
  rank TEXT,
  social_links JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gaming Wiki Entries Table
CREATE TABLE IF NOT EXISTS gaming_wiki (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('game', 'strategy', 'character', 'tournament', 'team', 'guide', 'history')),
  content TEXT NOT NULL,
  summary TEXT,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  related_entries UUID[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gaming Teams Table
CREATE TABLE IF NOT EXISTS gaming_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  founded_date DATE,
  captain_id UUID,
  members JSONB DEFAULT '[]',
  achievements TEXT[] DEFAULT '{}',
  total_wins INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  rank INTEGER,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gaming Records Table
CREATE TABLE IF NOT EXISTS gaming_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_type TEXT NOT NULL CHECK (record_type IN ('fastest_win', 'highest_score', 'longest_streak', 'most_kills', 'best_kda', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  holder_name TEXT NOT NULL,
  holder_id UUID,
  game TEXT NOT NULL,
  value TEXT NOT NULL,
  date_achieved DATE,
  tournament_id UUID REFERENCES tournaments(id),
  proof_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gaming Achievements/Badges Table
CREATE TABLE IF NOT EXISTS gaming_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  points INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Achievements Junction Table
CREATE TABLE IF NOT EXISTS player_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES hall_of_fame_players(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES gaming_achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, achievement_id)
);

-- Gaming Highlights/Moments Table
CREATE TABLE IF NOT EXISTS gaming_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail TEXT,
  player_id UUID REFERENCES hall_of_fame_players(id),
  tournament_id UUID REFERENCES tournaments(id),
  game TEXT,
  highlight_type TEXT CHECK (highlight_type IN ('play_of_the_game', 'clutch', 'ace', 'comeback', 'funny', 'other')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE hall_of_fame_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_wiki ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_highlights ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read hall of fame players" ON hall_of_fame_players FOR SELECT USING (true);
CREATE POLICY "Public can read published wiki entries" ON gaming_wiki FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active teams" ON gaming_teams FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read verified records" ON gaming_records FOR SELECT USING (is_verified = true);
CREATE POLICY "Public can read achievements" ON gaming_achievements FOR SELECT USING (true);
CREATE POLICY "Public can read player achievements" ON player_achievements FOR SELECT USING (true);
CREATE POLICY "Public can read highlights" ON gaming_highlights FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Authenticated can manage hall of fame" ON hall_of_fame_players FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage wiki" ON gaming_wiki FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage teams" ON gaming_teams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage records" ON gaming_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage achievements" ON gaming_achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage player achievements" ON player_achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage highlights" ON gaming_highlights FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_featured ON hall_of_fame_players(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_wiki_category ON gaming_wiki(category);
CREATE INDEX IF NOT EXISTS idx_wiki_slug ON gaming_wiki(slug);
CREATE INDEX IF NOT EXISTS idx_teams_university ON gaming_teams(university);
CREATE INDEX IF NOT EXISTS idx_records_game ON gaming_records(game);
CREATE INDEX IF NOT EXISTS idx_highlights_featured ON gaming_highlights(is_featured);

-- Sample data for Hall of Fame
INSERT INTO hall_of_fame_players (name, gamertag, university, bio, achievements, total_wins, total_tournaments, favorite_game, rank, is_featured, display_order)
VALUES 
  ('Chukwuemeka Obi', 'ProGamer_CK', 'Covenant University', 'Professional FIFA player and 3-time university champion', ARRAY['National Champion 2023', 'MVP Award 2024', 'Fastest Goal Record'], 45, 12, 'FIFA 24', 'Legend', true, 1),
  ('Aisha Mohammed', 'QueenAisha', 'Babcock University', 'Top-ranked Call of Duty player with exceptional strategy skills', ARRAY['Best Female Gamer 2023', 'Tournament MVP', 'Clutch Master'], 38, 10, 'Call of Duty', 'Master', true, 2),
  ('David Adeleke', 'DavidTheKing', 'American University of Nigeria', 'Fortnite specialist known for creative building techniques', ARRAY['Build Master', 'Victory Royale x100', 'Team Captain'], 52, 15, 'Fortnite', 'Legend', true, 3)
ON CONFLICT DO NOTHING;

-- Sample Gaming Wiki Entries
INSERT INTO gaming_wiki (title, slug, category, content, summary, tags, is_published)
VALUES 
  ('FIFA 24 Ultimate Guide', 'fifa-24-ultimate-guide', 'guide', 'Comprehensive guide covering all aspects of FIFA 24 gameplay, from basic controls to advanced tactics...', 'Master FIFA 24 with this complete guide', ARRAY['fifa', 'sports', 'guide', 'tutorial'], true),
  ('History of Univyx Gaming', 'history-of-univyx-gaming', 'history', 'The evolution of gaming culture in Nigerian private universities...', 'How gaming became a major part of student life', ARRAY['history', 'culture', 'esports'], true),
  ('Top 10 Gaming Strategies', 'top-10-gaming-strategies', 'strategy', 'Essential strategies every competitive gamer should know...', 'Improve your gameplay with these proven strategies', ARRAY['strategy', 'tips', 'competitive'], true)
ON CONFLICT DO NOTHING;

-- Sample Gaming Teams
INSERT INTO gaming_teams (name, university, description, achievements, total_wins, total_matches, rank, is_active)
VALUES 
  ('Covenant Titans', 'Covenant University', 'Elite gaming squad dominating the university esports scene', ARRAY['Inter-University Champions 2023', 'Undefeated Season 2024'], 28, 35, 1, true),
  ('Babcock Warriors', 'Babcock University', 'Fierce competitors known for strategic gameplay', ARRAY['Regional Champions', 'Best Team Spirit Award'], 24, 32, 2, true),
  ('AUN Eagles', 'American University of Nigeria', 'Rising stars in the competitive gaming world', ARRAY['Rookie Team of the Year'], 18, 25, 3, true)
ON CONFLICT DO NOTHING;

-- Sample Gaming Records
INSERT INTO gaming_records (record_type, title, description, holder_name, game, value, date_achieved, is_verified)
VALUES 
  ('fastest_win', 'Fastest Victory Royale', 'Quickest win in Fortnite tournament history', 'David Adeleke', 'Fortnite', '8 minutes 23 seconds', '2024-01-15', true),
  ('highest_score', 'Highest FIFA Score', 'Largest goal margin in competitive match', 'Chukwuemeka Obi', 'FIFA 24', '12-0', '2023-11-20', true),
  ('longest_streak', 'Longest Win Streak', 'Most consecutive tournament wins', 'Aisha Mohammed', 'Call of Duty', '15 wins', '2024-02-10', true)
ON CONFLICT DO NOTHING;
