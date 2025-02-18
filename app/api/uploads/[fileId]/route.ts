import { NextResponse, NextRequest } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { TMP_DIR } from '@/lib/file-system';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  if (!fileId) {
    return new NextResponse(`File ID not provided`, { status: 400 });
  }
  const filePath = path.join(TMP_DIR, `${fileId}.docx`);
  const fileExists = await fs
    .access(filePath)
    .then(() => true)
    .catch((err) => {
      console.error(err);
      return false;
    });
  if (!fileExists) {
    return new NextResponse(`File '${fileId}' not found`, { status: 404 });
  }
  return fs
    .readFile(filePath)
    .then((fileBuffer) => {
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      return new NextResponse(`Unknown error while reading file '${fileId}'`, {
        status: 400,
      });
    });
}
