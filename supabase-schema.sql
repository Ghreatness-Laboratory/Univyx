-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles Table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT DEFAULT 'Other',
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News Table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  source TEXT DEFAULT 'Univyx',
  read_time TEXT DEFAULT '5 min read',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournaments Table
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  prize_pool NUMERIC DEFAULT 0,
  max_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboards Table
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  entries JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Universities Table
CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT,
  website TEXT,
  location TEXT,
  description TEXT,
  established_year INTEGER,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores Table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  whatsapp TEXT,
  instagram TEXT,
  twitter TEXT,
  facebook TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store Items Table
CREATE TABLE store_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  store UUID REFERENCES stores(id) ON DELETE CASCADE,
  image TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  social JSONB DEFAULT '{}'::jsonb,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners Table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Stats Table
CREATE TABLE homepage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  students INTEGER DEFAULT 0,
  universities INTEGER DEFAULT 0,
  events INTEGER DEFAULT 0,
  tournaments INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  model_name TEXT NOT NULL,
  object_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes Table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  object_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_name, object_id, user_id)
);

-- Bookmarks Table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  object_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_name, object_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public Read, Authenticated Write)
CREATE POLICY "Public can read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert articles" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update articles" ON articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete articles" ON articles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update events" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete events" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read news" ON news FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert news" ON news FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update news" ON news FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete news" ON news FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage tournaments" ON tournaments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read leaderboards" ON leaderboards FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage leaderboards" ON leaderboards FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage universities" ON universities FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage stores" ON stores FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read store_items" ON store_items FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage store_items" ON store_items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage partners" ON partners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read homepage_stats" ON homepage_stats FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage homepage_stats" ON homepage_stats FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Create Storage Buckets (Run these in Storage section, not SQL Editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
