import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase Admin Client để bỏ qua RLS khi insert từ cron job
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // Connpass API https://connpass.com/about/api/
    // Lấy các sự kiện liên quan đến "Vietnam" hoặc diễn ra ở Tokyo để demo
    const apiUrl = `https://connpass.com/api/v1/event/?keyword=vietnam,tokyo&count=10`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Connpass API: ${response.status}`);
    }

    const data = await response.json();
    const eventsToInsert = [];

    for (const item of data.events) {
      eventsToInsert.push({
        title: item.title,
        description: item.catch || item.description,
        category: 'Hội thảo', // Default mapping
        event_time: new Date(item.started_at).toISOString(),
        location: item.address || 'Online',
        source: 'connpass',
        image_url: '/image/default_event.jpg', // Connpass API doesn't always provide an image
        organizer_name: item.owner_display_name,
        original_url: item.event_url,
        attendees_count: item.accepted || 0,
      });
    }

    if (eventsToInsert.length > 0) {
      // Bỏ qua ID trùng lặp dựa trên title/original_url nếu cần, nhưng upsert thì tốt hơn.
      // Trong thiết kế init.sql không có unique url, nên chúng ta append hoặc filter để test.
      // Tạm thời insert thẳng (có thể bị duplicate nếu chạy nhiều lần)
      const { data: insertedData, error } = await supabase
        .from('events')
        .insert(eventsToInsert)
        .select();

      if (error) {
         console.error("Supabase Insert Error:", error);
         return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Successfully crawled ${insertedData.length} events from Connpass.`,
        events: insertedData
      });
    }

    return NextResponse.json({ success: true, message: 'No new events found.' });

  } catch (error: any) {
    console.error('Crawl Error:', error);
    return NextResponse.json({ success: false, error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
