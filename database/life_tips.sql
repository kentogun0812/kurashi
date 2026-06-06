
-- ==========================================
-- 10. LIFE TIPS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.life_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  title_jp TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  summary_en TEXT,
  summary_jp TEXT,
  content_md TEXT,
  content_md_en TEXT,
  content_md_jp TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.life_tips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Life Tips" ON public.life_tips;
CREATE POLICY "Public Read Life Tips" ON public.life_tips FOR SELECT USING (status = 'published');

GRANT ALL ON TABLE public.life_tips TO postgres, anon, authenticated, service_role;
