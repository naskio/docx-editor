import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { buildDocx } from '@/lib/build-docx';
import { TMP_DIR } from '@/lib/file-system';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const code = formData.get('code') as string | null;
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    let docxBlob: Blob;
    try {
      docxBlob = await buildDocx(code);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: `Error generating docx: ${err}` },
        { status: 400 }
      );
    }
    if (!docxBlob) {
      return NextResponse.json(
        { error: 'Failed to generate docx' },
        { status: 400 }
      );
    }
    const fileId = uuidv4(); // randomly generated file ID
    await fs.mkdir(TMP_DIR, { recursive: true });
    const filePath = path.join(TMP_DIR, `${fileId}.docx`);
    const fileBuffer = await docxBlob.arrayBuffer();
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
