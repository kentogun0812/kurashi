import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in to create an event' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, event_time, location, image_url } = body;

    // Validation
    if (!title || !event_time || !location) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Tên, Thời gian, Địa điểm)' }, { status: 400 });
    }

    // Constraint: Bắt buộc phải có Link Ảnh
    if (!image_url || image_url.trim() === '') {
      return NextResponse.json({ error: 'Vui lòng thêm ảnh cho sự kiện' }, { status: 400 });
    }

    // Rate Limit Check: Mỗi người dùng chỉ được tạo tối đa 1 sự kiện mỗi ngày
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('organizer_id', user.id)
      .eq('source', 'user')
      .gte('created_at', startOfDay.toISOString());

    if (countError) {
      console.error('Rate limit check error:', countError);
      return NextResponse.json({ error: 'Lỗi hệ thống khi kiểm tra giới hạn' }, { status: 500 });
    }

    if (count !== null && count >= 1) {
      return NextResponse.json({ error: 'Bạn đã hết lượt tạo sự kiện hôm nay' }, { status: 429 });
    }

    // Insert new user event
    const newEvent = {
      title,
      description: description || '',
      category: category || 'Chung',
      event_time,
      location,
      source: 'user',
      organizer_id: user.id,
      image_url,
    };

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) {
      console.error('Insert event error:', error);
      return NextResponse.json({ error: 'Lỗi khi lưu sự kiện' }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data }, { status: 201 });
  } catch (error) {
    console.error('Event Creation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_time', { ascending: true });
      
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
    
    return NextResponse.json({ events: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
