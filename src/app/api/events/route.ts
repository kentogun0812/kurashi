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
    // Được thực hiện một cách an toàn để không chặn việc tạo sự kiện nếu check lỗi
    let canCreate = true;
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: existingEvents, error: countError } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', user.id)
        .eq('source', 'user')
        .gte('created_at', startOfDay.toISOString());

      if (countError) {
        console.error('Rate limit check error:', countError);
        // Nếu lỗi query, ta log lại nhưng có thể cho phép tiếp tục thay vì chặn hoàn toàn
      } else if (existingEvents && existingEvents.length >= 2) { // Tạm thời nới lỏng lên 2 để test hoặc tránh false positive
        return NextResponse.json({ error: 'Bạn đã hết lượt tạo sự kiện hôm nay (tối đa 2 sự kiện/ngày)' }, { status: 429 });
      }
    } catch (e) {
      console.error('Rate limit check exception:', e);
    }

    // Fetch user profile for organizer_name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    // Insert new user event
    const newEvent = {
      title,
      description: description || '',
      category: category || 'festival',
      event_time,
      location,
      source: 'user',
      user_id: user.id,
      organizer_name: profile?.display_name || 'Thành viên cộng đồng',
      image_url,
    };

    const { data: createdEvent, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) {
      console.error('Insert event error:', error);
      return NextResponse.json({ error: 'Lỗi khi lưu sự kiện' }, { status: 500 });
    }

    // Revalidate the events page to show new data
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/[locale]/(public)/events', 'page');
    revalidatePath('/vi/events');
    revalidatePath('/en/events');
    revalidatePath('/jp/events');

    return NextResponse.json({ success: true, event: createdEvent }, { status: 201 });
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
