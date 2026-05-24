import { NextResponse } from 'next/server';
import { APP_INFO } from '@/const/type';

/**
 * GET /api/swagger
 * 
 * Returns the OpenAPI 3.0 specification for the Kurashi API.
 */
export async function GET() {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: `${APP_INFO.name} API`,
      description: `API documentation for the ${APP_INFO.name} platform — a community ecosystem for Vietnamese residents in Japan.`,
      version: '1.0.0',
      contact: {
        name: `${APP_INFO.name} Team`,
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Current Environment',
      },
    ],
    tags: [
      {
        name: 'Cron',
        description: 'Scheduled task endpoints (protected by CRON_SECRET)',
      },
      {
        name: 'Events',
        description: 'Event management endpoints',
      },
    ],
    paths: {
      '/api/cron/sync-events': {
        get: {
          tags: ['Cron'],
          summary: 'Health Check',
          description: 'Returns the status and documentation for the sync-events endpoint. No authentication required.',
          responses: {
            '200': {
              description: 'Endpoint info',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      endpoint: { type: 'string', example: '/api/cron/sync-events' },
                      method: { type: 'string', example: 'POST' },
                      description: { type: 'string' },
                      auth: { type: 'string' },
                      status: { type: 'string', example: 'active' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Cron'],
          summary: 'Sync External Events',
          description: `Triggers synchronization of events from external platforms (Connpass, Peatix) into the database.

**Flow:**
1. Fetches events from Connpass API using Vietnamese-related keywords
2. Scrapes Peatix search results for Vietnam/Japan events
3. Deduplicates by \`original_url\`
4. Inserts new events or updates attendee counts
5. Revalidates Next.js event pages

**Scheduling:** Called automatically by GitHub Actions every 12 hours.`,
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Sync completed successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SyncResponse' },
                  example: {
                    success: true,
                    report: {
                      started_at: '2026-04-14T00:00:00.000Z',
                      completed_at: '2026-04-14T00:00:12.345Z',
                      duration_ms: 12345,
                      results: [
                        {
                          source: 'connpass',
                          fetched: 15,
                          inserted: 5,
                          updated: 3,
                          skipped: 7,
                          errors: [],
                        },
                        {
                          source: 'peatix',
                          fetched: 8,
                          inserted: 2,
                          updated: 1,
                          skipped: 5,
                          errors: [],
                        },
                      ],
                      total_fetched: 23,
                      total_synced: 11,
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized — missing or invalid CRON_SECRET',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string', example: 'Unauthorized. Invalid or missing CRON_SECRET.' },
                    },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'List All Events',
          description: 'Returns all events sorted by event time (ascending).',
          responses: {
            '200': {
              description: 'List of events',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      events: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Event' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Events'],
          summary: 'Create a User Event',
          description: 'Creates a new event submitted by an authenticated user. Rate limited to 2 events per day per user.',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateEventInput' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Event created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      event: { $ref: '#/components/schemas/Event' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Not authenticated' },
            '429': { description: 'Rate limited (max 2 events/day)' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'CRON_SECRET token for cron job authentication',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sb-access-token',
          description: 'Supabase session cookie (set by login flow)',
        },
      },
      schemas: {
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string', enum: ['festival', 'job', 'sports', 'exchange', 'workshop', 'academic', 'other'] },
            event_time: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            source: { type: 'string', enum: ['connpass', 'peatix', 'user'] },
            image_url: { type: 'string', format: 'uri' },
            user_id: { type: 'string', format: 'uuid', nullable: true },
            organizer_name: { type: 'string' },
            original_url: { type: 'string', format: 'uri', nullable: true },
            attendees_count: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateEventInput: {
          type: 'object',
          required: ['title', 'event_time', 'location', 'image_url'],
          properties: {
            title: { type: 'string', example: 'Vietnamese Community Meetup in Tokyo' },
            description: { type: 'string', example: 'Monthly networking event for Vietnamese IT professionals' },
            category: { type: 'string', enum: ['festival', 'job', 'sports', 'exchange', 'workshop', 'academic', 'other'] },
            event_time: { type: 'string', format: 'date-time', example: '2026-05-01T18:00:00.000Z' },
            location: { type: 'string', example: 'Shibuya, Tokyo' },
            image_url: { type: 'string', format: 'uri' },
          },
        },
        SyncResult: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            fetched: { type: 'integer' },
            inserted: { type: 'integer' },
            updated: { type: 'integer' },
            skipped: { type: 'integer' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        SyncReport: {
          type: 'object',
          properties: {
            started_at: { type: 'string', format: 'date-time' },
            completed_at: { type: 'string', format: 'date-time' },
            duration_ms: { type: 'integer' },
            results: { type: 'array', items: { $ref: '#/components/schemas/SyncResult' } },
            total_fetched: { type: 'integer' },
            total_synced: { type: 'integer' },
          },
        },
        SyncResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            report: { $ref: '#/components/schemas/SyncReport' },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
