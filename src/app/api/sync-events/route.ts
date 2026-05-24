import { NextResponse } from 'next/server';
import { syncAllExternalEvents } from '@/services/events-sync.service';

/**
 * GET /api/sync-events
 * 
 * Lightweight sync trigger (same logic as cron endpoint).
 * Protected by CRON_SECRET for security.
 * 
 * Use POST /api/cron/sync-events for the primary endpoint.
 * This route is kept for backward compatibility.
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }

    const providedToken = authHeader?.replace('Bearer ', '');
    if (providedToken !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const report = await syncAllExternalEvents();

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync events' },
      { status: 500 }
    );
  }
}
