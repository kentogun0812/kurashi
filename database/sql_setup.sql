-- ==========================================
-- KURASHI - FULL DATABASE SETUP (REFACTORED)
-- ==========================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- 1. USER PROFILE
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  organizer_name TEXT,
  original_url TEXT,
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create events" ON public.events;
CREATE POLICY "Users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND source = 'user');

-- Tables for Discussion (Simplified: Removed event_groups)
CREATE TABLE IF NOT EXISTS public.event_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Messages" ON public.event_messages;
CREATE POLICY "Public Read Messages" ON public.event_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own messages" ON public.event_messages;
CREATE POLICY "Users can manage own messages" ON public.event_messages FOR ALL TO authenticated USING (auth.uid() = user_id);

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
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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
CREATE POLICY "Users can create listings" ON public.marketplace_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. REGIONS DATA
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

INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Events Banner" ON storage.objects;
CREATE POLICY "Public Read Events Banner" ON storage.objects FOR SELECT USING (bucket_id = 'events');

DROP POLICY IF EXISTS "Authenticated Upload Events Banner" ON storage.objects;
CREATE POLICY "Authenticated Upload Events Banner" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'events');

-- ==========================================
-- 7. CUSTOM RPC FUNCTIONS
-- ==========================================

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
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_original_url ON public.events(original_url) WHERE original_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_administrative_guides_slug ON public.administrative_guides(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ==========================================
-- 9. PERMISSIONS (GRANTS)
-- ==========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Ensure tables are accessible
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.events TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.event_messages TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.administrative_guides TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.administrative_steps TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.guide_embeddings TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.marketplace_listings TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.listing_images TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_reviews TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.regions TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
