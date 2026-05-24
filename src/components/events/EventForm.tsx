'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2, Check, AlertCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { DatePicker } from './DateTimePicker';
import { TimePicker } from './TimePicker';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // States for counters
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  // States for custom category dropdown
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_VALUES[0]);
  const [eventTime, setEventTime] = useState(new Date().toISOString());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const MAX_TITLE = 100;
  const MAX_LOCATION = 255;

  const validateField = (name: string, value: any) => {
    const newErrors = { ...fieldErrors };
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      newErrors[name] = 'Thông tin này là bắt buộc';
    } else {
      delete newErrors[name];
    }
    setFieldErrors(newErrors);
  };

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const event_time = formData.get('event_time') as string;
    const description = formData.get('description') as string;
    const locationValue = formData.get('location') as string;
    const titleValue = formData.get('title') as string;
    const imageFile = formData.get('image') as File;

    const errors: Record<string, string> = {};
    if (!titleValue.trim()) errors.title = 'Vui lòng nhập tên sự kiện';
    if (!locationValue.trim()) errors.location = 'Vui lòng nhập địa điểm';
    if (!imageFile || imageFile.size === 0) errors.image = 'Vui lòng chọn ảnh banner';
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
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
        throw new Error('Không thể tải ảnh lên.');
      }

      const { data: publicUrlData } = supabase.storage
        .from('events')
        .getPublicUrl(filePath);

      const image_url = publicUrlData.publicUrl;

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleValue,
          description,
          category: selectedCategory,
          event_time: new Date(event_time).toISOString(),
          location: locationValue,
          image_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra');
        setLoading(false);
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/events');
          router.refresh();
        }
      }
    } catch (err) {
      setError('Không thể kết nối với server.');
      setLoading(false);
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
        <AlertCircle size={14} />
        <span className="text-[11px] font-medium">{message}</span>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Tạo sự kiện mới</h2>
        <p className="text-muted-foreground text-sm">Điền đầy đủ thông tin để chia sẻ sự kiện của bạn với cộng đồng.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Tên sự kiện */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center h-6">
            <label htmlFor="title" className="text-sm font-semibold ml-1">Tên sự kiện <span className="text-primary">*</span></label>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", title.length >= MAX_TITLE ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground")}>
              {title.length}/{MAX_TITLE}
            </span>
          </div>
          <Input 
            id="title" 
            name="title" 
            placeholder="VD: Lễ hội mùa đông Sapporo" 
            className={cn(
              "h-12 bg-secondary/30 border-border/50 rounded-xl focus:bg-background transition-all",
              fieldErrors.title && "border-red-500/50 bg-red-500/5 focus:ring-red-500/10"
            )} 
            maxLength={MAX_TITLE}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) validateField('title', e.target.value);
            }}
          />
          <ErrorMessage message={fieldErrors.title} />
        </div>

        {/* Danh mục & Thời gian */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
            <div className="flex items-center h-6">
              <label className="text-sm font-semibold ml-1">Danh mục</label>
            </div>
            <button
               type="button"
               onClick={() => setIsCategoryOpen(!isCategoryOpen)}
               className="w-full relative flex items-center justify-between px-4 bg-secondary/30 border border-border/50 rounded-xl h-12 text-sm text-foreground hover:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
            >
              <span className="truncate font-medium">
                {t(`categories.${selectedCategory}`)}
              </span>
              <ChevronDown size={16} className={cn("text-muted-foreground transition-transform duration-200", isCategoryOpen && "rotate-180")} />
            </button>
            
            {isCategoryOpen && (
              <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-background border border-border shadow-xl rounded-xl z-[160] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-[250px] overflow-y-auto p-1.5 custom-scrollbar">
                  {CATEGORY_VALUES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(val);
                        setIsCategoryOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center p-3 rounded-lg text-left text-sm transition-colors",
                        selectedCategory === val ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-foreground"
                      )}
                    >
                      <span className="flex-1">{t(`categories.${val}`)}</span>
                      {selectedCategory === val && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DatePicker 
            value={eventTime}
            onChange={setEventTime}
            label="Ngày diễn ra"
          />

          <TimePicker 
            value={eventTime}
            onChange={setEventTime}
          />

          {/* Hidden input to ensure event_time name is submitted */}
          <input type="hidden" name="event_time" value={eventTime} />
        </div>

        {/* Địa điểm */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center h-6">
            <label htmlFor="location" className="text-sm font-semibold ml-1">Địa điểm <span className="text-primary">*</span></label>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", location.length >= MAX_LOCATION ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground")}>
              {location.length}/{MAX_LOCATION}
            </span>
          </div>
          <Input 
            id="location" 
            name="location" 
            placeholder="VD: Công viên Yoyogi, Tokyo" 
            className={cn(
              "h-12 bg-secondary/30 border-border/50 rounded-xl focus:bg-background transition-all",
              fieldErrors.location && "border-red-500/50 bg-red-500/5 focus:ring-red-500/10"
            )} 
            maxLength={MAX_LOCATION}
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (fieldErrors.location) validateField('location', e.target.value);
            }}
          />
          <ErrorMessage message={fieldErrors.location} />
        </div>

        {/* Ảnh banner */}
        <div className="flex flex-col gap-2">
           <div className="flex items-center h-6">
             <label htmlFor="image" className="text-sm font-semibold ml-1">Ảnh banner <span className="text-primary">*</span></label>
           </div>
           <div className="relative">
             <Input 
               id="image" 
               name="image" 
               type="file" 
               accept="image/*" 
               className={cn(
                 "h-12 bg-secondary/30 border-border/50 rounded-xl cursor-pointer pt-3 pl-3 file:mr-4 file:py-0.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 focus:bg-background transition-all",
                 fieldErrors.image && "border-red-500/20 bg-red-500/5"
               )} 
               onChange={(e) => {
                 if (fieldErrors.image) validateField('image', e.target.files?.[0]);
               }}
             />
           </div>
           <ErrorMessage message={fieldErrors.image} />
           <p className="text-[10px] text-muted-foreground ml-1 italic opacity-70 mt-1">Khuyên dùng: 800x400px (JPG, PNG).</p>
        </div>

        {/* Mô tả */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-6">
            <label htmlFor="description" className="text-sm font-semibold ml-1">Mô tả chi tiết</label>
          </div>
          <textarea 
            id="description" 
            name="description" 
            rows={4} 
            className="w-full p-4 bg-secondary/30 border border-border/50 rounded-2xl text-sm text-foreground appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all resize-none"
            placeholder="Nội dung, đối tượng tham gia, giá vé (nếu có)..."
          ></textarea>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-border/50">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => onCancel ? onCancel() : router.back()} 
          disabled={loading} 
          className="rounded-xl h-12 order-2 sm:order-1"
        >
          {t('cancel')}
        </Button>
        <Button 
          type="submit" 
          disabled={loading} 
          className="rounded-xl h-12 min-w-[160px] glow-primary font-bold shadow-lg order-1 sm:order-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t('processing')}</span>
            </div>
          ) : t('create')}
        </Button>
      </div>
    </form>
  );
}
