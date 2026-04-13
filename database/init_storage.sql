-- Tạo bucket 'events' nếu chưa có
INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Bật RLS cho bảng objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả mọi người được xem ảnh sự kiện
CREATE POLICY "Public Read Events Banner" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'events');

-- Cho phép user đăng nhập được upload file lên bucket 'events'
CREATE POLICY "Authenticated Upload Events Banner" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'events');
