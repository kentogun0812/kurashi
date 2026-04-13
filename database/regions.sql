-- database/regions.sql

CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- e.g., 'kanto', 'tokyo'
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  name_jp TEXT NOT NULL,
  type TEXT DEFAULT 'prefecture' CHECK (type IN ('region', 'prefecture', 'city')),
  parent_slug TEXT REFERENCES public.regions(slug) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Regions" ON public.regions FOR SELECT USING (true);

-- Seed Data
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
