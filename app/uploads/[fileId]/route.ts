import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const filePath = path.join(process.cwd(), 'media', `${fileId}.docx`);
  const fileExists = await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);
  if (!fileExists) {
    return new Response(`File '${fileId}' not found`, { status: 404 });
  }
  return fs
    .readFile(filePath)
    .then((fileBuffer) => {
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
        },
      });
    })
    .catch(() => {
      return new Response(`Unknown error while reading file '${fileId}'`, {
        status: 400,
      });
    });
}
