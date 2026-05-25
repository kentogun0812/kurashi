-- 1. Thêm các cột Đa ngôn ngữ vào bảng administrative_guides
ALTER TABLE public.administrative_guides
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_jp TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS summary_jp TEXT,
ADD COLUMN IF NOT EXISTS content_md_en TEXT,
ADD COLUMN IF NOT EXISTS content_md_jp TEXT;

-- 2. Khởi tạo Storage Bucket cho hình ảnh của bài viết
INSERT INTO storage.buckets (id, name, public) 
VALUES ('procedure_images', 'procedure_images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Cấp quyền (RLS) cho Bucket procedure_images
-- 3.1. Ai cũng có thể xem/đọc ảnh (Public Read)
DROP POLICY IF EXISTS "Public Read Procedure Images" ON storage.objects;
CREATE POLICY "Public Read Procedure Images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'procedure_images');

-- 3.2. Chỉ user đã đăng nhập (hoặc sau này bạn có thể giới hạn role admin) mới được upload ảnh
DROP POLICY IF EXISTS "Authenticated Upload Procedure Images" ON storage.objects;
CREATE POLICY "Authenticated Upload Procedure Images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'procedure_images');

-- 3.3. Cho phép Update/Delete ảnh với user đã upload
DROP POLICY IF EXISTS "Authenticated Update Procedure Images" ON storage.objects;
CREATE POLICY "Authenticated Update Procedure Images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'procedure_images');

DROP POLICY IF EXISTS "Authenticated Delete Procedure Images" ON storage.objects;
CREATE POLICY "Authenticated Delete Procedure Images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'procedure_images');
