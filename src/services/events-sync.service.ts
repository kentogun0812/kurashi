import { createAdminClient } from '@/lib/supabase/admin';
import { APP_INFO } from '@/const/type';

// ==========================================
// Types
// ==========================================

export interface ExternalEvent {
  title: string;
  description: string;
  category: string;
  event_time: string;
  location: string;
  source: 'connpass' | 'peatix';
  image_url: string;
  organizer_name: string;
  original_url: string;
}

export interface SyncResult {
  source: string;
  fetched: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

export interface SyncReport {
  started_at: string;
  completed_at: string;
  duration_ms: number;
  results: SyncResult[];
  total_fetched: number;
  total_synced: number;
}

// ==========================================
// Fallback Images (per category)
// ==========================================

const CATEGORY_IMAGES: Record<string, string[]> = {
  festival: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
  ],
  workshop: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60',
  ],
  job: [
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=60',
  ],
  exchange: [
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60',
  ],
  academic: [
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=60',
  ],
  default: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60',
  ],
};

function getImageForCategory(category: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.default;
  return images[Math.floor(Math.random() * images.length)];
}

// ==========================================
// Category Mapping
// ==========================================

// Map Connpass event keywords to our internal categories
function categorizeEvent(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.match(/job|career|recruit|採用|転職|就職|hiring|engineer/)) return 'job';
  if (text.match(/festival|matsuri|祭|lễ hội|花火|hanabi/)) return 'festival';
  if (text.match(/sport|marathon|run|サッカー|スポーツ|thể thao/)) return 'sports';
  if (text.match(/exchange|交流|meetup|giao lưu|networking|community/)) return 'exchange';
  if (text.match(/seminar|学術|research|nghiên cứu|conference|学会/)) return 'academic';
  if (text.match(/workshop|ワークショップ|hands-on|ハンズオン|hội thảo/)) return 'workshop';

  return 'other';
}

// ==========================================
// Connpass Fetcher
// ==========================================

const CONNPASS_KEYWORDS = [
  'vietnam',
  'ベトナム',
  'vietnamese',
  'người+việt',
];

export async function fetchConnpassEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];
  const seenUrls = new Set<string>();

  for (const keyword of CONNPASS_KEYWORDS) {
    try {
      const url = `https://connpass.com/api/v1/event/?keyword=${encodeURIComponent(keyword)}&count=20&order=2`;
      const res = await fetch(url, {
        headers: { 'User-Agent': `${APP_INFO.name}-Platform/1.0` },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        console.warn(`Connpass API returned ${res.status} for keyword: ${keyword}`);
        continue;
      }

      const data = await res.json();

      for (const item of data.events || []) {
        // Skip if already processed (from another keyword)
        if (seenUrls.has(item.event_url)) continue;
        seenUrls.add(item.event_url);

        // Skip past events (more than 1 day old)
        const eventDate = new Date(item.started_at);
        if (eventDate < new Date(Date.now() - 86400000)) continue;

        const category = categorizeEvent(item.title, item.catch || item.description || '');

        events.push({
          title: item.title,
          description: (item.catch || item.description || '').substring(0, 2000),
          category,
          event_time: eventDate.toISOString(),
          location: item.address || item.place || 'Online',
          source: 'connpass',
          image_url: getImageForCategory(category),
          organizer_name: item.owner_display_name || item.series?.title || 'Connpass',
          original_url: item.event_url,
        });
      }

      // Respect Connpass rate limit
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.error(`Error fetching Connpass events for keyword "${keyword}":`, error);
    }
  }

  return events;
}

// ==========================================
// Peatix Fetcher (Public Search Page Scraper)
// ==========================================

export async function fetchPeatixEvents(): Promise<ExternalEvent[]> {
  const events: ExternalEvent[] = [];

  try {
    // Peatix search API (public, JSON response)
    const searchUrl = 'https://peatix.com/search/events?q=vietnam+japan&country=JP&l.text=Japan&p=1&size=20&v=3.4';
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': `${APP_INFO.name}-Platform/1.0`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.warn(`Peatix search returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    const items = data?.events || data?.data || [];

    for (const item of items) {
      const eventUrl = item.url || `https://peatix.com/event/${item.id}`;
      const category = categorizeEvent(item.name || item.title || '', item.description || '');
      const eventTime = item.datetime_start || item.starts_at;

      if (!eventTime) continue;

      const eventDate = new Date(eventTime);
      if (eventDate < new Date(Date.now() - 86400000)) continue;

      events.push({
        title: item.name || item.title || 'Peatix Event',
        description: (item.description || item.catch_text || '').substring(0, 2000),
        category,
        event_time: eventDate.toISOString(),
        location: item.venue_name || item.address || 'TBA',
        source: 'peatix',
        image_url: item.cover?.original || item.image_url || getImageForCategory(category),
        organizer_name: item.group?.name || item.organizer_name || 'Peatix Organizer',
        original_url: eventUrl,
      });
    }
  } catch (error) {
    // Peatix may block automated requests — graceful degradation
    console.error('Error fetching Peatix events:', error);
  }

  return events;
}

// ==========================================
// Sync Engine
// ==========================================

async function syncSource(
  sourceName: string,
  fetcher: () => Promise<ExternalEvent[]>
): Promise<SyncResult> {
  const result: SyncResult = {
    source: sourceName,
    fetched: 0,
    inserted: 0,
    skipped: 0,
    errors: [],
  };

  try {
    const events = await fetcher();
    result.fetched = events.length;

    if (events.length === 0) return result;

    const supabase = createAdminClient();

    for (const event of events) {
      try {
        // Check if event with this original_url already exists
        const { data: existing } = await supabase
          .from('events')
          .select('id')
          .eq('original_url', event.original_url)
          .maybeSingle();

        if (existing) {
          // Already synced — skip entirely
          // attendees_count is managed by Kurashi users, not external sources
          result.skipped++;
        } else {
          // Insert new event with attendees_count = 0
          const { error: insertError } = await supabase
            .from('events')
            .insert({
              title: event.title,
              description: event.description,
              category: event.category,
              event_time: event.event_time,
              location: event.location,
              source: event.source,
              image_url: event.image_url,
              organizer_name: event.organizer_name,
              original_url: event.original_url,
              attendees_count: 0,
            });

          if (insertError) {
            result.errors.push(`Insert failed for "${event.title}": ${insertError.message}`);
          } else {
            result.inserted++;
          }
        }
      } catch (eventError: any) {
        result.errors.push(`Processing error for "${event.title}": ${eventError.message}`);
      }
    }
  } catch (fetchError: any) {
    result.errors.push(`Fetch failed: ${fetchError.message}`);
  }

  return result;
}

// ==========================================
// Main Sync Orchestrator
// ==========================================

export async function syncAllExternalEvents(): Promise<SyncReport> {
  const startedAt = new Date();

  const results = await Promise.all([
    syncSource('connpass', fetchConnpassEvents),
    syncSource('peatix', fetchPeatixEvents),
  ]);

  const completedAt = new Date();

  const report: SyncReport = {
    started_at: startedAt.toISOString(),
    completed_at: completedAt.toISOString(),
    duration_ms: completedAt.getTime() - startedAt.getTime(),
    results,
    total_fetched: results.reduce((sum, r) => sum + r.fetched, 0),
    total_synced: results.reduce((sum, r) => sum + r.inserted, 0),
  };

  console.log(`[Sync Report] Fetched: ${report.total_fetched}, Synced: ${report.total_synced}, Duration: ${report.duration_ms}ms`);

  return report;
}
