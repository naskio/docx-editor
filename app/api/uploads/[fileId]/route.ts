import { NextResponse, NextRequest } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  if (!fileId) {
    return new NextResponse(`File ID not provided`, { status: 400 });
  }
  const filePath = path.join(process.cwd(), 'media', `${fileId}.docx`);
  const fileExists = await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
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
    .catch(() => {
      return new NextResponse(`Unknown error while reading file '${fileId}'`, {
        status: 400,
      });
    });
}
