import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExt = file.name.split('.').pop() || 'jpg';
    const uniqueName = `upload-${uniqueSuffix}.${originalExt}`;
    
    const publicDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      await mkdir(publicDir, { recursive: true });
    } catch(e) {}

    const path = join(publicDir, uniqueName);
    await writeFile(path, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
