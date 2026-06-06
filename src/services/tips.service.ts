import { createClient } from '@/lib/supabase/server';

export interface LifeTip {
  id: string;
  title: string;
  title_en?: string;
  title_jp?: string;
  slug: string;
  category: string;
  summary: string;
  summary_en?: string;
  summary_jp?: string;
  content_md: string;
  content_md_en?: string;
  content_md_jp?: string;
  thumbnail_url?: string;
  tags: string[];
  created_at: string;
}

export async function getPopularTips(limit: number = 4): Promise<LifeTip[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('life_tips')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular life tips:', error);
    return [];
  }
  return data as LifeTip[];
}

export async function getAllTips(limit: number = 20): Promise<LifeTip[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('life_tips')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching all life tips:', error);
    return [];
  }
  return data as LifeTip[];
}
