import { createClient } from '@/lib/supabase/server';

export interface DashboardStats {
  totalUsers: number;
  totalGuides: number;
  totalEvents: number;
  totalListings: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalGuides },
    { count: totalEvents },
    { count: totalListings },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('administrative_guides').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('marketplace_listings').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalGuides: totalGuides || 0,
    totalEvents: totalEvents || 0,
    totalListings: totalListings || 0,
  };
}
