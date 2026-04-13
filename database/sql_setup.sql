-- ==========================================
-- NIHONSEIKATSU - FULL DATABASE SETUP (CONSOLIDATED)
-- ==========================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- 1. USER & PROFILES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  prefecture TEXT,
  visa_status TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Toggle RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Activation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 2. EVENTS & COMMUNITY
-- ==========================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Chung',
  event_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  source TEXT NOT NULL CHECK (source IN ('peatix', 'connpass', 'user')),
  image_url TEXT NOT NULL,
  organizer_id UUID REFERENCES auth.users(id),
  organizer_name TEXT,
  original_url TEXT,
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create events" ON public.events;
CREATE POLICY "Users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id AND source = 'user');

-- Tables for Discussion
CREATE TABLE IF NOT EXISTS public.event_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.event_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.event_groups(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own messages" ON public.group_messages;
CREATE POLICY "Users can manage own messages" ON public.group_messages FOR ALL TO authenticated USING (auth.uid() = sender_id);

-- ==========================================
-- 3. ADMINISTRATIVE HUB
-- ==========================================

CREATE TABLE IF NOT EXISTS public.administrative_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content_md TEXT,
  last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.administrative_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Administrative Guides" ON public.administrative_guides;
CREATE POLICY "Public Read Administrative Guides" ON public.administrative_guides FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.administrative_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.administrative_guides(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required_documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.guide_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.administrative_guides(id) ON DELETE CASCADE,
  content_chunk TEXT,
  embedding vector(1536),
  metadata JSONB
);

-- ==========================================
-- 4. MARKETPLACE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  prefecture TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Marketplace Listings" ON public.marketplace_listings;
CREATE POLICY "Public Read Marketplace Listings" ON public.marketplace_listings FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Users can create listings" ON public.marketplace_listings;
CREATE POLICY "Users can create listings" ON public.marketplace_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. REGIONS DATA (Japan Prefectures)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  name_jp TEXT NOT NULL,
  type TEXT DEFAULT 'prefecture' CHECK (type IN ('region', 'prefecture', 'city')),
  parent_slug TEXT REFERENCES public.regions(slug) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Regions" ON public.regions;
CREATE POLICY "Public Read Regions" ON public.regions FOR SELECT USING (true);

-- Seed Regions
INSERT INTO public.regions (slug, name_en, name_vi, name_jp, type, parent_slug) VALUES
  ('kanto', 'Kanto', 'Kanto', '関東', 'region', NULL),
  ('kansai', 'Kansai', 'Kansai', '関西', 'region', NULL),
  ('kyushu', 'Kyushu', 'Kyushu', '九州', 'region', NULL),
  ('hokkaido', 'Hokkaido', 'Hokkaido', '北海道', 'region', NULL),
  ('tokyo', 'Tokyo', 'Tokyo', '東京', 'prefecture', 'kanto'),
  ('saitama', 'Saitama', 'Saitama', '埼玉', 'prefecture', 'kanto'),
  ('chiba', 'Chiba', 'Chiba', '千葉', 'prefecture', 'kanto'),
  ('kanagawa', 'Kanagawa', 'Kanagawa', '神奈川', 'prefecture', 'kanto'),
  ('osaka', 'Osaka', 'Osaka', '大阪', 'prefecture', 'kansai'),
  ('kyoto', 'Kyoto', 'Kyoto', '京都', 'prefecture', 'kansai'),
  ('hyogo', 'Hyogo', 'Hyogo', '兵庫', 'prefecture', 'kansai'),
  ('fukuoka', 'Fukuoka', 'Fukuoka', '福岡', 'prefecture', 'kyushu'),
  ('sapporo', 'Sapporo', 'Sapporo', '札幌', 'prefecture', 'hokkaido')
ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- 6. STORAGE SETUP
-- ==========================================

-- Tạo bucket 'events'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Events Banner" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'events');

CREATE POLICY "Authenticated Upload Events Banner" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'events');

-- ==========================================
-- 7. CUSTOM RPC FUNCTIONS
-- ==========================================

-- Hàm kiểm tra email tồn tại (Dành cho signup check)
CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = email_to_check);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 8. INDEXES
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_events_event_time ON public.events(event_time);
CREATE INDEX IF NOT EXISTS idx_administrative_guides_slug ON public.administrative_guides(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
