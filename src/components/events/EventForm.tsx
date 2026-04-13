'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

import { useTranslations } from 'next-intl';

const CATEGORY_VALUES = [
  'festival',
  'job',
  'sports',
  'exchange',
  'workshop',
  'academic',
  'other'
];

export function EventForm({ 
  onSuccess, 
  onCancel, 
  className 
}: { 
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const t = useTranslations('events');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const event_time = formData.get('event_time') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('image') as File;

    if (!imageFile || imageFile.size === 0) {
      setError('Vui lòng chọn ảnh cho sự kiện');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Upload hình ảnh lên Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `event-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error('Không thể tải ảnh lên. Hãy chắc chắn Storage "events" đã được tạo.');
      }

      const { data: publicUrlData } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      const image_url = publicUrlData.publicUrl;

      // Gọi API tạo sự kiện
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          event_time: new Date(event_time).toISOString(),
          location,
          image_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra khi tạo sự kiện');
      } else {
        setSuccess('Tạo sự kiện thành công!');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/events');
          }
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError('Không thể kết nối với server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className || "space-y-6 bg-card/60 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-sm max-w-2xl mx-auto mt-10"}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Tạo sự kiện mới</h2>
        <p className="text-muted-foreground text-sm">Điền đầy đủ thông tin để chia sẻ sự kiện của bạn với cộng đồng.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm font-medium">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Tên sự kiện <span className="text-red-500">*</span></label>
          <Input id="title" name="title" required placeholder="VD: Lễ hội mùa đông Sapporo" className="h-12 bg-background/50 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Danh mục</label>
            <select 
              id="category" 
              name="category" 
              className="w-full h-12 px-4 bg-background/50 border border-border/50 rounded-xl text-sm text-foreground appearance-none outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORY_VALUES.map(val => (
                <option key={val} value={val}>{t(`categories.${val}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="event_time" className="block text-sm font-medium mb-1">Thời gian <span className="text-red-500">*</span></label>
            <Input id="event_time" name="event_time" type="datetime-local" required className="h-12 bg-background/50 rounded-xl" />
          </div>
        </div>

        <div>
           <label htmlFor="location" className="block text-sm font-medium mb-1">Địa điểm <span className="text-red-500">*</span></label>
           <Input id="location" name="location" required placeholder="VD: Công viên Yoyogi, Tokyo" className="h-12 bg-background/50 rounded-xl" />
        </div>

        <div>
           <label htmlFor="image" className="block text-sm font-medium mb-1">Ảnh banner <span className="text-red-500">*</span></label>
           <Input id="image" name="image" type="file" accept="image/*" required className="h-12 bg-background/50 rounded-xl cursor-pointer pt-3 pl-3" />
           <p className="text-xs text-muted-foreground mt-1.5 ml-1">Kích thước khuyên dùng: 800x400px (JPG, PNG).</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
          <textarea 
            id="description" 
            name="description" 
            rows={4} 
            className="w-full p-4 bg-background/50 border border-border/50 rounded-xl text-sm text-foreground appearance-none outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            placeholder="Nội dung, đối tượng tham gia, giá vé (nếu có)..."
          ></textarea>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
        <Button type="button" variant="ghost" onClick={() => onCancel ? onCancel() : router.back()} disabled={loading} className="rounded-xl">
          Hủy bỏ
        </Button>
        <Button type="submit" disabled={loading} className="rounded-xl min-w-[150px] glow-primary">
          {loading ? 'Đang xử lý...' : 'Tạo Sự Kiện'}
        </Button>
      </div>
    </form>
  );
}
