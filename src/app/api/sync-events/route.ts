import { NextResponse } from 'next/server';
import { syncApiEventsToDb } from '@/services/events.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Optional: Protect this route in production by checking admin role
    // const { data: { user } } = await supabase.auth.getUser();
    
    await syncApiEventsToDb();
    
    return NextResponse.json({ success: true, message: 'Event sync completed successfully.' });
  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync events' }, { status: 500 });
  }
}
