-- =====================================================
-- COMPLETE UNIVYX DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENTERTAINMENT SECTION
-- =====================================================

-- Articles
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events (Entertainment Events ONLY)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image_url TEXT,
  category VARCHAR(100),
  organizer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  image_url TEXT,
  category VARCHAR(100),
  source VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GAMING SECTION (SEPARATE FROM ENTERTAINMENT)
-- =====================================================

-- Gaming Events (Tournaments, Competitions)
CREATE TABLE IF NOT EXISTS public.gaming_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  game_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- 'tournament', 'competition', 'casual'
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  image_url TEXT,
  prize_pool VARCHAR(100),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  rules TEXT,
  organizer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Tournaments
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gaming_event_id UUID REFERENCES public.gaming_events(id) ON DELETE CASCADE,
  bracket_type VARCHAR(50), -- 'single_elimination', 'double_elimination', 'round_robin'
  current_round INTEGER DEFAULT 1,
  total_rounds INTEGER,
  winner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACADEMICS SECTION
-- =====================================================

-- Universities
CREATE TABLE IF NOT EXISTS public.universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  established_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  degree_type VARCHAR(100), -- 'Bachelor', 'Master', 'PhD'
  department VARCHAR(255),
  duration_years INTEGER,
  description TEXT,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(100), -- 'document', 'video', 'link', 'book'
  file_url TEXT,
  category VARCHAR(100),
  subject VARCHAR(100),
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STORE SECTION
-- =====================================================

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INTERACTION TABLES
-- =====================================================

-- Likes
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'article', 'event', 'news', 'gaming_event'
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'article', 'event', 'news', 'resource'
  content_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'article', 'event', 'news', 'gaming_event'
  content_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gaming Event Registrations
CREATE TABLE IF NOT EXISTS public.gaming_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gaming_event_id UUID REFERENCES public.gaming_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  team_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'confirmed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gaming_event_id, user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_gaming_events_date ON public.gaming_events(event_date);
CREATE INDEX IF NOT EXISTS idx_gaming_events_status ON public.gaming_events(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_likes_content ON public.likes(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_comments_content ON public.comments(content_type, content_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.gaming_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.resources FOR SELECT USING (true);

-- User-specific access
CREATE POLICY "Users can manage own likes" ON public.likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample gaming events
INSERT INTO public.gaming_events (title, description, game_name, event_type, event_date, location, prize_pool, max_participants, status)
VALUES 
  ('FIFA 24 Championship', 'Annual FIFA tournament with amazing prizes', 'FIFA 24', 'tournament', NOW() + INTERVAL '7 days', 'Gaming Arena', '$500', 32, 'upcoming'),
  ('Valorant Showdown', 'Competitive Valorant 5v5 tournament', 'Valorant', 'tournament', NOW() + INTERVAL '14 days', 'Esports Center', '$1000', 40, 'upcoming'),
  ('League of Legends Clash', 'Team-based LoL competition', 'League of Legends', 'competition', NOW() + INTERVAL '21 days', 'Online', '$750', 50, 'upcoming')
ON CONFLICT DO NOTHING;

-- Insert sample entertainment events (different from gaming)
INSERT INTO public.events (title, description, event_date, location, category)
VALUES 
  ('Spring Music Festival', 'Annual music festival featuring local bands', NOW() + INTERVAL '10 days', 'Main Campus Quad', 'Music'),
  ('Tech Talk Series', 'Industry leaders discuss latest tech trends', NOW() + INTERVAL '15 days', 'Auditorium Hall', 'Technology'),
  ('Art Exhibition', 'Student art showcase and gallery opening', NOW() + INTERVAL '20 days', 'Art Building', 'Arts')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gaming_events_updated_at BEFORE UPDATE ON public.gaming_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DONE! Your database is ready
-- =====================================================
