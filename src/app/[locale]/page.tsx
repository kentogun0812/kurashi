import Link from 'next/link';
import { EventCard } from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, FileText, ArrowRight, Lightbulb, Search, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  const mockEvents = [
    {
      id: "1",
      title: "Lễ hội mùa đông Sapporo Snow Festival 2026",
      category: "Lễ hội",
      date: "12 - 15 Tháng 2, 2026",
      location: "Công viên Odori, Sapporo",
      imageUrl: "https://images.unsplash.com/photo-1547014762-3a94fb4df70a?q=80&w=800&auto=format&fit=crop",
      attendees: 124,
      organizer: "Cộng đồng VN Sapporo"
    },
    {
      id: "2",
      title: "Job Fair: Kết nối nhân tài Việt - Nhật Bản",
      category: "Việc làm",
      date: "20 Tháng 4, 2026",
      location: "Tokyo Big Sight, Tokyo",
      imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
      attendees: 350,
      organizer: "Vietnam IT Japan"
    }
  ];

  return (
    <div className="container mx-auto px-4 pt-12 pb-8 md:pt-16 md:pb-12 max-w-7xl">
      {/* 1. Header: Greeting & AI Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-gradient-to-br from-card to-background p-6 md:p-8 rounded-3xl border border-border/60 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t('greeting')}</h1>
          <p className="text-muted-foreground">{t('subGreeting')}</p>
        </div>
        <div className="w-full md:w-[450px] relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md group-hover:bg-primary/30 transition-all"></div>
          <div className="relative flex items-center bg-background border border-border/50 shadow-sm rounded-2xl p-2 gap-2">
            <Sparkles className="text-primary ml-2 shrink-0" size={24} />
            <Input 
              placeholder={t('aiSearchPlaceholder')} 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-md px-1"
            />
            <Button size="icon" className="rounded-xl shrink-0 w-12 h-10 glow-primary">
              <Search size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* 2. Thủ tục Phổ biến*/}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FileText className="text-primary" size={24} />
                </div>
                {t('sections.procedures')}
              </h2>
              <Link href="/procedures" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { id: 'visa', color: 'bg-blue-500/10 text-blue-500' },
                { id: 'move', color: 'bg-green-500/10 text-green-500' },
                { id: 'quit', color: 'bg-orange-500/10 text-orange-500' },
                { id: 'marriage', color: 'bg-rose-500/10 text-rose-500' },
              ].map((item) => (
                <Card key={item.id} className="group hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-6 flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <FileText size={26} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{t(`proceduresItems.${item.id}.title` as any)}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(`proceduresItems.${item.id}.desc` as any)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 3. Sự kiện Nổi bật */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-chart-1/10 rounded-xl">
                  <Calendar className="text-chart-1" size={24} />
                </div>
                {t('sections.events')}
              </h2>
              <Link href="/events" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                {t('explore')} <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mockEvents.map((event, idx) => (
                <EventCard key={event.id} event={event} priority={idx === 0} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* 4. Mẹo hay Cuộc sống */}
          <section className="bg-card/60 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <Lightbulb className="text-yellow-500" size={20} />
              </div>
              {t('sections.tips')}
            </h2>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="group flex gap-4 p-4 rounded-2xl border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center shrink-0 font-bold text-lg group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{t(`tipsItems.${idx}.title` as any)}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(`tipsItems.${idx}.desc` as any)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary font-semibold">
              {t('viewAll')}
            </Button>
          </section>

          {/* Nền tảng Chợ */}
          <div className="bg-gradient-to-br from-primary to-chart-1 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Sparkles size={100} />
            </div>
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4">{t('marketplaceBadge')}</div>
            <h3 className="text-2xl font-bold mb-2 relative z-10">{t('marketplaceTitle')}</h3>
            <p className="text-sm opacity-90 mb-6 relative z-10 leading-relaxed">{t('marketplaceDesc')}</p>
            <Button variant="secondary" className="w-full font-bold relative z-10 rounded-xl h-12">
              {t('marketplaceButton')}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
