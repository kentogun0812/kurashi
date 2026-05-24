import { NextResponse } from 'next/server';
import { syncAllExternalEvents } from '@/services/events-sync.service';

/**
 * POST /api/cron/sync-events
 * 
 * Cron endpoint to sync external events from Connpass & Peatix.
 * Protected by CRON_SECRET header — called by GitHub Actions every 12 hours.
 * Also callable manually via Swagger API docs.
 * 
 * @header Authorization - Bearer <CRON_SECRET>
 */
export async function POST(request: Request) {
  try {
    // Authenticate via CRON_SECRET
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error('[Cron Sync] CRON_SECRET env var is not configured');
      return NextResponse.json(
        { error: 'Server misconfiguration: CRON_SECRET not set' },
        { status: 500 }
      );
    }

    const providedToken = authHeader?.replace('Bearer ', '');
    if (providedToken !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing CRON_SECRET.' },
        { status: 401 }
      );
    }

    console.log('[Cron Sync] Starting external events sync...');
    const report = await syncAllExternalEvents();
    console.log('[Cron Sync] Sync completed:', JSON.stringify(report, null, 2));

    // Revalidate events pages for all locales
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/vi/events');
      revalidatePath('/en/events');
      revalidatePath('/jp/events');
    } catch (revalError) {
      console.warn('[Cron Sync] Page revalidation warning:', revalError);
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('[Cron Sync] Fatal error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal sync error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// Also support GET for health check (no auth required)
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/cron/sync-events',
    method: 'POST',
    description: 'Sync external events from Connpass & Peatix',
    auth: 'Bearer <CRON_SECRET> in Authorization header',
    status: 'active',
  });
}
