import { EventCard, EventType } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { EventsFilterBar } from "@/components/events/EventsFilterBar";
import { EventCategories } from "@/components/events/EventCategories";

export default async function EventsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('events');
  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : '';
  const category = typeof sp.category === 'string' ? sp.category : '';
  const region = typeof sp.region === 'string' ? sp.region : '';

  const supabase = await createClient();
  let query = supabase.from('events').select(`
    *,
    profiles:organizer_id(display_name)
  `).order('event_time', { ascending: true }); // sort upcoming

  if (category) {
    query = query.eq('category', category);
  }
  
  if (region && region !== 'all') {
    // Basic mapping for Japan regions to keywords since location is text field
    const regionMap: Record<string, string[]> = {
      kanto: ['Tokyo', 'Chiba', 'Saitama', 'Kanagawa', 'Gunma', 'Tochigi', 'Ibaraki'],
      kansai: ['Osaka', 'Kyoto', 'Hyogo', 'Kobe', 'Nara', 'Shiga', 'Wakayama'],
      kyushu: ['Fukuoka', 'Kumamoto', 'Kagoshima', 'Nagasaki', 'Oita', 'Miyazaki', 'Saga'],
      hokkaido: ['Hokkaido', 'Sapporo']
    };
    
    if (regionMap[region]) {
       // Using an OR condition for all cities in the region
       const safeRegionKeywords = regionMap[region].map(r => `location.ilike.%${r}%`).join(',');
       query = query.or(safeRegionKeywords);
    } else {
       query = query.ilike('location', `%${region}%`);
    }
  }

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data: dbEvents, error } = await query;
  
  let events: EventType[] = [];
  
  const categoryMap: Record<string, string> = {
    festival: t('categories.festival'),
    job: t('categories.job'),
    sports: t('categories.sports'),
    exchange: t('categories.exchange'),
    workshop: t('categories.workshop'),
    academic: t('categories.academic'),
    other: t('categories.other')
  };

  if (dbEvents) {
    events = dbEvents.map((e: any) => ({
      id: e.id,
      title: e.title,
      category: categoryMap[e.category] || e.category || 'Khác',
      date: new Date(e.event_time).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      location: e.location || 'N/A',
      imageUrl: e.image_url,
      attendees: e.attendees_count || 0,
      organizer: e.organizer_name || e.profiles?.display_name || 'Cộng đồng VN'
    }));
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
          {t('title')} <span className="text-primary text-gradient">{t('titleHighlight')}</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t('description')}
        </p>
      </div>

      {/* Filters and Search Bar */}
      <EventsFilterBar />

      {/* Category Pills */}
      <EventCategories />

      {/* Grid Events */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <EventCard key={event.id} event={event} priority={idx < 2} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🏜️</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Không tìm thấy sự kiện nào</h3>
          <p className="text-muted-foreground">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác nhé.</p>
        </div>
      )}
      
      {/* Load more section */}
      {events.length > 0 && (
        <div className="mt-16 flex flex-col items-center justify-center border-t border-border/50 pt-10">
          <p className="text-muted-foreground mb-6">{t('showCount', { count: events.length })}</p>
          <Button variant="outline" size="lg" className="rounded-2xl h-14 min-w-[200px] border-border hover:bg-secondary">
            {t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}
