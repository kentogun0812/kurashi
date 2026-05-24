import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ChevronLeft, MessageSquarePlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { EventMessagesBoard } from "./EventMessagesBoard";

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('events');
  const supabase = await createClient();

  // Fetch event details
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles:organizer_id(display_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error || !event) {
    notFound();
  }

  const dateStr = new Date(event.event_time).toLocaleString('vi-VN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const organizerName = event.organizer_name || event.profiles?.display_name || 'Cộng đồng VN';
  
  const categoryMap: Record<string, string> = {
    festival: t('categories.festival'),
    job: t('categories.job'),
    sports: t('categories.sports'),
    exchange: t('categories.exchange'),
    workshop: t('categories.workshop'),
    academic: t('categories.academic'),
    other: t('categories.other')
  };
  const categoryLabel = categoryMap[event.category] || event.category || 'Khác';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Trở về danh sách</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="bg-card/60 backdrop-blur-md rounded-3xl border border-border/50 overflow-hidden shadow-sm">
            <div className="w-full h-[300px] md:h-[400px] relative">
              <Image 
                src={event.image_url}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 z-10 font-bold">
                 <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-none text-sm px-3 py-1 mb-2">
                  {categoryLabel}
                 </Badge>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Thời gian</p>
                    <p className="font-semibold text-sm">{dateStr}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Địa điểm</p>
                    <p className="font-semibold text-sm">{event.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Giới thiệu sự kiện</h3>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description || 'Chưa có mô tả chi tiết cho sự kiện này.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Organizer Card */}
          <div className="bg-card/60 backdrop-blur-md rounded-3xl border border-border/50 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="text-primary" size={20} />
              Thông tin tổ chức
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden relative">
                {event.profiles?.avatar_url ? (
                  <Image src={event.profiles.avatar_url} alt={organizerName} fill sizes="56px" className="object-cover" />
                ) : (
                  <span className="text-lg font-bold text-foreground opacity-50 uppercase">{organizerName.substring(0, 2)}</span>
                )}
              </div>
              <div>
                <p className="font-bold">{organizerName}</p>
                <p className="text-sm text-muted-foreground capitalize">Nguồn: {event.source}</p>
              </div>
            </div>
            {event.original_url && (
              <a href={event.original_url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl block text-center")}>
                Xem link gốc sự kiện
              </a>
            )}
          </div>

          {/* Event Groups Section */}
          <div className="bg-card/60 backdrop-blur-md rounded-3xl border border-border/50 p-6 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageSquarePlus className="text-primary" size={20} />
                Bảng Tin nhắn & Thảo luận
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Thảo luận, chia sẻ thông tin hoặc tìm bạn đồng hành cùng tham gia sự kiện.
            </p>
            
            <div className="flex-1 overflow-hidden">
               <EventMessagesBoard eventId={event.id} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
