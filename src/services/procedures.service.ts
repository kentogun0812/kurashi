import { createClient } from '@/lib/supabase/server';

export interface Procedure {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  last_verified_at: string;
}

export async function getPopularProcedures(limit: number = 4): Promise<Procedure[]> {
  const supabase = await createClient();

  // For now, we fetch the most recently verified ones as 'popular'
  const { data, error } = await supabase
    .from('administrative_guides')
    .select('id, slug, title, summary, category, last_verified_at')
    .order('last_verified_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching popular procedures:', error);
    return [];
  }

  return data as Procedure[];
}
