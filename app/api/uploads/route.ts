import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }
    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Invalid file format' },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the limit' },
        { status: 413 }
      );
    }

    const fileId = uuidv4(); // randomly generated file ID
    const mediaDir = path.join(process.cwd(), 'media');
    await fs.mkdir(mediaDir, { recursive: true });

    const filePath = path.join(mediaDir, `${fileId}.docx`);
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    return NextResponse.json({ fileId }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: `Internal server error` },
      { status: 500 }
    );
  }
}
