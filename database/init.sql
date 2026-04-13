-- ==========================================
-- NIHONSEIKATSU - FULL DATABASE INITIALIZATION
-- ==========================================

-- Kích hoạt tiện ích mở rộng cho AI (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- 1. PHÂN HỆ NGƯỜI DÙNG (USER & PROFILES)
-- ==========================================

-- Bảng Profiles (Mở rộng từ auth.users để lưu thông tin công khai)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  prefecture TEXT,
  visa_status TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger tự động tạo Profile khi User Sign Up qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kích hoạt trigger (Lưu ý: Bạn có thể cần chạy lệnh này bằng tay nếu Supabase chưa tự nhận diện)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. PHÂN HỆ SỰ KIỆN (EVENTS & COMMUNITY)
-- ==========================================

-- Bảng Events (Sự kiện từ API và Người dùng tạo)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Chung',
  event_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  source TEXT NOT NULL CHECK (source IN ('peatix', 'connpass', 'user')),
  image_url TEXT NOT NULL,
  organizer_id UUID REFERENCES auth.users(id), -- Người tạo (đối với source='user')
  organizer_name TEXT, -- Tên tổ chức (đối với source='peatix' hoặc 'connpass')
  original_url TEXT, -- Link gốc của sự kiện từ nguồn crawl
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Event Groups (Nhóm thảo luận gắn với một sự kiện)
CREATE TABLE IF NOT EXISTS public.event_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Group Messages (Tin nhắn thời gian thực trong nhóm)
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.event_groups(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- 3. PHÂN HỆ THỦ TỤC (ADMINISTRATIVE HUB)
-- ==========================================

-- Bảng Administrative Guides (Hướng dẫn chính quy)
CREATE TABLE IF NOT EXISTS public.administrative_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content_md TEXT,
  last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Administrative Steps (Chi tiết các bước trong một hướng dẫn)
CREATE TABLE IF NOT EXISTS public.administrative_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.administrative_guides(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required_documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Guide Embeddings (Lưu dữ liệu vector phục vụ AI Chatbot RAG)
CREATE TABLE IF NOT EXISTS public.guide_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.administrative_guides(id) ON DELETE CASCADE,
  content_chunk TEXT,
  embedding vector(1536), -- Vector size mặc định cho OpenAI/Gemini
  metadata JSONB
);


-- ==========================================
-- 4. PHÂN HỆ CHỢ ĐỒ CŨ (MARKETPLACE)
-- ==========================================

-- Bảng Marketplace Listings (Tin đăng rao vặt)
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

-- Bảng Listing Images (Hình ảnh sản phẩm)
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0
);

-- Bảng User Reviews (Hệ thống đánh giá sự uy tín)
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- 5. BẢO MẬT VÀ PHÂN QUYỀN (RLS POLICIES)
-- ==========================================

-- Bật Row Level Security (RLS) cho các bảng quan trọng
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Cung cấp quyền đọc công khai (SELECT) cho mọi người
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Administrative Guides" ON public.administrative_guides;
CREATE POLICY "Public Read Administrative Guides" ON public.administrative_guides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Marketplace Listings" ON public.marketplace_listings;
CREATE POLICY "Public Read Marketplace Listings" ON public.marketplace_listings FOR SELECT USING (status = 'active');

-- Quyền cho người dùng đã đăng nhập (Authenticated)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create events" ON public.events;
CREATE POLICY "Users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = organizer_id AND source = 'user');

DROP POLICY IF EXISTS "Users can create listings" ON public.marketplace_listings;
CREATE POLICY "Users can create listings" ON public.marketplace_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can manage own messages" ON public.group_messages;
CREATE POLICY "Users can manage own messages" ON public.group_messages FOR ALL TO authenticated USING (auth.uid() = sender_id);

-- Tạo Index để tối ưu hiệu năng
CREATE INDEX IF NOT EXISTS idx_events_event_time ON public.events(event_time);
CREATE INDEX IF NOT EXISTS idx_administrative_guides_slug ON public.administrative_guides(slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);
