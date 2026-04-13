import { createClient } from '@/lib/supabase/server';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  category: string;
  event_time: string; // ISO string
  location: string;
  source: 'peatix' | 'connpass' | 'user';
  image_url: string;
  organizer_id?: string;
  organizer_name?: string;
  original_url?: string;
  attendees_count?: number;
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60'
];

function getRandomFallbackImage(): string {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

// Connpass API fetching
export async function fetchConnpassEvents(): Promise<EventData[]> {
  try {
    const res = await fetch('https://connpass.com/api/v1/event/?keyword_or=vietnam,ho+chi+minh,hanoi&count=10');
    if (!res.ok) return [];
    const data = await res.json();
    
    return data.events.map((event: any) => ({
      title: event.title,
      description: event.description || event.catch || '',
      category: 'Công nghệ',
      event_time: new Date(event.started_at).toISOString(),
      location: event.address || 'Online/TBA',
      source: 'connpass',
      image_url: getRandomFallbackImage(),
      organizer_name: event.series?.title || 'Connpass Organizer',
      original_url: event.event_url,
      attendees_count: event.accepted || 0,
    }));
  } catch (error) {
    console.error('Error fetching connpass events:', error);
    return [];
  }
}

// Peatix API mock fetching
export async function fetchPeatixEvents(): Promise<EventData[]> {
  try {
    return [
      {
        title: 'Vietnamese IT Professionals Meetup in Tokyo',
        description: 'Networking event for Vietnamese IT engineers working in Japan.',
        category: 'Giao lưu',
        event_time: new Date(Date.now() + 86400000 * 7).toISOString(), 
        location: 'Tokyo, Shinjuku',
        source: 'peatix',
        image_url: getRandomFallbackImage(),
        organizer_name: 'VN-IT Japan Community',
        original_url: 'https://peatix.com/event/example',
        attendees_count: 50,
      }
    ];
  } catch (error) {
    console.error('Error fetching peatix events:', error);
    return [];
  }
}

// Sync APIs to DB
export async function syncApiEventsToDb() {
  const supabase = await createClient();
  const connpass = await fetchConnpassEvents();
  const peatix = await fetchPeatixEvents();
  
  const allApiEvents = [...connpass, ...peatix];
  
  if (allApiEvents.length === 0) return;
  
  for (const event of allApiEvents) {
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('original_url', event.original_url || 'N/A')
      .maybeSingle();
      
    if (!existing) {
      await supabase.from('events').insert([event]);
    }
  }
}
