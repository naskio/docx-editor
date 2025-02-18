'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function uploadDocxFile(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) {
    return { status: 400, body: 'No file found' };
  }
  if (!file.name.endsWith('.docx')) {
    return { status: 400, body: 'Invalid file format' };
  }
  if (file.size === 0) {
    return { status: 400, body: 'Empty file' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { status: 413, body: 'File size exceeds the limit' };
  }

  const fileId = uuidv4();
  const filePath = path.join(process.cwd(), 'media', `${fileId}.docx`);
  // create parent directories if they don't exist
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  // write the file to disk
  const fileBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(fileBuffer));
  return {
    status: 200,
    body: fileId,
  };
}
